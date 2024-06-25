"use client";

import { Item, useEstimateCreateStore } from "@/stores/estimate-create";
import { FullPayment } from "@/types/db";
import { Invoice, InvoicePhoto, Task } from "@prisma/client";
import { useEffect } from "react";

export default function SyncEstimate({
  invoice,
  items,
  photos,
  tasks,
  payment,
}: {
  invoice: Invoice;
  items: Item[];
  photos: InvoicePhoto[];
  tasks: Task[];
  payment: FullPayment;
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
      payment,
    });
  }, [invoice, items, photos, tasks, payment]);

  return null;
}
