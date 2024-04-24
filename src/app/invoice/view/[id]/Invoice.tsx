"use client";

import {
  Customer,
  Invoice as InvoiceType,
  Service,
  Setting,
  Vehicle,
} from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { Tailwind } from "@onedoc/react-print";
import { PDFViewer } from "@react-pdf/renderer";
import { usePDF } from "react-to-pdf";

export default function Invoice({
  invoice,
  customer,
  setting,
  vehicle,
  services,
  targetRef,
}: {
  invoice: InvoiceType;
  customer: Customer;
  setting: Setting;
  vehicle: Vehicle;
  services: Service[];
  targetRef: any;
}) {
  return (
    <>
      <div
        className="app-shadow mb-5 mt-3 w-[65%] rounded-md bg-white p-7 max-[1550px]:text-sm"
        ref={targetRef}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Logo */}
          <Image
            src="/icons/Logo2.png"
            alt="Autoworx"
            width={100}
            height={100}
          />

          {/* Contact Info */}
          <div>
            <p className="font-bold uppercase">Contact Information</p>
            {/* Split and loop */}
            {setting &&
              setting.contact &&
              setting.contact
                .split("||")
                .map((info: string, index: number) => (
                  <p key={index}>{info}</p>
                ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-1 w-full bg-slate-300" />

        {/* Invoice details */}
        <div>
          <h1 className="text-3xl font-bold uppercase text-blue-700">
            Invoice
          </h1>

          <div className="flex items-start justify-between">
            {/* Invoice To */}
            <div className="mt-5">
              <h3 className="font-bold">Invoice To:</h3>
              <p>{customer.name}</p>
              <p>{customer.email}</p>
              <p>{customer.mobile}</p>
            </div>

            {/* Vehicle */}
            <div>
              <h3 className="font-bold">Vehicle Details:</h3>
              <div>
                <span className="font-bold">Year: </span>
                <span>{vehicle.year}</span>
              </div>
              <div>
                <span className="font-bold">Make: </span>
                <span>{vehicle.make}</span>
              </div>
              <div>
                <span className="font-bold">Model: </span>
                <span>{vehicle.model}</span>
              </div>
              <div>
                <span className="font-bold">VIN: </span>
                <span>{vehicle.vin}</span>
              </div>
              <div>
                <span className="font-bold">License Plate: </span>
                <span>{vehicle.license}</span>
              </div>
            </div>

            {/* Other info */}
            <div className="pr-20 max-[1550px]:pr-0">
              <div>
                <span className="font-bold">Invoice Number: </span>
                <span>{invoice.invoiceId}</span>
              </div>
              <div>
                <span className="font-bold">Invoice Date: </span>
                <span>
                  {moment(invoice.createdAt).format("MMM DD, YYYY hh:mm A")}
                </span>
              </div>
              <div>
                <span className="font-bold">Bill Status: </span>
                <span>Paid</span>
              </div>
              <div>
                <span className="font-bold">Order Status: </span>
                <span>{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product/Service info */}
        <div>
          <table className="mt-10 w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="w-[40%] border border-gray-400 px-4 py-2 text-left">
                  Product/Service
                </th>
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Quantity/Unit
                </th>
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Unit Price
                </th>
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Discount Price
                </th>
                <th className="w-[13%] border border-gray-400 px-4 py-2 text-center">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2 text-left">
                    <div className="flex flex-col">
                      <p>{service.name}</p>
                      <p className="text-sm text-slate-700">
                        {service.description}
                      </p>
                    </div>
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {service.quantity}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-center">
                    ${service.price}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-center">
                    ${service.discount}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-center">
                    ${service.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Calculation */}
          <div>
            {/* Subtotal */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Subtotal
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.subtotal)}
              </p>
            </div>

            {/* Discount */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Discount
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.discount)}
              </p>
            </div>

            {/* Tax */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Tax
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.tax)}
              </p>
            </div>

            {/* Grand Total */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Grand Total
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.grandTotal)}
              </p>
            </div>

            {/* Deposit */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Deposit
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.deposit)}
              </p>
            </div>

            {/* Due */}
            <div className="flex w-full">
              <h3 className="w-[87%] border border-t-0 border-gray-400 px-4 py-2 text-end">
                Due
              </h3>
              <p className="w-[13%] border border-l-0 border-t-0 border-gray-400 px-4 py-2 text-center">
                {String(invoice.due)}
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Policy Conditions */}
        <div className="mt-10 flex w-full gap-5">
          {/* Terms */}
          <div className="w-1/2">
            <h3 className="font-bold">Terms & Conditions</h3>
            <p>{invoice.terms}</p>
          </div>

          {/* Policy */}
          <div className="w-1/2">
            <h3 className="font-bold">Privacy Policy</h3>
            <p>{invoice.policy}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 flex items-center justify-between">
          {/* Greetings */}
          <p>Thank you for shopping from Autoworx</p>

          {/* Salesperson */}
          <div className="flex flex-col items-center">
            <p>{invoice.salesperson}</p>
            <div className="w-full border border-dotted border-black"></div>
            <p>Salesperson</p>
          </div>

          {/* Signature */}
          <div>
            <div className="w-full border border-dotted border-black"></div>
            <p>Authorized Sign</p>
          </div>
        </div>
      </div>
    </>
  );
}
