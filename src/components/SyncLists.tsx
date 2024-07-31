"use client";

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
  statuses?: Status[];
  paymentMethods?: PaymentMethod[];
  estimates?: Invoice[];
}) {
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
  return null;
}
