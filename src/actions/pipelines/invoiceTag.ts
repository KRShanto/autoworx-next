"use server";

import { db } from "@/lib/db";

/**
 * Save a tag for an invoice.
 * @param invoiceId - The ID of the invoice.
 * @param tagId - The ID of the tag.
 * @returns The created invoice tag.
 */
export const saveInvoiceTag = async (invoiceId: string, tagId: number) => {
  try {
    const result = await db.invoiceTags.create({
      data: {
        invoiceId: invoiceId,
        tagId: tagId,
      },
    });
    return result;
  } catch (error) {
    console.log("Invoice tag model saving error", error);
    throw new Error("Invoice tag model");
  }
};

/**
 * Remove a tag from an invoice.
 * @param invoiceId - The ID of the invoice.
 * @param tagId - The ID of the tag.
 * @returns The result of the deletion operation.
 */
export const removeInvoiceTag = async (invoiceId: string, tagId: number) => {
  try {
    const result = await db.invoiceTags.deleteMany({
      where: {
        invoiceId: invoiceId,
        tagId: tagId,
      },
    });
    return result;
  } catch (error) {
    console.error("Error removing tag:", error);
    throw new Error("Failed to remove tag");
  }
};
