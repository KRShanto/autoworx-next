"use client";

import { usePopupStore } from "@/stores/popup";
import moment from "moment";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { deleteWorkOrder } from "./deleteWorkOrder";
import { Customer, Invoice, WorkOrder } from "@prisma/client";
import { createWorkOrder } from "./createWorkOrder";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WorkOrderComponent({
  invoice,
  customer,
  workOrders,
}: {
  invoice: Invoice;
  customer: Customer;
  workOrders: WorkOrder[];
}) {
  const router = useRouter();

  const [navbar, setNavbar] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: any) {
    e.preventDefault();

    setLoading(true);
    const id = await createWorkOrder(invoice.id);
    setLoading(false);

    router.push(`/invoice/view/${invoice.invoiceId}/workOrder/${id}`);
  }

  return (
    <div className="mb-10 mt-10 w-[35%]">
      {/* Navbar */}
      <div>
        <button
          className={`rounded-l-md border border-slate-300 px-8 py-1 ${
            navbar !== "ACTIVE" ? "bg-slate-300 text-black" : ""
          }`}
          onClick={() => setNavbar("ACTIVE")}
        >
          Active
        </button>
        <button
          className={`rounded-r-md border border-slate-300 px-8 py-1 ${
            navbar !== "ARCHIVED" ? "bg-slate-300 text-black" : ""
          }`}
          onClick={() => setNavbar("ARCHIVED")}
        >
          Archived
        </button>
      </div>

      {/* Active Work Orders */}
      {navbar === "ACTIVE" && (
        <div className="app-shadow w-full rounded-lg p-3">
          <div className="h-[300px] overflow-scroll">
            <table className="w-full table-fixed">
              <thead>
                <tr className="flex justify-between gap-2 text-xs uppercase text-white">
                  <th className="w-[40%] bg-[#6571FF] p-2 text-left uppercase">
                    Customer name
                  </th>
                  <th className="w-[25%] bg-[#6571FF] p-2 text-left uppercase">
                    Status
                  </th>
                  <th className="w-[20%] bg-[#6571FF] p-2 text-left uppercase">
                    Date
                  </th>
                  <th className="w-[20%] bg-[#6571FF] p-2 text-left uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {workOrders
                  .filter((work) => work.activeStatus === "Active")
                  .map((work, index: number) => {
                    const isEven = index % 2 === 0;
                    const bgColor = !isEven ? "bg-[#F4F4F4]" : "bg-[#EAEAEA]";

                    return (
                      <tr
                        className="flex justify-between gap-2 text-xs text-black"
                        key={index}
                      >
                        <td className={`text-left ${bgColor} w-[40%] p-2`}>
                          {customer.name}
                        </td>
                        <td className={`text-left ${bgColor} w-[25%] p-2`}>
                          {invoice.status}
                        </td>
                        <td className={`text-left ${bgColor} w-[20%] p-2`}>
                          {moment(work.createdAt).format("MMM DD, YYYY")}
                        </td>
                        <td
                          className={`text-center text-sm ${bgColor} flex w-[20%] items-center justify-center gap-2 p-2`}
                        >
                          <Link
                            href={`/invoice/view/${invoice.invoiceId}/workOrder/${work.id}`}
                            className="text-blue-500"
                          >
                            <FaEdit />
                          </Link>
                          <DeleteButton id={work.id} />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <button
            className="mx-auto mt-3 block rounded-md bg-[#03A7A2] px-6 py-3 text-base text-white"
            onClick={handleCreate}
          >
            {loading ? (
              <ThreeDots color="white" height={30} width={30} />
            ) : (
              "Create Work Order"
            )}
          </button>
        </div>
      )}

      {/* Archived Work Orders */}
      {navbar === "ARCHIVED" && (
        <div className="app-shadow w-full rounded-lg p-3">
          <div className="h-[300px] overflow-scroll">
            <table className="w-full table-fixed">
              <thead>
                <tr className="flex justify-between gap-2 text-xs uppercase text-white">
                  <th className="w-[50%] bg-[#6571FF] p-2 text-left uppercase">
                    Customer name
                  </th>
                  <th className="w-[30%] bg-[#6571FF] p-2 text-left uppercase">
                    Status
                  </th>
                  <th className="w-[30%] bg-[#6571FF] p-2 text-left uppercase">
                    Delete Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {workOrders &&
                  workOrders
                    .filter((work: any) => work.activeStatus === "Archived")
                    .map((work: any, index: number) => {
                      const isEven = index % 2 === 0;
                      const bgColor = !isEven ? "bg-[#F4F4F4]" : "bg-[#EAEAEA]";

                      return (
                        <tr
                          className="flex justify-between gap-2 text-xs text-black"
                          key={index}
                        >
                          <td className={`text-left ${bgColor} w-[50%] p-2`}>
                            {customer.name}
                          </td>
                          <td className={`text-left ${bgColor} w-[30%] p-2`}>
                            {invoice.status}
                          </td>
                          <td className={`text-left ${bgColor} w-[30%] p-2`}>
                            {moment(work.deleted_at).format("MMM DD, YYYY")}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteButton({ id }: { id: number }) {
  const [deleteLoading, deleteSetLoading] = useState(false);

  async function handleDelete() {
    deleteSetLoading(true);
    await deleteWorkOrder(id);
    deleteSetLoading(false);
  }

  return (
    <button className="text-red-500" onClick={handleDelete}>
      {deleteLoading ? (
        <ThreeDots color="red" height={20} width={20} />
      ) : (
        <MdDelete />
      )}
    </button>
  );
}
