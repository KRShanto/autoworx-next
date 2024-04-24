"use client";

import { addEmployee } from "@/app/invoice/view/[id]/workOrder/[workOrderId]/addEmployee";
import { User } from "@prisma/client";
import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

export default function NewEmployeeForm({
  otherEmployees,
  workOrderId,
  invoiceId,
}: {
  otherEmployees: User[];
  workOrderId: number;
  invoiceId: string;
}) {
  const [shouldOpen, setShouldOpen] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  async function handleSubmit(employeeId: number) {
    setLoading(employeeId);
    await addEmployee({ workOrderId, employeeId, invoiceId });
    setLoading(null);
    setShouldOpen(false);
  }

  return (
    <>
      <button
        className="mx-auto mt-2 block rounded-lg bg-[#6571FF] p-2 text-sm text-white"
        onClick={() => setShouldOpen(!shouldOpen)}
      >
        {shouldOpen ? <FaTimes /> : <FaPlus />}
      </button>

      {shouldOpen && (
        <div className="mt-5 h-[200px] overflow-scroll">
          {otherEmployees.map((employee: User, index: number) => (
            <div
              className="mb-2 flex items-center justify-between rounded-md bg-gray-200 p-2 shadow-md"
              key={index}
            >
              <p>{employee.name}</p>
              <button
                className="text-blue-500"
                onClick={() => handleSubmit(employee.id)}
              >
                {loading === employee.id ? (
                  <ThreeDots color="blue" width={15} height={15} />
                ) : (
                  <FaPlus />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
