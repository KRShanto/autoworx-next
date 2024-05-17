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
} from "@prisma/client";
import { useEffect } from "react";

export function SyncLists({
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
  ]);
  return null;
}
