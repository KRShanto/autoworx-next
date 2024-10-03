import { db } from "@/lib/db";
import PaymentBarChartContainer from "./chart/PaymentBarChartContainer";
import PaymentPieChartContainer from "./chart/PaymentPieChartContainer";
import moment from "moment";

const paymentMethods = ["CARD", "CHECK", "CASH", "OTHER"];

export default async function Analytics() {
  // let last30Days = moment().subtract(30, "days");
  // let today = moment();

  // let formattedToday = today.format("YYYY-MM-DD");
  // let formattedLast30Days = last30Days.format("YYYY-MM-DD");

  const invoices = await db.invoice.findMany({
    select: {
      grandTotal: true,
    },
  });
  const payments = await db.payment.findMany({
    select: {
      amount: true,
      type: true,
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

  const paymentData = paymentMethods.map((method) => {
    return payments.reduce(
      (acc, cur) => {
        if (cur.type === method) {
          acc.payment += Number(cur.amount);
        }
        return acc;
      },
      {
        method: method,
        payment: 0,
      },
    );
  });

  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        {/* bar chart */}
        <PaymentBarChartContainer paymentData={paymentData} />
        {/* pie chart */}
        <PaymentPieChartContainer
          totalPayments={totalPayments}
          paymentDue={paymentDue}
        />
      </div>
    </div>
  );
}
