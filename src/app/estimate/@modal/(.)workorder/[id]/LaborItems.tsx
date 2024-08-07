import React, { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
import { Technician } from "@prisma/client";
import { getTechnicians } from "../../../../../actions/estimate/technician/getTechnicians";
import { deleteTechnician } from "../../../../../actions/estimate/technician/deleteTechnician";
import CreateAndEditLabor from "./CreateAndEditLabor";

export default function LaborItems({
  invoiceId,
  serviceId,
}: {
  invoiceId: string;
  serviceId: number;
}) {
  const [technicians, setTechnicians] = useState<
    (Technician & { name: string })[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const technicians = await getTechnicians({
          invoiceId,
          serviceId,
        });
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

      <div className="grid grid-cols-4 gap-2">
        <CreateAndEditLabor
          invoiceId={invoiceId}
          serviceId={serviceId}
          setTechnicians={setTechnicians}
        />

        {technicians.map((technician, index) => (
          <button
            key={technician.id}
            className="flex items-center justify-evenly space-x-1 rounded-full border bg-[#6571FF] px-3 py-0.5"
          >
            <CreateAndEditLabor
              invoiceId={invoiceId}
              serviceId={serviceId}
              technician={technician}
              setTechnicians={setTechnicians}
            />
            <TiDeleteOutline
              onClick={() => handleTechnicianDelete(technician.id)}
              className="text-xl text-white"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
