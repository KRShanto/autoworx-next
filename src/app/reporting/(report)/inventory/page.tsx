import Analytics from "./Analytics";
import { db } from "@/lib/db";
import { InventoryProductType } from "@prisma/client";
import moment from "moment";
import CalculationContainer from "./CalculationContainer";
import { Suspense } from "react";
import InventoryTableRow from "./InventoryTableRow";
import FilterHeader from "./FilterHeader";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
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

export default async function InventoryReportPage({ searchParams }: TProps) {
  const session = (await auth()) as AuthSession | null;

  const filterOR = [];
  if (searchParams.startDate && searchParams.endDate) {
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
      companyId: session?.user?.companyId,
      category: {
        name: searchParams?.category ? searchParams.category : undefined,
      },
    },
    include: {
      category: true,
      InventoryProductHistory: {
        where: {
          type: "Sale",
        },
      },
    },
  });

  const getCategory = Array.from(
    new Set(inventoryProducts.map((product) => `${product?.category?.name}`)),
  ).map((uniqueName) => uniqueName);

  return (
    <div className="space-y-5">
      <Suspense fallback="loading...">
        <CalculationContainer />
      </Suspense>
      {/* filter section */}
      <FilterHeader
        searchParams={searchParams}
        filterMultipleSliders={filterMultipleSliders}
        getCategory={getCategory}
      />
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

      <Suspense fallback={"loading ..."}>
        <Analytics
          leftChart={searchParams.leftChart}
          rightChart={searchParams.rightChart}
        />
      </Suspense>
    </div>
  );
}
