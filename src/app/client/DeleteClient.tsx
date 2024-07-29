"use client";

import { FaTimes } from "react-icons/fa";
import { deleteClientFunction } from "./deleteClientFunction";

export default function DeleteClient({ id }: { id: number }) {
  return (
    <button
      className="text-xl text-red-400"
      onClick={() => deleteClientFunction(id)}
    >
      <FaTimes />
    </button>
  );
}
