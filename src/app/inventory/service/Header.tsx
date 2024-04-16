"use client";

import { usePopupStore } from "@/stores/popup";

export default function Header() {
  const { open } = usePopupStore();

  return (
    <div className="flex items-center justify-between pr-10">
      <h1 className="text-2xl font-bold">Service List</h1>

      <button
        className="rounded-md bg-[#4DB6AC] px-7 py-2 text-white"
        onClick={() => open("ADD_SERVICE")}
      >
        New Service
      </button>
    </div>
  );
}
