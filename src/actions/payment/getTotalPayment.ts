"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

/**
 * Calculates the total payment amount for a given invoice.
 *
 * @param {string} invoiceId - The ID of the invoice.
 * @returns {Promise<number>} - The total payment amount.
 */
export async function getTotalPayment(invoiceId: string): Promise<number> {
  const companyId = await getCompanyId();

  // Fetch all payments for the given invoice and company
  const payments = await db.payment.findMany({
    where: {
      invoiceId: invoiceId,
      companyId: companyId,
    },
    select: {
      amount: true,
    },
  });

  // Sum up all the payment amounts
  const totalAmount = payments.reduce((sum, payment) => {
    return sum + (Number(payment.amount) || 0);
  }, 0);

  return totalAmount;
}
