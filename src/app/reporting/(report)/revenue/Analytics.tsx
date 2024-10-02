import { db } from "@/lib/db";
import RevenueBarChartContainer from "./chart/RevenueBarChartContainer";
import RevenueLineChartContainer from "./chart/RevenueLineChartContainer";
import moment from "moment";
import { Prisma } from "@prisma/client";

export default async function Analytics() {
  let last30Days = moment().subtract(30, "days");
  let today = moment();

  let formattedToday = today.format("YYYY-MM-DD");
  let formattedLast30Days = last30Days.format("YYYY-MM-DD");
  console.log(formattedToday, formattedLast30Days);

  const last30DaysInvoice = await db.invoice.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(`${formattedLast30Days}T00:00:00.000Z`), // Start of the day
            lte: new Date(`${formattedToday}T23:59:59.999Z`), // End of the day
          },
        },
      ],
    },
    include: {
      invoiceItems: {
        include: {
          materials: true,
          labor: true,
        },
      },
    },
  });

  const days = Array.from({ length: 31 }, (_, i) => {
    let day = moment().subtract(i, "days").format("MMM Do, YYYY");
    return last30DaysInvoice.reduce(
      (acc, invoice) => {
        const profitInfo = invoice.invoiceItems.reduce(
          (
            acc,
            cur: Prisma.InvoiceItemGetPayload<{
              include: {
                materials: true;
                labor: true;
              };
            }>,
          ) => {
            const materialCostPrice = cur.materials.reduce(
              (acc, cur) => acc + Number(cur?.cost) * Number(cur?.quantity),
              0,
            );
            // labor cost price is assumed to be per hour
            const laborCostPrice =
              Number(cur.labor?.charge) * cur?.labor?.hours!;
            const costPrice = materialCostPrice + laborCostPrice;
            const formattedDate = moment(invoice.createdAt).format(
              "MMM Do, YYYY",
            );
            acc.profit = Number(invoice.grandTotal) - costPrice;
            acc.day = formattedDate;
            return acc;
          },
          {
            day: "",
            profit: 0,
          },
        );
        if (profitInfo.day === day) {
          acc.profit += profitInfo.profit;
        }
        return acc;
      },
      {
        day: day,
        profit: 0,
      },
    );
  }).reverse();
  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        <RevenueBarChartContainer />
        <RevenueLineChartContainer days={days} />
      </div>
    </div>
  );
}
