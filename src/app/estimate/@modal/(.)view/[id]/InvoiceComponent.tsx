"use client";
import {
  authorizeInvoice,
  deleteInvoiceAuthorize,
} from "@/actions/estimate/invoice/authorize";
import { sendInvoiceEmail } from "@/actions/estimate/invoice/sendInvoiceEmail";
import { getCompany } from "@/actions/settings/getCompany";
import {
  DialogClose,
  DialogContentBlank,
  DialogOverlay,
  DialogPortal,
} from "@/components/Dialog";
import { errorToast, successToast } from "@/lib/toast";
import {
  Column,
  Company,
  Invoice,
  InvoiceItem,
  InvoicePhoto,
  Labor,
  Material,
  Service,
  Technician,
  User,
  Vehicle,
} from "@prisma/client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPrint, FaRegEdit, FaRegFile, FaShare } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useReactToPrint } from "react-to-print";
import { InvoiceItems } from "./InvoiceItems";
import PDFComponent from "./PDFComponent";
import { useEstimateNavigationStore } from "@/stores/estimateNavigationStore";

const InvoiceComponent = ({
  id,
  clientId,
  invoice,
  vehicle,
  invoiceTechnicians,
}: {
  id: string;
  clientId: any;
  invoice: Invoice & {
    column: Column | null;
    company: Company;
    invoiceItems: (InvoiceItem & {
      materials: Material[] | [];
      service: Service | null;
      invoice: Invoice | null;
      labor: Labor | null;
    })[];
    photos: InvoicePhoto[];
    user: User;
  };
  vehicle: Vehicle | null;
  invoiceTechnicians: Technician[];
}) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const [showAuthorizedName, setShowAuthorizedName] = useState(false);
  const [authorizedName, setAuthorizedName] = useState(
    invoice?.authorizedName || "",
  );
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleEdit = () => {
    router.push(`/estimate/edit/${id}`);
  };

  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);

  const handleEmail = async () => {
    let res = await sendInvoiceEmail({ invoiceId: invoice.id });
    if (!res?.success) {
      errorToast(res?.message || "Error sharing invoice");
      return;
    }
    successToast("Invoice sent successfully");
    // close the dialog
    router.back();
  };

  useEffect(() => {
    const getCompanyDetails = async () => {
      const companyDetailsnow = await getCompany();
      setCompanyDetails(companyDetailsnow);
    };
    getCompanyDetails();
  }, []);

  const isWorkOrderCreate = invoiceTechnicians.length > 0 ? true : false;

  const type = useEstimateNavigationStore((state) => state.type);

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
                  onClick={handleEdit}
                >
                  <FaRegEdit />
                  Edit
                </button>

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
                        companyDetails={companyDetails}
                        authorizedName={authorizedName}
                      />
                    }
                    fileName="Invoice.pdf"
                  >
                    {/* @ts-ignore TODO */}
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        "Loading PDF..."
                      ) : (
                        <span className="flex items-center gap-x-2">
                          <FaRegFile />
                          <span>PDF</span>
                        </span>
                      )
                    }
                  </PDFDownloadLink>
                </button>

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
              <div className="flex aspect-square w-32 items-center justify-center border border-slate-300 text-center font-bold text-white">
                {companyDetails?.image ? (
                  <Image
                    src={companyDetails.image}
                    alt="company logo"
                    width={128}
                    height={128}
                    // className="object-contain"
                  />
                ) : (
                  "Logo"
                )}
              </div>
              <div className="text-right text-xs">
                <h2 className="font-bold">Contact Information:</h2>
                <p>
                  {companyDetails?.address} {companyDetails?.city}{" "}
                  {companyDetails?.state} {companyDetails?.zip}
                </p>
                <p>{companyDetails?.phone}</p>
                <p>{companyDetails?.email}</p>
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
                  {type?.toUpperCase()}
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
                  <div className="flex gap-2">
                    <p>{vehicle?.year}</p>
                    <p>{vehicle?.make}</p>
                    <p>{vehicle?.model}</p>
                  </div>
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
                      color: invoice.column?.textColor || undefined,
                      backgroundColor: invoice?.column?.bgColor || undefined,
                    }}
                  >
                    {invoice.column?.title}
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
              <div>
                {showAuthorizedName && (
                  <div className="flex items-center gap-x-4">
                    <input
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                      placeholder="Your Name"
                      value={authorizedName}
                      onChange={(e) => setAuthorizedName(e.target.value)}
                    />

                    <button
                      onClick={async () => {
                        const res = await authorizeInvoice(
                          invoice.id,
                          authorizedName,
                        );
                        if (res?.type === "success") {
                          successToast("Invoice Authorized");
                        }
                        setShowAuthorizedName(false);
                      }}
                      className="text-lg text-green-500 print:hidden"
                    >
                      <TiTick />
                    </button>
                    <button
                      className="text-lg text-red-500 print:hidden"
                      onClick={() => setShowAuthorizedName(false)}
                    >
                      <IoClose />
                    </button>
                  </div>
                )}
                {invoice.authorizedName && !showAuthorizedName && (
                  <div className="flex flex-col items-center gap-y-2">
                    <span className="font-semibold italic">
                      {invoice.authorizedName}
                    </span>

                    <hr className="border-slate-500 bg-slate-500" />
                    <div className="flex items-center gap-x-4">
                      <span className="rounded-sm border border-[#6571ff] px-4 py-1 text-sm text-[#6571ff]">
                        Authorized
                      </span>
                      <button
                        className="text-lg text-[#6571ff] print:hidden"
                        onClick={async () => {
                          setShowAuthorizedName(true);
                        }}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="text-lg text-red-500 print:hidden"
                        onClick={async () => {
                          const res = await deleteInvoiceAuthorize(invoice.id);
                          if (res?.type === "success") {
                            successToast("Deleted Invoice Authorize");
                          }
                          setShowAuthorizedName(false);
                        }}
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </div>
                )}
                {!showAuthorizedName && !invoice.authorizedName && (
                  <button
                    onClick={() => {
                      setShowAuthorizedName(true);
                    }}
                    className="rounded bg-[#6571FF] px-8 text-white print:hidden"
                  >
                    Authorize
                  </button>
                )}
              </div>
            </div>
            <p>Thank you for shopping with Autoworx</p>
          </div>
          {/* <PDFViewer width="100%" height="600">
            <PDFComponent
              id={id}
              invoice={invoice}
              clientId={clientId}
              vehicle={vehicle}
              companyDetails={companyDetails}
              authorizedName={authorizedName}
            />
          </PDFViewer> */}
          <div className="flex h-[90vh] w-[394px] shrink grow-0 flex-col gap-4 print:hidden">
            <div className="#shadow-lg grid flex-1 grid-cols-1 gap-4 overflow-y-auto border bg-background p-6">
              <h2 className="col-span-full text-3xl font-bold uppercase text-slate-500">
                Attachments
              </h2>
              {invoice.photos.map((x) => {
                return (
                  <Link
                    href={`/estimate/photo?url=${x.photo}`}
                    key={x.id}
                    className="relative aspect-square"
                  >
                    <Image
                      src={x.photo}
                      alt="attachment"
                      fill
                      className="cursor-pointer"
                    />
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/estimate/workorder/${id}`}
              className="rounded-md bg-[#6571FF] py-2 text-center text-white disabled:bg-gray-400"
            >
              {isWorkOrderCreate ? "View Work Order" : "Create Work Order"}
            </Link>
            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-2 rounded-md bg-white py-2 text-[#6571FF]"
            >
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
