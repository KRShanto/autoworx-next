"use client";
import { auth } from "@/app/auth";
import {
  DialogClose,
  DialogContentBlank,
  DialogOverlay,
  DialogPortal,
  InterceptedDialog,
} from "@/components/Dialog";
import { db } from "@/lib/db";
import {
  Company,
  Invoice,
  InvoiceItem,
  InvoicePhoto,
  Status,
  User,
  Vehicle,
} from "@prisma/client";
import { MdOutlineFileDownload } from "react-icons/md";

import { sendInvoiceEmail } from "@/actions/estimate/invoice/sendInvoiceEmail";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import path from "path";
import { useCallback, useRef } from "react";
import { CiFileOn } from "react-icons/ci";
import { FaPrint, FaRegFile, FaShare } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";
import { InvoiceItems } from "./InvoiceItems";
import PDFComponent from "./PDFComponent";

type Props = {};

const InvoiceComponent = ({
  id,
  clientId,
  invoice,
  vehicle,
}: {
  id: string;
  clientId: any;
  invoice: Invoice & {
    status: Status | null;
    company: Company;
    invoiceItems: InvoiceItem[];
    photos: InvoicePhoto[];
    user: User;
  };
  vehicle: Vehicle | null;
}) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const handleDownload = useCallback(async () => {
  //   const blob = await pdf(
  //     <PDFComponent
  //       id={id}
  //       invoice={invoice}
  //       clientId={clientId}
  //       vehicle={vehicle}
  //     />,
  //   ).toBlob();
  //   FileSaver.saveAs(blob, `invoice-${id}.pdf`);
  // }, [invoice, clientId, vehicle, id]);

  const handleEmail = () => {
    sendInvoiceEmail({ invoiceId: invoice.id });
    // close the dialog
    router.back();
  };

  return (
    <div>
      <DialogPortal>
        <DialogOverlay />
        <DialogContentBlank className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-full translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200">
          <div
            ref={componentRef}
            className="#shadow-lg relative grid h-[90vh] w-[740px] shrink grow-0 gap-4 overflow-y-auto border bg-background p-6"
          >
            <div className="flex items-center justify-center print:hidden">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-1 rounded bg-[#6571FF] px-4 py-1 text-white"
                  onClick={handlePrint}
                >
                  <FaPrint />
                  Print
                </button>

                <button className="flex items-center gap-1 rounded bg-[#6571FF] px-4 py-1 text-white">
                  <PDFDownloadLink
                    document={
                      <PDFComponent
                        id={id}
                        invoice={invoice}
                        clientId={clientId}
                        vehicle={vehicle}
                      />
                    }
                    fileName="Invoice.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Loading PDF..." : "PDF"
                    }
                  </PDFDownloadLink>
                </button>
                {/* <button
                  className="flex items-center gap-1 rounded bg-[#6571FF] px-4 py-1 text-white"
                  onClick={handleDownload}
                >
                  <FaRegFile />
                  PDF
                </button> */}

                <button
                  className="flex items-center gap-1 rounded bg-[#6571FF] px-4 py-1 text-white"
                  onClick={handleEmail}
                >
                  <FaShare />
                  Share
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex aspect-square w-32 items-center justify-center bg-slate-500 text-center font-bold text-white">
                Logo
              </div>
              <div className="text-right text-xs">
                <h2 className="font-bold">Contact Information:</h2>
                <p>Full Address</p>
                <p>Mobile Number</p>
                <p>Email</p>
              </div>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground print:hidden">
              <HiXMark className="h-6 w-6 text-slate-500" />
              <span className="sr-only">Close</span>
            </DialogClose>

            <hr />

            {/**
             * Information
             */}
            <div className="flex">
              <div className="grid grow grid-cols-3 gap-4 text-xs">
                <h1 className="col-span-full text-3xl font-bold uppercase text-slate-500">
                  Estimate
                </h1>
                <div>
                  <h2 className="font-bold text-slate-500">Estimate To:</h2>
                  <p>
                    {clientId?.firstName} {clientId?.lastName}
                  </p>
                  <p>{clientId?.mobile}</p>
                  <p>{clientId?.email}</p>
                </div>
                <div>
                  <h2 className="font-bold text-slate-500">Vehicle Details:</h2>
                  <p>{vehicle?.year}</p>
                  <p>{vehicle?.make}</p>
                  <p>{vehicle?.model}</p>
                  <p>{vehicle?.submodel}</p>
                  <p>{vehicle?.type}</p>
                </div>
                <div>
                  <h2 className="font-bold text-slate-500">
                    Estimate Details:
                  </h2>
                  <p>{invoice.id}</p>
                  <p>{moment(invoice.createdAt).format("MMM DD, YYYY")}</p>
                  <p>Bill Status</p>
                  <p
                    className="max-w-32 rounded-md px-2 py-[1px] text-xs font-semibold"
                    style={{
                      color: invoice.status?.textColor,
                      backgroundColor: invoice?.status?.bgColor,
                    }}
                  >
                    {invoice.status?.name}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                {(
                  [
                    ["subtotal", invoice.subtotal],
                    ["discount", invoice.discount],
                    ["tax", invoice.tax],
                    ["grand total", invoice.grandTotal],
                    ["deposit", invoice.deposit],
                    ["due", invoice.due],
                  ] as const
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex rounded border border-solid border-[#6571FF]"
                  >
                    <span className="min-w-0 flex-1 overflow-x-clip text-ellipsis whitespace-nowrap px-2 font-bold uppercase text-[#6571FF]">
                      {key}
                    </span>
                    <div className="shrink-0 basis-20 rounded bg-[#6571FF] px-2 text-white">
                      ${parseFloat("" + value)?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <InvoiceItems
                items={JSON.parse(JSON.stringify(invoice.invoiceItems))}
              />
            </div>

            {/**
             * Terms, Policies
             */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <section>
                <h2 className="font-bold">Terms & Conditions:</h2>
                <p>{invoice.terms}</p>
              </section>
              <section>
                <h2 className="font-bold">Policy & Conditions:</h2>
                <p>{invoice.policy}</p>
              </section>
            </div>

            {/**
             * Submit
             */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-500">
                  {invoice.company.name}
                </p>
                <p>
                  {invoice.user.firstName} {invoice.user.lastName}
                </p>
              </div>
              <button className="rounded bg-[#6571FF] px-8 text-white">
                Authorize
              </button>
            </div>
            <p>Thank you for shopping with Autoworx</p>
          </div>
          <div className="flex h-[90vh] w-[394px] shrink grow-0 flex-col gap-4 print:hidden">
            <div className="#shadow-lg grid flex-1 grid-cols-1 gap-4 overflow-y-auto border bg-background p-6">
              <h2 className="col-span-full text-3xl font-bold uppercase text-slate-500">
                Attachments
              </h2>
              {invoice.photos.map(async (x) => {
                return (
                  <div key={x.id} className="relative aspect-square">
                    <Image
                      src={`/api/images/${x.photo}`}
                      alt="attachment"
                      fill
                    />
                  </div>
                );
              })}
            </div>
            <Link
              href={`/estimate/workorder/${id}`}
              className="rounded-md bg-[#6571FF] py-2 text-center text-white disabled:bg-gray-400"
            >
              View Work Order
            </Link>
            <button className="flex items-center justify-center gap-2 rounded-md bg-white py-2 text-[#6571FF]">
              Share Invoice
              <FaRegShareFromSquare />
            </button>
          </div>
        </DialogContentBlank>
      </DialogPortal>
    </div>
  );
};

export default InvoiceComponent;
