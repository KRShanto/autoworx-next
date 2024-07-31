"use client";

import { usePopupStore } from "@/stores/popup";
import { Client } from "@prisma/client";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { deleteClient } from "./delete";

export default function CustomerListOptions({
  customer,
}: {
  customer: Client;
}) {
  const [loading, setLoading] = useState(false);
  const { open } = usePopupStore();

  async function handleDelete() {
    setLoading(true);
    await deleteClient(customer.id!);
    setLoading(false);
  }

  return (
    <div>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => open("EDIT_CUSTOMER", { customer })}
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
    </div>
  );
}
