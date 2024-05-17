"use client";

import { useEstimatePopupStore } from "@/stores/estimate-popup";
import ServiceCreate from "./ServiceCreate";
import MaterialCreate from "./MaterialCreate";
import LaborCreate from "./LaborCreate";

export default function Create() {
  const { type } = useEstimatePopupStore();

  if (type === "SERVICE") return <ServiceCreate />;
  if (type === "MATERIAL") return <MaterialCreate />;
  if (type === "LABOR") return <LaborCreate />;
}
