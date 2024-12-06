import { db } from "@/lib/db";
// import RevenueSalesLineChartContainer from "../revenue/chart/RevenueLineChartContainer";
import ChartNavigateButtons from "./ChartNavigateButtons";
import { InventoryProductHistoryType } from "@prisma/client";
import InventorySalesBarChartContainer from "./chart/InventorySalesBarChartContainer";
import InventoryPurchasesBarChartContainer from "./chart/InventoryPurchasesBarChartContainer";
import InventorySalesLineChartContainer from "./chart/InventorySalesLineChartContainer";
import InventoryPurchasesLineChartContainer from "./chart/InventoryPurchasesLineChartContainer";
import moment from "moment";
type TProps = {
  leftChart: string;
  rightChart: string;
};

const leftSideChartString = {
  Sales: "Sales",
  Purchases: "Purchases",
  ROI: "ROI",
};

const rightSideChartString = {
  Sales: "Sales",
  Purchases: "Purchases",
};

export default async function Analytics({ leftChart, rightChart }: TProps) {
  let last30Days = moment().subtract(30, "days");
  let today = moment();

  let formattedToday = today.format("YYYY-MM-DD");
  let formattedLast30Days = last30Days.format("YYYY-MM-DD");

  // inventory data fetch
  const inventoryProducts = await db.inventoryProduct.findMany({
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
    select: {
      category: true,
      InventoryProductHistory: true,
      createdAt: true,
    },
  });

  // find unique categories for sales
  const getCategory = Array.from(
    new Set(inventoryProducts.map((inventory) => inventory?.category?.name)),
  );

  // sales data by category
  const salesData = getCategory.map((category) => {
    return inventoryProducts.reduce(
      (acc, cur) => {
        if (cur.category?.name === category) {
          acc.salePrice += cur.InventoryProductHistory.reduce((acc, cur) => {
            if ((cur.type as InventoryProductHistoryType) === "Sale") {
              acc += cur.quantity * Number(cur.price);
            }
            return acc;
          }, 0);
        }
        return acc;
      },
      { categoryName: category, salePrice: 0 },
    );
  });

  const daysSalesOrPurchasesObj = Array.from({ length: 31 }, (_, i) => {
    let day = moment().subtract(i, "days").format("MMM Do, YYYY");
    return day;
  }).reduce(
    (acc, day) => {
      acc[day] = { day: day, purchase: 0, sales: 0 };
      return acc;
    },
    {} as Record<string, { day: string; purchase: number; sales: 0 }>,
  );

  inventoryProducts.forEach((inventory) => {
    inventory.InventoryProductHistory.forEach((history) => {
      const day = moment(history.date).format("MMM Do, YYYY");
      if (
        (history.type as InventoryProductHistoryType) === "Purchase" &&
        daysSalesOrPurchasesObj[day as any]
      ) {
        console.log(history);
        daysSalesOrPurchasesObj[day as any].purchase +=
          history.quantity * Number(history.price);
      }
      if (
        (history.type as InventoryProductHistoryType) === "Sale" &&
        daysSalesOrPurchasesObj[day as any]
      ) {
        daysSalesOrPurchasesObj[day as any].sales +=
          history.quantity * Number(history.price);
      }
    });
  });

  const daysSalesOrPurchasesArr = Object.values(
    daysSalesOrPurchasesObj,
  ).reverse();

  let leftSideChart = <InventorySalesBarChartContainer salesData={salesData} />;
  let rightSideChart = (
    <InventorySalesLineChartContainer days={daysSalesOrPurchasesArr} />
  );

  // left side Chart selection
  if (leftSideChartString.Sales === leftChart) {
    leftSideChart = <InventorySalesBarChartContainer salesData={salesData} />;
  } else if (leftSideChartString.Purchases === leftChart) {
    const purchasesData = getCategory.map((category) => {
      return inventoryProducts.reduce(
        (acc, cur) => {
          if (cur.category?.name === category) {
            acc.salePrice += cur.InventoryProductHistory.reduce((acc, cur) => {
              if ((cur.type as InventoryProductHistoryType) === "Purchase") {
                acc += cur.quantity * Number(cur.price);
              }
              return acc;
            }, 0);
          }
          return acc;
        },
        { categoryName: category, salePrice: 0 },
      );
    });
    leftSideChart = (
      <InventoryPurchasesBarChartContainer purchasesData={purchasesData} />
    );
  } else if (leftSideChartString.ROI === leftChart) {
    leftSideChart = <p>will be added</p>;
  }

  // right side chart selection
  if (rightSideChartString.Sales === rightChart) {
    rightSideChart = (
      <InventorySalesLineChartContainer days={daysSalesOrPurchasesArr} />
    );
  } else if (rightSideChartString.Purchases === rightChart) {
    rightSideChart = (
      <InventoryPurchasesLineChartContainer days={daysSalesOrPurchasesArr} />
    );
  }

  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        <div className="">
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons
              key={1}
              buttonsValue={["Sales", "Purchases", "ROI"]}
              queryName="leftChart"
              chartDirectionValue={leftChart}
            />
          </div>
          {leftSideChart}
        </div>
        <div>
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons
              key={2}
              buttonsValue={["Sales", "Purchases"]}
              queryName="rightChart"
              chartDirectionValue={rightChart}
            />
          </div>
          {rightSideChart}
        </div>
      </div>
    </div>
  );
}
