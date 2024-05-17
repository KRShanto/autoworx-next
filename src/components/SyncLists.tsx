"use client";

import { useListsStore } from "@/stores/lists";
import type {
  Category,
  Customer,
  EmailTemplate,
  Labor,
  Material,
  Order,
  Service,
  Tag,
  User,
  Vehicle,
  Vendor,
  Status,
} from "@prisma/client";
import { useEffect } from "react";

export function SyncLists({
  customers = [],
  vehicles = [],
  orders = [],
  employees = [],
  templates = [],
  categories = [],
  services = [],
  materials = [],
  labors = [],
  tags = [],
  vendors = [],
  statuses = [],
}: {
  customers?: Customer[];
  vehicles?: Vehicle[];
  orders?: Order[];
  employees?: User[];
  templates?: EmailTemplate[];
  categories?: Category[];
  services?: Service[];
  materials?: Material[];
  labors?: Labor[];
  tags?: Tag[];
  vendors?: Vendor[];
  statuses?: Status[];
}) {
  useEffect(() => {
    useListsStore.setState({
      customers,
      vehicles,
      orders,
      employees,
      templates,
      categories,
      services,
      materials,
      labors,
      tags,
      vendors,
      statuses,
    });
  }, [
    customers,
    vehicles,
    orders,
    employees,
    templates,
    categories,
    services,
    materials,
    labors,
    tags,
    vendors,
    statuses,
  ]);
  return null;
}
