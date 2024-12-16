import { ReturnPayment } from "@/actions/payment/getPayments";
import { usePaymentFilterStore } from "@/stores/paymentFilter";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import ManageRefund from "./ManageRefund";
import NewRefund from "./NewRefund";

export default function PaymentTable({ data }: { data: ReturnPayment[] }) {
  const { search, dateRange, amount, paidStatus, paymentMethod } =
    usePaymentFilterStore();
  const [filteredData, setFilteredData] = useState(data);

  function checkPaymentMethod(method: string) {
    if (paymentMethod === "All") {
      return true;
    } else if (method === paymentMethod) {
      return true;
    } else if (
      paymentMethod === "Other" &&
      method !== "Card" &&
      method !== "Cash" &&
      method !== "Cheque"
    ) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
        const isWithinDateRange =
          dateRange[0] && dateRange[1]
            ? moment(item.date).isSameOrAfter(dateRange[0], "day") &&
              moment(item.date).isSameOrBefore(dateRange[1], "day")
            : true;

        const isWithinAmountRange =
          item.amount >= amount[0] && item.amount <= amount[1];

        const isPaymentMethodMatch = checkPaymentMethod(item.method);

        const isPaidStatusMatch =
          paidStatus === "All"
            ? true
            : paidStatus === "Paid"
              ? item.paid
              : !item.paid;

        const isSearchMatch = search
          ? item.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
            item.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
            item.client.name?.toLowerCase().includes(search.toLowerCase())
          : true;

        return (
          isWithinDateRange &&
          isWithinAmountRange &&
          isPaymentMethodMatch &&
          isPaidStatusMatch &&
          isSearchMatch
        );
      }),
    );
  }, [data, dateRange, amount, paidStatus, paymentMethod, search]);

  return (
    <div className="min-h-[65vh] overflow-x-scroll rounded-md bg-white xl:overflow-hidden">
      <table className="w-full">
        {/*  Header */}
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="border-b px-4 py-2 text-left">Invoice#</th>
            <th className="border-b px-4 py-2 text-left">Customer</th>
            <th className="border-b px-4 py-2 text-left">Vehicle Info</th>
            <th className="border-b px-4 py-2 text-left">Transaction Date</th>
            <th className="border-b px-4 py-2 text-left">Amount</th>
            <th className="border-b px-4 py-2 text-left">Method</th>
            {/* TODO: skip for now. */}
            {/* <th className="border-b px-4 py-2 text-left">Refund</th> */}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}
            >
              <td className="border-b px-4 py-2">
                <Link
                  href={`/estimate/view/${item.invoiceId}`}
                  className="text-blue-500"
                >
                  {item.invoiceId}
                </Link>
              </td>
              <td className="border-b px-4 py-2">
                <Link
                  href={`/client/${item?.client?.id && item?.client?.id !== undefined ? item?.client?.id : ""}`}
                  className="text-blue-500"
                >
                  {item?.client?.name && item?.client?.name !== undefined
                    ? item?.client?.name
                    : "- - -"}
                </Link>
              </td>
              <td className="border-b px-4 py-2">
                {item?.vehicle && item?.vehicle !== undefined
                  ? item?.vehicle
                  : "- - -"}
              </td>
              <td className="border-b px-4 py-2">
                {moment.utc(item.date).format("YYYY-MM-DD")}
              </td>
              <td className="border-b px-4 py-2">${item.amount}</td>
              <td className="border-b px-4 py-2">{item.method}</td>
              {/* TODO: skip for now. */}
              {/* <td className="border-b px-4 py-2">
                {item.paid ? <ManageRefund /> : <NewRefund />}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
