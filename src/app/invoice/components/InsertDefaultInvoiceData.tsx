"use client";

import { useInvoiceStore } from "@/stores/invoice";
import { Customer, Invoice, Payment, Service, Vehicle } from "@prisma/client";
import { useEffect } from "react";

export default function InsertDefaultInvoiceData({
  invoice,
  invoiceCustomer,
  invoiceVehicle,
  invoiceServices,
  invoiceTags,
  invoicePayments,
}: {
  invoice: Invoice;
  invoiceCustomer: Customer;
  invoiceVehicle: Vehicle;
  invoiceServices: Service[];
  invoiceTags: string[];
  invoicePayments: Payment[];
}) {
  const {
    services,
    setInvoiceId,
    setCustomer,
    setVehicle,
    setServices,
    setStatus,
    setSendMail,
    setPayments,
    setIssueDate,
    setTags,
    calculatePricing,
  } = useInvoiceStore();

  useEffect(() => {
    setInvoiceId(invoice.invoiceId);
    // TODO
    setCustomer({
      name: invoiceCustomer.firstName,
      // @ts-ignore
      email: invoiceCustomer.email,
      // @ts-ignore
      mobile: invoiceCustomer.mobile,
      // @ts-ignore
      address: invoiceCustomer.address,
      // @ts-ignore
      city: invoiceCustomer.city,
      // @ts-ignore
      state: invoiceCustomer.state,
      // @ts-ignore
      zip: invoiceCustomer.zip,
    });
    setVehicle({
      // @ts-ignore
      make: invoiceVehicle.make,
      // @ts-ignore
      model: invoiceVehicle.model,
      // @ts-ignore
      year: invoiceVehicle.year,
      // @ts-ignore
      vin: invoiceVehicle.vin,
      // @ts-ignore
      license: invoiceVehicle.license,
    });
    setServices(
      invoiceServices.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        quantity: service.quantity,
        total: service.total,
        discount: service.discount,
      })),
    );
    setStatus(invoice.status);
    setSendMail(invoice.sendMail);
    setPayments(
      // @ts-ignore
      invoicePayments.map((payment: any) => ({
        tnx: payment.tnx,
        date: payment.date,
        amount: parseFloat(payment.amount),
        method: payment.method,
        type: payment.type,
        note: payment.note,
        address: invoiceCustomer.address,
        name: invoiceCustomer.firstName,
        email: invoiceCustomer.email,
        status: payment.status,
        mobile: invoiceCustomer.mobile,
      })),
    );
    setIssueDate(invoice.issueDate);
    setTags(invoiceTags);
  }, []);

  useEffect(() => {
    if (services.length === 0) return;

    setTimeout(() => {
      calculatePricing("PERCENTAGE");
    }, 200);
  }, [services]);

  return null;
}
