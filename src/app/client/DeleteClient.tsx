"use client";

import { FaTimes } from "react-icons/fa";
import { deleteClient } from "../../actions/client/delete";

export default function DeleteClient({ id }: { id: number }) {
  return (
    <button className="text-xl text-red-400" onClick={() => deleteClient(id)}>
      <FaTimes />
    </button>
  );
}
