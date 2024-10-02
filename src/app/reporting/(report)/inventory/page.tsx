import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import Link from "next/link";
import { cn } from "@/lib/cn";
import FilterBySelection from "../../components/filter/FilterBySelection";
import Analytics from "./Analytics";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import { db } from "@/lib/db";
import { InventoryProductType } from "@prisma/client";
import moment from "moment";
import CalculationContainer from "./CalculationContainer";
import { Suspense } from "react";
import InventoryTableRow from "./InventoryTableRow";
type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
    leftChart: string;
    rightChart: string;
  };
};

type TSliderData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit";
};
const filterMultipleSliders: TSliderData[] = [
  {
    id: 1,
    type: "price",
    min: 0,
    max: 300,
    // defaultValue: [50, 250],
  },
  {
    id: 2,
    type: "cost",
    min: 0,
    max: 400,
    // defaultValue: [100, 300],
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];

const ProductType = {
  supply: "Supply",
  product: "Product",
};

export default async function InventoryReportPage({ searchParams }: TProps) {
  const filterOR = [];
  if (searchParams.category) {
    filterOR.push({
      type: searchParams.category as InventoryProductType,
    });
  } else if (searchParams.startDate && searchParams.endDate) {
    const formattedStartDate =
      searchParams.startDate &&
      moment(decodeURIComponent(searchParams.startDate!), "MM-DD-YYYY").format(
        "YYYY-MM-DD",
      );

    const formattedEndDate =
      searchParams.endDate &&
      moment(decodeURIComponent(searchParams.endDate!), "MM-DD-YYYY").format(
        "YYYY-MM-DD",
      );
    filterOR.push({
      createdAt: {
        gte:
          formattedStartDate && new Date(`${formattedStartDate}T00:00:00.000Z`), // Start of the day
        lte: formattedEndDate && new Date(`${formattedEndDate}T23:59:59.999Z`), // End of the day
      },
    });
  }

  const inventoryProducts = await db.inventoryProduct.findMany({
    where: {
      OR: filterOR.length ? filterOR : undefined,
      name: { contains: searchParams.search },
    },
    include: {
      InventoryProductHistory: {
        where: {
          type: "Sale",
        }
      },
    },
  });
  return (
    <div className="space-y-5">
      <Suspense fallback="loading...">
        <CalculationContainer />
      </Suspense>
      {/* filter section */}
      <div className="flex w-full items-center justify-between gap-x-3">
        <div className="flex flex-1 items-center space-x-4">
          <FilterBySearchBox searchText={searchParams.search as string} />
          <FilterByDateRange
            startDate={decodeURIComponent(searchParams.startDate as string)}
            endDate={decodeURIComponent(searchParams.endDate as string)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <FilterByMultiple
            searchParamsValue={searchParams}
            filterSliders={filterMultipleSliders}
          />
          <FilterBySelection
            selectedItem={searchParams?.category as string}
            items={Object.values(ProductType)}
            type="category"
          />
          <FilterBySelection
            selectedItem={searchParams?.service as string}
            items={["washing", "changing wheel", "full service"]}
            type="service"
          />
        </div>
      </div>
      {/* Table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Product #</th>
              <th className="border-b px-4 py-2 text-center">Name </th>
              <th className="border-b px-4 py-2 text-center">Average Cost</th>
              <th className="border-b px-4 py-2 text-center">Average Sell</th>
              <th className="border-b px-4 py-2 text-center">Stock Qty.</th>
              <th className="border-b px-4 py-2 text-center">Qty. Sold</th>
              <th className="border-b px-4 py-2 text-center">Type</th>
              <th className="border-b px-4 py-2 text-center">ROI Average</th>
            </tr>
          </thead>

          <tbody>
            {inventoryProducts.map((productInfo, index) => (
              <InventoryTableRow
                key={productInfo.id}
                productInfo={productInfo}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Analytics
        leftChart={searchParams.leftChart}
        rightChart={searchParams.rightChart}
      />
    </div>
  );
}
