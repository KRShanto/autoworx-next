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
  PaymentMethod,
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
  paymentMethods = [],
}: {
  customers?: Customer[];
  vehicles?: Vehicle[];
  orders?: Order[];
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
      paymentMethods,
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
    paymentMethods,
  ]);
  return null;
}
