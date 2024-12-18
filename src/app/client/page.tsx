import NewCustomer from "@/components/Lists/NewCustomer";
import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IoSearchOutline } from "react-icons/io5";
import ClientList from "./ClientList";
import DeleteClient from "./DeleteClient";
import EditClient from "./EditClient";
import Header from "./Header";

export default async function Page() {
  const companyId = await getCompanyId();
  const clients = await db.client.findMany({
    where: { companyId },
    include: { tag: true, source: true },
  });

  return (
    <div className="h-full w-full space-y-8 px-2">
      <Title>Client List</Title>

      <Header />
      <ClientList clients={clients} />
    </div>
  );
}
