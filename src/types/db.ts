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
