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
import { create } from "zustand";

export const useListsStore = create(() => ({
  customers: [] as Customer[],
  vehicles: [] as Vehicle[],
  orders: [] as Order[],
  employees: [] as User[],
  templates: [] as EmailTemplate[],
  categories: [] as Category[],
  services: [] as Service[],
  materials: [] as (Material & { tags: Tag[] })[],
  labors: [] as Labor[],
  tags: [] as Tag[],
  vendors: [] as Vendor[],
  statuses: [] as Status[],
  newAddedCustomer: null as Customer | null,
  newAddedVehicle: null as Vehicle | null,
}));
