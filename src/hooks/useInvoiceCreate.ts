// useInvoiceCreate.ts
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { usePathname } from "next/navigation";
import { InvoiceType } from "@prisma/client";
import { createInvoice } from "@/actions/estimate/invoice/create";
import { updateInvoice } from "@/actions/estimate/invoice/update";
import { ServerAction } from "@/types/action";
import { useListsStore } from "@/stores/lists";
import { TErrorHandler } from "@/types/globalError";
import { z } from "zod";

export function useInvoiceCreate(type: InvoiceType) {
  const {
    invoiceId,
    subtotal,
    discount,
    tax,
    deposit,
    depositNotes,
    depositMethod,
    grandTotal,
    due,
    internalNotes,
    terms,
    policy,
    customerNotes,
    customerComments,
    photos,
    tasks,
    items,
    coupon,
    reset: resetEstimateCreate,
  } = useEstimateCreateStore();
  const { client, vehicle, status, reset: resetLists } = useListsStore();

  const pathaname = usePathname();

  async function handleSubmit(): Promise<ServerAction | TErrorHandler> {
    let photoPaths = [];
    const clientId = client?.id;
    const vehicleId = vehicle?.id;
    const columnId = status?.id;
    const isEditPage = pathaname.includes("/estimate/edit/");

    // upload photos
    if (photos.length > 0) {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Failed to upload photos");
        return res.json();
      }

      const json = await res.json();

      const data = json.data;
      console.log({ data });
      photoPaths.push(...data);
    }
    let res;
    if (isEditPage) {
      console.log({ items });
      res = await updateInvoice({
        id: invoiceId,
        clientId: clientId ? clientId : undefined,
        vehicleId: vehicleId ? vehicleId : undefined,
        columnId: columnId || undefined,
        subtotal,
        discount,
        tax,
        deposit,
        depositNotes,
        depositMethod,
        grandTotal,
        due,
        internalNotes,
        terms,
        policy,
        customerNotes,
        customerComments,
        photos: photoPaths,
        //@ts-ignore
        items: items.map(({ id, ...item }) => ({
          ...item,
          materials: item.materials.map((material) => ({
            ...material,
            cost: Number(material?.cost || 0),
            sell: Number(material?.sell || 0),
            discount: Number(material?.discount || 0),
          })),
        })),
        tasks,
        type,
      });
    } else {
      res = await createInvoice({
        invoiceId,
        type,
        clientId: clientId ? +clientId : undefined,
        vehicleId: vehicleId ? +vehicleId : undefined,

        columnId: columnId ? +columnId : undefined,
        subtotal,
        discount,
        tax,
        deposit,
        depositNotes,
        depositMethod,
        grandTotal,
        due,
        internalNotes,
        terms,
        policy,
        customerNotes,
        customerComments,
        photos: photoPaths,
        //@ts-ignore
        items: items.map(({ id, ...item }) => ({
          ...item,
          materials: item.materials.map((material) => ({
            ...material,
            cost: Number(material?.cost || 0),
            sell: Number(material?.sell || 0),
            discount: Number(material?.discount || 0),
          })),
        })),
        tasks,
        coupon,
      });
    }

    if (res.type === "success") {
      resetEstimateCreate();
      resetLists();
    }

    return res;
  }

  return handleSubmit;
}
