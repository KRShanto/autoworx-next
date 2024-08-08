"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "details";
  const router = useRouter();

  return (
    <div className="flex items-center">
      <h1 className="mr-4 text-2xl font-bold text-gray-600">
        Employee Information
      </h1>
      <div className="flex">
        <button
          onClick={() => router.push(`/employee/${id}?view=details`)}
          className={`mr-2 rounded border px-4 py-2 ${activeView === "details" ? "bg-blue-600 text-white" : "border-blue-600 bg-white text-blue-600"}`}
        >
          Employee Details
        </button>
        <button
          onClick={() => router.push(`/employee/${id}?view=performance`)}
          className={`rounded border px-4 py-2 ${activeView === "performance" ? "bg-blue-600 text-white" : "border-blue-600 bg-white text-blue-600"}`}
        >
          Attendance & Performance
        </button>
      </div>
    </div>
  );
}
