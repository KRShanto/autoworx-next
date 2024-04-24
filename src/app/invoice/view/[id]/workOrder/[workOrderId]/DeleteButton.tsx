"use client";

import { removeEmployee } from "./removeEmployee";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

export default function DeleteButton({ employeeId }: { employeeId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: number) {
    setLoading(true);
    await removeEmployee({ employeeId: id });
    setLoading(false);
  }

  return (
    <button className="text-red-500" onClick={() => handleDelete(employeeId)}>
      {loading ? <ThreeDots color="red" width={20} height={20} /> : <FaTimes />}
    </button>
  );
}
