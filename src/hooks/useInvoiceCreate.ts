// useInvoiceCreate.ts
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useRouter, usePathname } from "next/navigation";
import { InvoiceType } from "@prisma/client";
import { create } from "@/app/estimate/create/actions/create";
import { update } from "@/app/estimate/edit/[id]/actions/update";
import { ServerAction } from "@/types/action";
import { useListsStore } from "@/stores/lists";

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
  } = useEstimateCreateStore();
  const { client, vehicle, status } = useListsStore();

  const pathaname = usePathname();

  async function handleSubmit(): Promise<ServerAction> {
    const photoPaths = [];
    const clientId = client?.id;
    const vehicleId = vehicle?.id;
    const statusId = status?.id;
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
      photoPaths.push(...data);
    }

    let res;
    if (isEditPage) {
      res = await update({
        id: invoiceId,
        clientId: clientId ? +clientId : undefined,
        vehicleId: vehicleId ? +vehicleId : undefined,
        statusId: statusId ? +statusId : undefined,
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
        // photos: photoPaths,
        items,
        tasks,
      });
    } else {
      res = await create({
        invoiceId,
        type,
        clientId: clientId ? +clientId : undefined,
        vehicleId: vehicleId ? +vehicleId : undefined,
        statusId: statusId ? +statusId : undefined,
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
        items,
        tasks,
      });
    }

    return res;
  }

  return handleSubmit;
}
