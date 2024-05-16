
import type { Customer, EmailTemplate, Order, User, Vehicle } from "@prisma/client";
import { create } from "zustand";

export const useListsStore = create(() => ({
    customers: [] as Customer[],
    vehicles: [] as Vehicle[],
    orders: [] as Order[],
    employees: [] as User[],
    templates: [] as EmailTemplate[],
}));
