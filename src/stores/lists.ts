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
import { create } from "zustand";

interface ListsStore {
  customers: Client[];
  vehicles: Vehicle[];
  estimates: Invoice[];
  employees: User[];
  templates: EmailTemplate[];
  categories: Category[];
  services: Service[];
  materials: (Material & { tags: Tag[] })[];
  labors: Labor[];
  tags: Tag[];
  vendors: Vendor[];
  statuses: Column[];
  newAddedCustomer: Client | null;
  newAddedVehicle: Vehicle | null;
  paymentMethods: PaymentMethod[];
  client: Client | null;
  vehicle: Vehicle | null;
  status: Column | null;
  reset: () => void;
}

export const useListsStore = create<ListsStore>((set) => ({
  customers: [],
  vehicles: [],
  estimates: [],
  employees: [],
  templates: [],
  categories: [],
  services: [],
  materials: [],
  labors: [],
  tags: [],
  vendors: [],
  statuses: [],
  newAddedCustomer: null,
  newAddedVehicle: null,
  paymentMethods: [],
  client: null,
  vehicle: null,
  status: null,
  reset: () =>
    set({
      customers: [],
      vehicles: [],
      estimates: [],
      employees: [],
      templates: [],
      categories: [],
      services: [],
      materials: [],
      labors: [],
      tags: [],
      vendors: [],
      statuses: [],
      newAddedCustomer: null,
      newAddedVehicle: null,
      paymentMethods: [],
      client: null,
      vehicle: null,
      status: null,
    }),
}));
