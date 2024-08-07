import React from "react";

interface HeaderProps {
  activeView: string;
  onToggleView: (view: string) => void;
}
export default function Header({ activeView, onToggleView }: HeaderProps) {
  return (
    <div className="flex items-center">
      <h1 className="mr-4 text-2xl font-bold text-gray-600">
        Employee Information
      </h1>
      <div className="flex">
        <button
          onClick={() => onToggleView("details")}
          className={`mr-2 border rounded px-4 py-2 ${activeView === "details" ? "bg-blue-600 text-white" : 'bg-white border-blue-600 text-blue-600'}`}
        >
          Employee Details
        </button>
        <button 
        onClick={() => onToggleView("performance")}
        className={` border rounded px-4  py-2 ${activeView === "performance" ? "bg-blue-600 text-white" : "border-blue-600 bg-white text-blue-600"}`}>
          Attendance & Performance
        </button>
      </div>
    </div>
  );
}
