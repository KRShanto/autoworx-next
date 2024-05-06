"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { Method, Status, Type } from "@prisma/client";
import { Payment } from "@/types/db";
import { z } from "zod";

const InvoiceSchema = z.object({
  invoiceId: z.string(),

  customer: z.object({
    firstName: z.string(),
    email: z.string(),
    mobile: z.number(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),

  vehicle: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number(),
    vin: z.string(),
    license: z.string(),
  }),

  services: z.array(z.number()),

  photo: z.string().optional(),

  pricing: z.object({
    subtotal: z.number(),
    discount: z.number(),
    tax: z.number(),
    grandTotal: z.number(),
    deposit: z.number(),
    due: z.number(),
  }),

  notes: z.string(),
  terms: z.string(),

  payments: z.array(
    z.object({
      method: z.string(),
      amount: z.number(),
      type: z.string(),
      note: z.string().optional(),
    }),
  ),

  status: z.string(),
  sendMail: z.boolean(),
  issueDate: z.date(),
  tags: z.array(z.string()),
});

export async function createInvoice(data: {
  invoiceId: string;

  customer: {
    firstName: string;
    email: string;
    mobile: number;
    address: string;
    city: string;
    state: string;
    zip: string;
  };

  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
    license: string;
  };

  services: number[];

  photo?: string;

  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
    deposit: number;
    due: number;
  };

  notes: string;
  terms: string;

  payments: Payment[];

  status: string;
  sendMail: boolean;
  issueDate: Date;
  tags: string[];
}) {
  try {
    InvoiceSchema.parse(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Search customers by mobile, if not found, create a new customer
    const customer = await db.customer.upsert({
      where: {
        mobile: data.customer.mobile,
      },
      create: {
        ...data.customer,
        companyId,
      },
      update: {
        ...data.customer,
      },
    });

    // Create a vehicle
    const vehicle = await db.vehicle.create({
      data: {
        ...data.vehicle,
        companyId,
      },
    });

    // Create Invoice
    const invoice = await db.invoice.create({
      data: {
        invoiceId: data.invoiceId,
        customerId: customer.id,
        vehicleId: vehicle.id,
        serviceIds: data.services,
        photo: data.photo,
        subtotal: data.pricing.subtotal,
        discount: data.pricing.discount,
        tax: data.pricing.tax,
        grandTotal: data.pricing.grandTotal,
        deposit: data.pricing.deposit,
        due: data.pricing.due,
        status: data.status as Status,
        // TODO: not sure if `sendMail` is required here
        sendMail: data.sendMail,
        notes: data.notes,
        terms: data.terms,
        issueDate: data.issueDate,
        salesperson: session.user.name,
        companyId,
        tags: data.tags.join(","),
      },
    });

    // Create payments
    await db.payment.createMany({
      data: data.payments.map((payment) => ({
        method: payment.method as Method,
        amount: payment.amount,
        type: payment.type as Type,
        note: payment.note,
        invoiceInvoiceId: data.invoiceId,
        companyId,
        invoiceId: invoice.id,
        tnx: payment.tnx!,
        date: payment.date,
      })),
    });

    // Get the InvoiceAdditional model
    const additional = await db.invoiceAdditional.findFirst({
      where: {
        companyId,
      },
    });

    // If the model does not exist, create a new one, otherwise update the existing one
    if (!additional) {
      await db.invoiceAdditional.create({
        data: {
          note: data.notes,
          terms: data.terms,
          companyId,
        },
      });
    } else {
      await db.invoiceAdditional.update({
        where: {
          id: additional.id,
        },
        data: {
          note: data.notes,
          terms: data.terms,
        },
      });
    }

    // TODO: Upload photo
    // TODO: Send email

    return true;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else if (error.code === "P2002") {
      return {
        message: "Invoice already exists",
        field: "invoiceId",
      };
    }
  }
}
