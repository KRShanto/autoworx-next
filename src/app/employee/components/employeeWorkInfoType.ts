import { Client, Invoice, Technician, Vehicle } from "@prisma/client";

export type EmployeeWorkInfo = (Technician & {
  invoice:
    | (Invoice & { client: Client | null; vehicle: Vehicle | null })
    | null;
})[];
