import CreateAndEditLabor from "@/app/estimate/CreateAndEditLabor";
import React from "react";

export default function EditLaborPage({
  params: { laborId },
}: {
  params: { laborId: string };
}) {
  return <CreateAndEditLabor laborId={laborId} />;
}
