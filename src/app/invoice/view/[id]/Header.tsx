import { Invoice } from "@prisma/client";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa";

export default function Header({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex justify-end gap-5">
      <Link
        href="/invoice"
        className="rounded-md border border-blue-700 px-3 py-1 text-blue-700  hover:bg-blue-700 hover:text-white"
      >
        Back
      </Link>

      <Link
        href={`/invoice/edit/${invoice.invoiceId}`}
        className="rounded-md border border-blue-700 px-3 py-1 text-blue-700  hover:bg-blue-700 hover:text-white"
      >
        Edit
      </Link>

      <a
        href={`/invoice/pdf/${invoice.invoiceId}`}
        target="_blank"
        className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-white"
      >
        <FaFilePdf className="inline" />
        PDF
      </a>
    </div>
  );
}
