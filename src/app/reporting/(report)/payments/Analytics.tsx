import { db } from "@/lib/db";
import PaymentBarChartContainer from "./chart/PaymentBarChartContainer";
import PaymentPieChartContainer from "./chart/PaymentPieChartContainer";

export default async function Analytics() {
  const invoices = await db.invoice.findMany({
    select: {
      grandTotal: true,
    },
  });
  const payments = await db.payment.findMany({
    select: {
      amount: true,
    },
  });

  const totalInvoicesGrandTotal = invoices.reduce(
    (acc, invoice) => acc + Number(invoice.grandTotal),
    0,
  );

  const totalPayments = payments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  const paymentDue = totalInvoicesGrandTotal - totalPayments;
  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        {/* bar chart */}
        <PaymentBarChartContainer />
        {/* pie chart */}
        <PaymentPieChartContainer
          totalPayments={totalPayments}
          paymentDue={paymentDue}
        />
      </div>
    </div>
  );
}
