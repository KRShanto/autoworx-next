"use client";

import { useListsStore } from "@/stores/lists";
import type {
  Customer,
  EmailTemplate,
  Order,
  User,
  Vehicle,
} from "@prisma/client";
import { useEffect } from "react";

export function SyncLists({
  customers,
  vehicles,
  orders,
  employees,
  templates,
}: {
  customers?: Customer[];
  vehicles?: Vehicle[];
  orders?: Order[];
  employees?: User[];
  templates?: EmailTemplate[];
}) {
  useEffect(() => {
    useListsStore.setState({
      customers,
      vehicles,
      orders,
      employees,
      templates,
    });
  }, [customers, vehicles, orders, employees, templates]);
  return null;
}
