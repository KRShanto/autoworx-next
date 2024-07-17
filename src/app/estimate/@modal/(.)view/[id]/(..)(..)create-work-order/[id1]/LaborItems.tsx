import React, { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
import { Technician } from "@prisma/client";
import { getTechnician } from "../../query/getTechnician";
import { db } from "@/lib/db";
import { deleteTechnician } from "../../actions/deleteTechnician";
export default function LaborItems({
  workOrderId,
  materialId,
  serviceId,
  labor,
}: {
  workOrderId: number;
  materialId: number;
  serviceId: number;
  labor: any;
}) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const technicians = await getTechnician(
          serviceId,
          materialId,
          workOrderId,
        );
        setTechnicians(technicians);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchTechnicians();
  }, []);
  const handleTechnicianDelete = async (technicianId: number) => {
    try {
      await deleteTechnician(technicianId);
      const updatedTechnicians = technicians.filter(
        (technician) => technician.id !== technicianId,
      );
      setTechnicians(updatedTechnicians);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="mx-10 h-32 overflow-y-auto rounded-md border border-solid border-[#6571FF] p-2">
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      <p className="py-1 capitalize">{labor?.name}</p>
      <div className="grid grid-cols-4 gap-2">
        <Link
          href={`/estimate/labor/create?serviceId=${serviceId}&materialId=${materialId}&workOrderId=${workOrderId}`}
          className="rounded-full border border-[#6571FF] px-3 py-0.5"
        >
          + Add Labor
        </Link>
        {technicians.map((technician, index) => (
          <button
            key={technician.id}
            className="flex items-center justify-evenly space-x-1 rounded-full border bg-[#6571FF] px-3 py-0.5"
          >
            <Link
              href={`/estimate/labor/edit/${technician?.id}`}
              className="text-white"
            >
              labor {index + 1}
            </Link>
            <TiDeleteOutline
              onClick={() => handleTechnicianDelete(technician?.id)}
              className="text-xl text-white"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
