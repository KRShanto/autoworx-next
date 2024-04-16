"use client";

import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { deleteService } from "./delete";
import { usePopupStore } from "@/stores/popup";
import { Service } from "@prisma/client";

export default function ServiceListOptions({ service }: { service: Service }) {
  const [loading, setLoading] = useState(false);
  const { open } = usePopupStore();

  async function handleDelete() {
    setLoading(true);
    await deleteService(service.id);
    setLoading(false);
  }

  return (
    <>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => open("EDIT_SERVICE", { service })}
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
