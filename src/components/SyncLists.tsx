"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import type {
  Category,
  Client,
  EmailTemplate,
  Labor,
  Material,
  Service,
  Tag,
  User,
  Vehicle,
  Vendor,
  Status,
  PaymentMethod,
  Invoice,
  Column,
} from "@prisma/client";
import { useEffect } from "react";

export function SyncLists({
  customers = [],
  vehicles = [],
  employees = [],
  templates = [],
  categories = [],
  services = [],
  materials = [],
  labors = [],
  tags = [],
  vendors = [],
  statuses = [],
  paymentMethods = [],
  estimates = [],
}: {
  customers?: Client[];
  vehicles?: Vehicle[];
  employees?: User[];
  templates?: EmailTemplate[];
  categories?: Category[];
  services?: Service[];
  materials?: (Material & { tags: Tag[] })[];
  labors?: Labor[];
  tags?: Tag[];
  vendors?: Vendor[];
  statuses?: Column[];
  paymentMethods?: PaymentMethod[];
  estimates?: Invoice[];
}) {
  const { reset } = useEstimateCreateStore();

  useEffect(() => {
    useListsStore.setState({
      customers,
      vehicles,
      employees,
      templates,
      categories,
      services,
      materials,
      labors,
      tags,
      vendors,
      statuses,
      paymentMethods,
      estimates,
    });
  }, [
    customers,
    vehicles,
    employees,
    templates,
    categories,
    services,
    materials,
    labors,
    tags,
    vendors,
    statuses,
    paymentMethods,
    estimates,
  ]);

  // Reset the estimate create store when the component mounts
  useEffect(() => {
    reset();
  }, []);
  return null;
}
