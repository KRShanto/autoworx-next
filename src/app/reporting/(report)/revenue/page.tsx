import React, { Suspense } from "react";
import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import FilterBySelection from "../../components/filter/FilterBySelection";
import Analytics from "./Analytics";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import { db } from "@/lib/db";
import RevenueTableRow from "./RevenueTableRow";
import moment from "moment";
import { Prisma } from "@prisma/client";

type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
    price?: string;
    cost?: string;
    profit?: string;
  };
};

type TSliderData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit";
};

export type TInvoice = Prisma.InvoiceGetPayload<{
  include: {
    invoiceItems: {
      include: {
        materials: true;
        labor: true;
      };
    };
    vehicle: {
      select: {
        make: true;
        model: true;
        submodel: true;
      };
    };
    client: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

export default async function RevenueReportPage({ searchParams }: TProps) {
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

  const invoicesPromise = db.invoice.findMany({
    where: {
      invoiceItems: {
        some:
          searchParams.category || searchParams.service
            ? {
                OR: [
                  {
                    service: {
                      name: searchParams.service?.trim(),
                      category: { name: searchParams.category },
                    },
                  },
                ],
              }
            : undefined,
      },
      client: {
        OR: searchParams.search
          ? [
              { firstName: { contains: searchParams.search?.trim() } },
              { lastName: { contains: searchParams.search?.trim() } },
            ]
          : undefined,
      },
      OR: filterOR.length > 0 ? filterOR : undefined,
    },
    include: {
      invoiceItems: {
        include: {
          materials: true,
          labor: true,
        },
      },
      vehicle: {
        select: {
          make: true,
          model: true,
          submodel: true,
        },
      },
      client: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const servicesPromise = db.service.findMany({
    include: {
      category: true,
    },
  });

  const categoriesPromise = db.category.findMany();

  const [invoices, services, categories] = await Promise.all([
    invoicesPromise,
    servicesPromise,
    categoriesPromise,
  ]);

  const getService = services.map((service) => service.name);
  const getCategory = categories.map((category) => category.name);

  const maxPrice = Math.max(
    ...invoices.map((invoice) => Number(invoice.grandTotal)),
  );

  let maxCost = 0;
  let maxProfit = 0;

  const filteredInvoice = invoices.filter((invoice) => {
    const { costPrice, profitPrice } = invoice.invoiceItems.reduce(
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
        const laborCostPrice = Number(cur.labor?.charge) * cur?.labor?.hours!;
        const costPrice = materialCostPrice + laborCostPrice;
        acc.costPrice = costPrice;
        acc.profitPrice = Number(invoice.grandTotal) - acc.costPrice;
        return acc;
      },
      {
        costPrice: 0,
        profitPrice: 0,
      },
    );
    (invoice as any).costPrice = costPrice;
    (invoice as any).profitPrice = profitPrice;
    maxCost = Math.max(maxCost, costPrice);
    maxProfit = Math.max(maxProfit, profitPrice);
    if (!searchParams.price && !searchParams.cost && !searchParams.profit) {
      return true;
    }
    // filter by price of invoice
    if (searchParams.price) {
      const [minPrice, maxPrice] = searchParams.price.split("-").map(Number);
      if (
        Number(invoice?.grandTotal) >= minPrice &&
        Number(invoice?.grandTotal) <= maxPrice
      ) {
        return true;
      }
    }
    // filter by cost of invoice
    if (searchParams.cost) {
      const [minCost, maxCost] = searchParams.cost.split("-").map(Number);
      if (costPrice >= minCost && costPrice <= maxCost) {
        return true;
      }
    }
    // filter by profit of invoice
    if (searchParams.profit) {
      const [minProfit, maxProfit] = searchParams.profit.split("-").map(Number);
      if (profitPrice >= minProfit && profitPrice <= maxProfit) {
        return true;
      }
    }
  });

  // multiple filters
  const filterMultipleSliders: TSliderData[] = [
    {
      id: 1,
      type: "price",
      min: 0,
      max: maxPrice,
      // defaultValue: [50, 250],
    },
    {
      id: 2,
      type: "cost",
      min: 0,
      max: maxCost,
    },
    {
      id: 3,
      type: "profit",
      min: 0,
      max: maxProfit,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="WEEK" amount={0} />
        <Calculation content="MONTH" amount={0} />
        <Calculation content="YTD" amount={0} />
        <Calculation content="REVENUE" amount={0} />
      </div>
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
            items={getCategory}
            type="category"
          />
          <FilterBySelection
            selectedItem={searchParams?.service as string}
            items={getService}
            type="service"
          />
        </div>
      </div>
      {/* table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Customer</th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info </th>
              <th className="border-b px-4 py-2 text-center">Invoice #</th>
              <th className="border-b px-4 py-2 text-center">Date Delivered</th>
              <th className="border-b px-4 py-2 text-center">Price</th>
              <th className="border-b px-4 py-2 text-center">Cost</th>
              <th className="border-b px-4 py-2 text-center">Profit</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoice.map((invoice, index) => (
              <RevenueTableRow
                key={invoice.id}
                invoice={
                  invoice as TInvoice & {
                    costPrice: number;
                    profitPrice: number;
                  }
                }
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
