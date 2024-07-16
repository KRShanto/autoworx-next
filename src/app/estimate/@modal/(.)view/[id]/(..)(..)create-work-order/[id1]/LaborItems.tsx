import React, { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
import { Technician } from "@prisma/client";
import { getTechnician } from "../../query/getTechnician";
export default function LaborItems({
  serviceId,
  labor,
}: {
  serviceId: number;
  labor: any;
}) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const technicians = await getTechnician(serviceId);
        setTechnicians(technicians);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchTechnicians();
  }, []);
  return (
    <div className="mx-10 h-32 overflow-y-auto rounded-md border border-solid border-[#6571FF] p-2">
      <p className="py-1 capitalize">{labor?.name}</p>
      <div className="grid grid-cols-4 gap-2">
        <Link
          href={`/estimate/labor/create?serviceId=${serviceId}`}
          className="rounded-full border border-[#6571FF] px-3 py-0.5"
        >
          + Add Labor
        </Link>
        {technicians.map((technician) => (
          <button
            key={technician.id}
            className="flex items-center justify-center space-x-1 rounded-full border bg-[#6571FF] px-3 py-0.5"
          >
            <Link
              href={`/estimate/labor/edit/${technician?.id}?serviceId=${serviceId}`}
              className="text-white"
            >
              labor name
            </Link>
            <TiDeleteOutline className="text-xl text-white" />
          </button>
        ))}
      </div>
    </div>
  );
}
