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
          materials: {
            include: {
              category: true,
            },
          },
          labor: true,
        },
      },
    },
  });

  const daysProfit = Array.from({ length: 31 }, (_, i) => {
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
              (acc, cur) =>
                acc + Number(cur?.cost || 0) * Number(cur?.quantity || 0),
              0,
            );
            // labor cost price is assumed to be per hour
            const laborCostPrice =
              Number(cur.labor?.charge || 0) * cur?.labor?.hours! || 0;
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

  const categoryByCalculation: {
    categoryName: string;
    salePrice: number;
  }[] = [];

  last30DaysInvoice.forEach((invoice) => {
    invoice.invoiceItems.reduce(
      (
        acc,
        cur: Prisma.InvoiceItemGetPayload<{
          include: {
            materials: {
              include: {
                category: true;
              };
            };
            labor: true;
          };
        }>,
      ) => {
        const materialCostPrice = cur.materials.reduce(
          (acc, cur) =>
            acc + Number(cur?.cost || 0) * Number(cur?.quantity || 0),
          0,
        );
        // labor cost price is assumed to be per hour
        const laborCostPrice =
          Number(cur.labor?.charge || 0) * cur?.labor?.hours! || 0;
        const costPrice = materialCostPrice + laborCostPrice;
        cur.materials.forEach((material, i) => {
          const categoryIndex = categoryByCalculation.findIndex(
            (category) => category.categoryName === material.category?.name,
          );

          if (categoryIndex === -1) {
            categoryByCalculation.push({
              categoryName: material.category?.name!,
              salePrice: acc + Number(invoice.grandTotal || 0) - costPrice,
            });
          } else {
            categoryByCalculation[categoryIndex].salePrice +=
              acc + Number(invoice.grandTotal || 0) - costPrice;
          }
        });
        return acc + Number(invoice.grandTotal) - costPrice;
      },
      0,
    );
  });

  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        <RevenueBarChartContainer data={categoryByCalculation} />
        <RevenueLineChartContainer days={daysProfit} />
      </div>
    </div>
  );
}
