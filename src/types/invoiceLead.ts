import { Prisma, Tag, Task, User } from "@prisma/client";

interface InvoiceTag {
  id: number;
  tag: Tag;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string | null;
}
export type Column = {
  id: number | null;
  title: string;
  type: string;
};
export interface ShopLead {
  invoiceId: string;
  name: string;
  email: string;
  phone: string;
  clientId: number | null;
  vehicle: string;
  vehicleId: number | null;
  services: {
    completed: string[];
    incomplete: string[];
  };
  createdAt: string;
  workOrderStatus?: string;
  tags: InvoiceTag[];

  tasks?: Task[];
  assignedTo: User | Employee | null;
  columnId: number | null;
  dueBalance: number;
}
export interface SalesLead {
  leadId: number;
  name: string;
  email: string | null;
  phone: string | null;
  vehicle: string;
  services: string;
  source: string;
  comments: string | null;
  createdAt: string;
  companyId: number;
}

// export type Lead = ShopLead | SalesLead;
export interface ShopPipelineData {
  id: number | null;
  title: string;
  leads: ShopLead[];
}
export interface SalesPipelineData {
  id: number | null;
  title: string;
  leads: SalesLead[];
}

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    client: true;
    vehicle: true;
    invoiceItems: {
      include: {
        service: {
          include: {
            Technician: true;
          };
        };
      };
    };
    tags: {
      select: {
        id: true;
        tag: true;
      };
    };
    tasks: true;
    assignedTo: true;
    column: true;
  };
}>;
