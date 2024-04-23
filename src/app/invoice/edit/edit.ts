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
    name: z.string(),
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
      tnx: z.string(),
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

export async function editInvoice(data: {
  invoiceId: string;

  customer: {
    name: string;
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

    console.log("InvoiceId: ", data.invoiceId);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;
    const invoice = await db.invoice.findFirst({
      where: {
        invoiceId: data.invoiceId,
      },
    });

    if (!invoice) {
      return {
        message: "Invoice not found",
        field: "invoiceId",
      };
    }

    // Update customer
    await db.customer.update({
      where: {
        id: invoice.customerId,
      },
      data: {
        name: data.customer.name,
        email: data.customer.email,
        mobile: data.customer.mobile,
        address: data.customer.address,
        city: data.customer.city,
        state: data.customer.state,
        zip: data.customer.zip,
      },
    });

    // Update vehicle
    await db.vehicle.update({
      where: {
        id: invoice.vehicleId,
      },
      data: {
        make: data.vehicle.make,
        model: data.vehicle.model,
        year: data.vehicle.year,
        vin: data.vehicle.vin,
        license: data.vehicle.license,
      },
    });

    // Delete existing services
    const serviceIds = invoice.serviceIds as number[];
    serviceIds.forEach(async (serviceId) => {
      await db.service.delete({
        where: {
          id: serviceId,
        },
      });
    });

    // Update invoice
    await db.invoice.update({
      where: {
        invoiceId: data.invoiceId,
      },
      data: {
        subtotal: data.pricing.subtotal,
        discount: data.pricing.discount,
        tax: data.pricing.tax,
        grandTotal: data.pricing.grandTotal,
        deposit: data.pricing.deposit,
        due: data.pricing.due,
        notes: data.notes,
        terms: data.terms,
        status: data.status as Status,
        sendMail: data.sendMail,
        issueDate: data.issueDate,
        tags: data.tags.join(","),
        photo: data.photo,
      },
    });

    // Delete existing payments
    await db.payment.deleteMany({
      where: {
        invoiceId: invoice.id,
      },
    });

    // Create new payments
    await db.payment.createMany({
      data: data.payments.map((payment) => ({
        invoiceId: invoice.id,
        method: payment.method as Method,
        amount: payment.amount,
        type: payment.type as Type,
        note: payment.note,
        invoiceInvoiceId: data.invoiceId,
        companyId,
        tnx: payment.tnx!,
      })),
    });

    // Update additional data
    const additional = await db.invoiceAdditional.update({
      where: {
        companyId,
      },
      data: {
        note: data.notes,
        terms: data.terms,
      },
    });

    // TODO: UPload photo

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
