"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

 export async function getTotalPayment(invoiceId: string): Promise<number> {
  const companyId = await getCompanyId();
  const payments = await db.payment.findMany({
    where: {
      invoiceId: invoiceId,
      companyId: companyId,
    },
    select: {
      amount: true,
    },
  });

  const totalAmount = payments.reduce((sum, payment) => {
    return sum + (Number(payment.amount) || 0);
  }, 0);

  return totalAmount;
}
