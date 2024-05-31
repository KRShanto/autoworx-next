"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import {
  Invoice,
  InvoicePhoto,
  Labor,
  Material,
  Service,
  Tag,
  Task,
} from "@prisma/client";
import { useEffect } from "react";

interface Item {
  id: number;
  service: Service | null;
  material: Material | null;
  labor: Labor | null;
  tags: Tag[];
}

export default function SyncEstimate({
  invoice,
  items,
  photos,
  tasks,
}: {
  invoice: Invoice;
  items: Item[];
  photos: InvoicePhoto[];
  tasks: Task[];
}) {
  useEffect(() => {
    useEstimateCreateStore.setState({
      invoiceId: invoice.id,
      subtotal: parseFloat(invoice.subtotal?.toString() || "0"),
      discount: parseFloat(invoice.discount?.toString() || "0"),
      tax: parseFloat(invoice.tax?.toString() || "0"),
      deposit: parseFloat(invoice.deposit?.toString() || "0"),
      depositNotes: invoice.depositNotes || "",
      depositMethod: invoice.depositMethod || "",
      grandTotal: parseFloat(invoice.grandTotal?.toString() || "0"),
      due: parseFloat(invoice.due?.toString() || "0"),
      internalNotes: invoice.internalNotes || "",
      terms: invoice.terms || "",
      policy: invoice.policy || "",
      customerNotes: invoice.customerNotes || "",
      customerComments: invoice.customerComments || "",
      // photos, // TODO
      tasks: tasks.map((task) => ({
        id: task.id,
        task: `${task.title}: ${task.description || ""}`,
      })),
      items,
      currentSelectedCategoryId: null,
    });
  }, [invoice, items, photos, tasks]);

  return null;
}
