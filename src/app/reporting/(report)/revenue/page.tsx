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
    price?: string;
    cost?: string;
    profit?: string;
  };
};

export type TSliderData = {
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

  const invoicesPromise = db.invoice.findMany({
    where: {
      companyId: session?.user?.companyId,
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

  const filteredInvoices =
    searchParams?.search && invoices
      ? invoices.filter((invoice) => {
          if (!invoice.client && !invoice.id) {
            return false;
          }
          const fullName = `${invoice?.client!.firstName} ${invoice?.client?.lastName}`;
          return (
            fullName
              .toLowerCase()
              .includes(searchParams?.search?.trim()?.toLowerCase() || "") ||
            invoice.id.toString().includes(searchParams?.search?.trim() || "")
          );
        })
      : invoices;

  const getService = services.map((service) => service.name);
  const getCategory = categories.map((category) => category.name);

  const maxPrice = Math.max(
    ...filteredInvoices.map((invoice) => Number(invoice.grandTotal)),
  );

  let maxCost = 0;
  let maxProfit = 0;

  const filteredInvoice = filteredInvoices.filter((invoice) => {
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
          (acc, cur) =>
            acc + Number(cur?.cost || 0) * Number(cur?.quantity || 0),
          0,
        );
        // labor cost price is assumed to be per hour
        const laborCostPrice =
          Number(cur.labor?.charge || 0) * cur?.labor?.hours! || 0;
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

  // Calculate the total week profit (Invoice has a `profit` field)
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  const weeklyInvoices = filteredInvoice.filter(
    (invoice) =>
      new Date(invoice.createdAt) >= startOfWeek &&
      new Date(invoice.createdAt) <= endOfWeek,
  );

  const totalWeekProfit = weeklyInvoices.reduce(
    (total, invoice) => total + ((invoice as any).profitPrice || 0),
    0,
  );

  // Calculate the total month profit (Invoice has a `profit` field)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthlyInvoices = filteredInvoice.filter(
    (invoice) =>
      new Date(invoice.createdAt) >= startOfMonth &&
      new Date(invoice.createdAt) <= endOfMonth,
  );

  const totalMonthProfit = monthlyInvoices.reduce(
    (total, invoice) => total + ((invoice as any).profitPrice || 0),
    0,
  );

  // Calculate the all time profit (Invoice has a `profit` field)
  const totalProfit = filteredInvoice.reduce(
    (total, invoice) => total + ((invoice as any).profitPrice || 0),
    0,
  );

  // profit for the filtered invoices
  const totalFilteredProfit = filteredInvoice.reduce(
    (total, invoice) => total + ((invoice as any).profitPrice || 0),
    0,
  );

  return (
    <div className="space-y-5">
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="WEEK" amount={totalWeekProfit} />
        <Calculation content="MONTH" amount={totalMonthProfit} />
        <Calculation content="YTD" amount={totalProfit} />
        <Calculation content="REVENUE" amount={totalFilteredProfit} />
      </div>
      {/* filter section */}
      <FilterHeader
        searchParams={searchParams}
        filterMultipleSliders={filterMultipleSliders}
        getCategory={getCategory}
        getService={getService}
      />
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
