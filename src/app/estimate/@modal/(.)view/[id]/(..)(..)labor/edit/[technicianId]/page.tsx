import CreateAndEditLabor from "@/app/estimate/CreateAndEditLabor";
import { db } from "@/lib/db";
import React from "react";

export default async function EditLaborPage({
  params: { technicianId },
  searchParams: { serviceId },
}: {
  params: { technicianId: string };
  searchParams: { serviceId: string };
}) {
  const employees = await db.user.findMany({
    select: { id: true, name: true },
  });
  const technician = await db.technician.findUnique({
    where: { id: Number(technicianId) },
  });
  return (
    <CreateAndEditLabor
      employees={employees}
      serviceId={serviceId}
      technician={JSON.parse(JSON.stringify(technician)) || null}
    />
  );
}
