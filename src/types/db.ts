// NOTE: these properties are optional for prisma's select statement. But they aren't optional in the db.

import {
  CardPayment,
  CashPayment,
  CheckPayment,
  Client,
  EmailTemplate,
  OtherPayment,
  Payment,
  PaymentMethod,
  Priority,
  User,
  Vehicle,
} from "@prisma/client";

export interface UserType {
  id?: string;
  name?: string;
  country?: string;
  email?: string;
  createdAt?: Date;
}

export interface EmployeeType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employee_type: "Salary" | "Hourly" | "Contract Based";
  employee_department: "Sales" | "Management" | "Workshop";
}

export interface InvoiceType {}

export interface CustomerType {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at?: string;
}

export interface VehicleType {
  make: string;
  model: string;
  year: number;
  vin: string;
  license: string;
}

export interface ServiceType {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  discount: number;
  total: number;
}

export interface Pricing {
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  deposit: number;
  due: number;
}

export interface AdditionalInfo {
  notes: string;
  terms: string;
}

export interface TaskType {
  id?: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "task" | "appointment" | "event";
  assignedUsers: number[];
}

export interface CalendarTask {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  priority: Priority;
  companyId: number;
  assignedUsers: User[];
}

export interface CalendarAppointment {
  id: number;
  userId: number;
  title: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  client: Client | null;
  companyId: number;
  assignedUsers: User[];
  draftEstimate: string | null;
}

export interface AppointmentFull {
  id: number;
  title: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  client: Client | null;
  vehicle: Vehicle | null;
  draftEstimate: string | null;
  notes: string | null;
  confirmationEmailTemplate: EmailTemplate | null;
  reminderEmailTemplate: EmailTemplate | null;
  confirmationEmailTemplateStatus: any;
  reminderEmailTemplateStatus: any;
  assignedUsers: User[];
  times: string[];
}

export type FullPayment =
  | (Payment & {
      card: CardPayment | null;
      check: CheckPayment | null;
      cash: CashPayment | null;
      other: (OtherPayment & { paymentMethod: PaymentMethod | null }) | null;
    })
  | null;
