"use client";
import React, { useEffect, useState, useTransition } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { Technician } from "@prisma/client";
import { getTechnicians } from "../../../../../actions/estimate/technician/getTechnicians";
import { deleteTechnician } from "../../../../../actions/estimate/technician/deleteTechnician";
import CreateAndEditLabor from "./CreateAndEditLabor";

// type TProps = {
//   technicians: (Technician & { name: string })[];
//   setTechnicians: Dispatch<SetStateAction<(Technician & { name: string })[]>>;
// };

export default function LaborItems({
  invoiceItemId,
  invoiceId,
  serviceId,
}: {
  invoiceItemId: number;
  invoiceId: string;
  serviceId: number;
}) {
  const [technicians, setTechnicians] = useState<
    (Technician & { name: string })[]
  >([]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const technicians = await getTechnicians({
          invoiceId,
          invoiceItemId,
        });
        setTechnicians(technicians);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchTechnicians();
  }, [invoiceId, serviceId]);

  const handleTechnicianDelete = async (technicianId: number) => {
    try {
      await deleteTechnician({
        id: technicianId,
        invoiceId,
      });
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

      <div className="flex flex-wrap items-center gap-2">
        <CreateAndEditLabor
          invoiceItemId={invoiceItemId}
          invoiceId={invoiceId}
          serviceId={serviceId}
          setTechnicians={setTechnicians}
        />

        {technicians.map((technician) => (
          <button
            key={technician.id}
            className="flex items-center justify-evenly space-x-1 text-nowrap rounded-full border bg-[#6571FF] px-3 py-0.5"
          >
            <CreateAndEditLabor
              invoiceItemId={invoiceItemId}
              invoiceId={invoiceId}
              serviceId={serviceId}
              technician={technician}
              setTechnicians={setTechnicians}
            />
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => handleTechnicianDelete(technician.id))
              }
            >
              <TiDeleteOutline className="text-xl text-white" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
