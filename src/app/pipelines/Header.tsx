import React from "react";

interface HeaderProps {
  activeView: string;
  onToggleView: (view: string) => void;
}
export default function Header({ activeView, onToggleView }: HeaderProps) {
  return (
    <div className="flex items-center">
      <h1 className="mr-4 text-2xl font-bold text-gray-600">Sales Pipelines</h1>
      <div className="flex">
        <button
          onClick={() => onToggleView("workOrders")}
          className={`mr-2 rounded border px-4 py-2 ${activeView === "workOrders" ? "bg-[#6571FF] text-white" : "border-[#6571FF] bg-white text-[#6571FF]"}`}
        >
          Work Orders
        </button>
        <button
          onClick={() => onToggleView("pipelines")}
          className={`rounded border px-4 py-2 ${activeView === "pipelines" ? "bg-[#6571FF] text-white" : "border-[#6571FF] bg-white text-[#6571FF]"}`}
        >
          Pipelines
        </button>
      </div>
    </div>
  );
}
