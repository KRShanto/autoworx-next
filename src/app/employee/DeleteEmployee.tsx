"use client";

import { deleteEmployee } from "@/actions/employee/delete";
import { User } from "@prisma/client";
import React from "react";
import { FaTimes } from "react-icons/fa";

export default function DeleteEmployee({ employee }: { employee: User }) {
  return (
    <button
      className="text-xl text-red-400"
      onClick={() => deleteEmployee(employee.id)}
    >
      <FaTimes />
    </button>
  );
}
