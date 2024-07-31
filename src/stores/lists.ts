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
import { create } from "zustand";

export const useListsStore = create(() => ({
  customers: [] as Client[],
  vehicles: [] as Vehicle[],
  estimates: [] as Invoice[],
  employees: [] as User[],
  templates: [] as EmailTemplate[],
  categories: [] as Category[],
  services: [] as Service[],
  materials: [] as (Material & { tags: Tag[] })[],
  labors: [] as Labor[],
  tags: [] as Tag[],
  vendors: [] as Vendor[],
  statuses: [] as Status[],
  newAddedCustomer: null as Client | null,
  newAddedVehicle: null as Vehicle | null,
  paymentMethods: [] as PaymentMethod[],

  client: null as Client | null,
  vehicle: null as Vehicle | null,
  status: null as Status | null,
}));
