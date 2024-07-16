import CreateAndEditLabor from "@/app/estimate/CreateAndEditLabor";
import { db } from "@/lib/db";
import React from "react";

export default async function AddNewLaborPage({
  searchParams: { serviceId },
}: {
  searchParams: { serviceId: string };
}) {
  const employees = await db.user.findMany({
    select: { id: true, name: true },
  });
  return <CreateAndEditLabor employees={employees} serviceId={serviceId} />;
}
