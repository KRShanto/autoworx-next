import { cn } from "@/lib/cn";
import moment from "moment";
import Link from "next/link";
import React from "react";

export default function PaymentTab() {
  const data = [
    {
      id: 3532532,
      vehicle: "Toyota",
      service: "Service Number 1",
      amount: 69,
      date: new Date(),
      paymentMethod: "Cash",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
    },
    {
      id: 53252352,
      vehicle: "Mercedes",
      service: "Service Number 2",
      amount: 55,
      date: new Date(),
      paymentMethod: "Visa/Mastercard",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
    },
    {
      id: 102202022,
      vehicle: "BMW",
      service: "Service Number 3",
      amount: 42,
      date: new Date(),
      paymentMethod: "Cash",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
    },
    {
      id: 311112525,
      vehicle: "Lamborghini",
      service: "Service Number 4",
      amount: 433,
      date: new Date(),
      paymentMethod: "Bkash",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
    },
  ];

  const evenColor = "bg-white";
  const oddColor = "bg-[#F8FAFF]";

  return (
    <div className="h-full">
      {/* Section 1 */}
      <div className="flex h-[25%] items-center justify-evenly">
        <div className="flex border border-slate-400">
          <div className="bg-[#F8FAFF] p-5 px-10 font-semibold">
            <h3>Invoice Payment</h3>
            <p className="text-center">$69</p>
          </div>

          <div className="p-5 px-10 font-semibold">
            <h3>Total Outstanding</h3>
            <p className="text-center">$345</p>
          </div>
        </div>

        <div className="border border-slate-400 text-sm">
          <h3 className="p-3 py-1">Most Frequent Services</h3>
          <div>
            <div className="flex gap-44 bg-[#F8FAFF] p-3 py-1">
              <p>Service Number 1</p>
              <p>Ordred 69 times</p>
            </div>
            <div className="flex gap-44 p-3 py-1">
              <p>Service Number 2</p>
              <p>Ordred 55 times</p>
            </div>
            <div className="flex gap-44 bg-[#F8FAFF] p-3 py-1">
              <p>Service Number 3</p>
              <p>Ordred 42 times</p>
            </div>
            <div className="flex gap-44 p-3 py-1">
              <p>Service Number 4</p>
              <p>Ordred 433 times</p>
            </div>
          </div>
        </div>

        <div className="flex border border-slate-400">
          <div className="bg-[#F8FAFF] p-5 px-10 font-semibold">
            <h3>Total Paid</h3>
            <p className="text-center">$469</p>
          </div>

          <div className="p-5 px-10 font-semibold">
            <h3>Total Transactions</h3>
            <p className="text-center">345</p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <h3 className="mb-1 mt-3 font-semibold">Invoice Payments</h3>
      <div className="h-[30%] overflow-scroll border">
        <table className="w-full text-xs">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="px-10 text-left">Invoice ID</th>
              <th className="px-10 text-left">Vehicle</th>
              <th className="px-10 text-left">Amount</th>
              <th className="px-10 text-left">Date</th>
              <th className="text-nowrap px-10 text-left">Payment Method</th>
              <th className="px-10 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {data.map((data, index) => (
              <tr
                key={data.id}
                className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
              >
                <td className="h-12 px-10 text-left">
                  <Link
                    href={`/estimate/view/${data.id}`}
                    passHref
                    className="text-blue-600"
                  >
                    #{data.id}
                  </Link>
                </td>
                <td className="px-10 text-left">{data.vehicle}</td>
                <td className="px-10 text-left">${data.amount}</td>

                <td className="px-10 text-left">
                  {moment(data.date).format("DD.MM.YYYY")}
                </td>
                <td className="px-10 text-left">{data.paymentMethod}</td>
                <td className="px-10 text-left">{data.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3 */}
      <h3 className="mb-1 mt-3 font-semibold">Transaction History</h3>
      <div className="h-[30%] overflow-scroll border">
        <table className="w-full text-xs">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="px-10 text-left">Invoice ID</th>
              <th className="px-10 text-left">Vehicle</th>
              <th className="px-10 text-left">Amount</th>
              <th className="px-10 text-left">Date</th>
              <th className="text-nowrap px-10 text-left">Payment Method</th>
              <th className="px-10 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {data.map((data, index) => (
              <tr
                key={data.id}
                className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
              >
                <td className="h-12 px-10 text-left">
                  <Link
                    href={`/estimate/view/${data.id}`}
                    passHref
                    className="text-blue-600"
                  >
                    #{data.id}
                  </Link>
                </td>
                <td className="px-10 text-left">{data.vehicle}</td>
                <td className="px-10 text-left">${data.amount}</td>

                <td className="px-10 text-left">
                  {moment(data.date).format("DD.MM.YYYY")}
                </td>
                <td className="px-10 text-left">{data.paymentMethod}</td>
                <td className="px-10 text-left">{data.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
