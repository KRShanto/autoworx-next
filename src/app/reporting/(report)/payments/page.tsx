import Calculation from "../../components/Calculation";

import { cn } from "@/lib/cn";
import { getClientsData } from "../../data";

import Analytics from "./Analytics";

import { db } from "@/lib/db";
import { formatDate } from "@/utils/taskAndActivity";
import moment from "moment";
import { Suspense } from "react";
import FilterHeader from "./FilterHeader";
type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
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
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];
export default async function PaymentReportPage({ searchParams }: TProps) {
  const filterOR = [];
  if (searchParams.search) {
    filterOR.push({ invoiceId: { contains: searchParams.search?.trim() } });
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

  const paymentInfo = await db.payment.findMany({
    where: {
      OR: filterOR.length ? filterOR : undefined,
      invoice: {
        client: {
          OR: searchParams.search
            ? [
                { firstName: { contains: searchParams.search?.trim() } },
                { lastName: { contains: searchParams.search?.trim() } },
              ]
            : undefined,
        },
      },
    },
    include: {
      invoice: {
        select: {
          due: true,
          vehicle: true,
          client: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  // find the average value
  const totalAmount = paymentInfo.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );
  const averageValue = totalAmount / paymentInfo.length;

  // find the outstanding payment (total due)
  const totalDue = paymentInfo.reduce(
    (acc, payment) => acc + Number(payment.invoice?.due),
    0,
  );

  return (
    <div className="space-y-5">
      {/* filter section */}
      <FilterHeader
        filterMultipleSliders={filterMultipleSliders}
        searchParams={searchParams}
      />
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="AVERAGE VALUE" amount={averageValue} />
        <Calculation content="OUTSTANDING PAYMENT" amount={totalDue} />
        <Calculation content="TOTAL PAYMENT" amount={totalAmount} />
        <Calculation content="REFUND RATE" amount={0} />
      </div>
      {/* Table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Date</th>
              <th className="border-b px-4 py-2 text-center">Invoice # </th>
              <th className="border-b px-4 py-2 text-center">Client Name</th>
              <th className="border-b px-4 py-2 text-center">Vehicle Info</th>
              <th className="border-b px-4 py-2 text-center">Payment Method</th>
              <th className="border-b px-4 py-2 text-center">Total Amount</th>
              <th className="border-b px-4 py-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {paymentInfo.map((payment, index) => {
              const paymentStatus =
                Number(payment.invoice?.due) <= 0 ? "paid" : "due";
              return (
                <tr
                  key={payment.id}
                  className={cn(
                    "cursor-pointer rounded-md py-3",
                    index % 2 === 0 ? "bg-white" : "bg-blue-100",
                  )}
                >
                  <td className="border-b px-4 py-2 text-center">
                    {payment?.date && formatDate(payment.date)}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {payment.invoiceId}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {payment.invoice?.client?.firstName}{" "}
                    {payment.invoice?.client?.lastName}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {payment.invoice?.vehicle?.year} -{" "}
                    {payment.invoice?.vehicle?.make} -{" "}
                    {payment.invoice?.vehicle?.model}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {payment.type}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {Number(payment.amount)}
                  </td>
                  <td
                    className={cn(
                      `border-b px-4 py-2 text-center`,
                      paymentStatus === "due" && "text-red-500",
                      paymentStatus === "paid" && "text-green-500",
                    )}
                  >
                    {paymentStatus}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Suspense fallback="loading...">
        <Analytics />
      </Suspense>
    </div>
  );
}
