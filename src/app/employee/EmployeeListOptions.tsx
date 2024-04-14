"use client";

import { EmployeeType } from "@/types/db";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { deleteEmployee } from "./delete";
import { usePopupStore } from "@/stores/popup";
import { User } from "@prisma/client";

export default function EmployeeListOptions({ employee }: { employee: User }) {
  const [loading, setLoading] = useState(false);
  const { open } = usePopupStore();

  async function handleDelete() {
    setLoading(true);
    await deleteEmployee(employee.id);
    setLoading(false);
  }

  return (
    <>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => open("EDIT_EMPLOYEE", { employee })}
      >
        <FaRegEdit />
      </button>
      <button
        className="ml-4 text-red-500 hover:text-red-700"
        onClick={handleDelete}
      >
        {loading ? (
          <ThreeDots color="red" height={20} width={20} />
        ) : (
          <MdDelete />
        )}
      </button>
    </>
  );
}
