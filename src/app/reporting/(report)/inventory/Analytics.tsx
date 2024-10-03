import { db } from "@/lib/db";
import RevenueSalesLineChartContainer from "../revenue/chart/RevenueLineChartContainer";
import ChartNavigateButtons from "./ChartNavigateButtons";
import { InventoryProductHistoryType } from "@prisma/client";
import InventorySalesBarChartContainer from "./chart/InventorySalesBarChartContainer";
import InventoryPurchasesBarChartContainer from "./chart/InventoryPurchasesBarChartContainer";
import InventorySalesLineChartContainer from "./chart/InventorySalesLineChartContainer";
import InventoryPurchasesLineChartContainer from "./chart/InventoryPurchasesLineChartContainer";
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
  // sales data fetch
  const inventoryProducts = await db.inventoryProduct.findMany({
    include: {
      category: true,
      InventoryProductHistory: true,
    },
  });

  // find unique categories for sales
  const getCategory = Array.from(
    new Set(inventoryProducts.map((inventory) => inventory?.category?.name)),
  );

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

  
  const daysSales = Array.from({ length: 31 }, (_, i) => {
    return { day: `Day ${i + 1}`, profit: Math.floor(Math.random() * 1000) };
  });

  let leftSideChart = <InventorySalesBarChartContainer salesData={salesData} />;
  let rightSideChart = <InventorySalesLineChartContainer days={daysSales} />;

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
  } else if (rightSideChartString.Sales === rightChart) {
    rightSideChart = <InventorySalesLineChartContainer days={daysSales} />;
  } else if (rightSideChartString.Purchases === rightChart) {
    rightSideChart = <InventoryPurchasesLineChartContainer days={daysSales} />;
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
