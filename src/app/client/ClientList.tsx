"use client";

import { cn } from "@/lib/cn";
import { Client, Source, Tag } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteClient from "./DeleteClient";
import EditClient from "./EditClient";
import { useClientFilterStore } from "@/stores/clientFilter";

export default function ClientList({
  clients,
}: {
  clients: (Client & { tag: Tag | null; source: Source | null })[];
}) {
  const { search } = useClientFilterStore();
  const [filteredClients, setFilteredClients] = useState(clients);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) => {
        return (
          client.id.toString().includes(search) ||
          client.firstName.toLowerCase().includes(search.toLowerCase()) ||
          client.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          client.email?.toLowerCase().includes(search.toLowerCase()) ||
          client.mobile?.toLowerCase().includes(search.toLowerCase())
        );
      }),
    );
  }, [search, clients]);

  return (
    <div>
      <div className="app-shadow w-full rounded-lg bg-white p-3">
        <table className="w-full">
          <thead className="">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-left">Client ID</th>
              <th className="border-b px-4 py-2 text-left">Client </th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Phone</th>
              <th className="border-b px-4 py-2 text-center">Edit</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client, index) => (
              <tr
                key={index}
                className={cn(
                  "py-3",
                  index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                )}
              >
                <td className="border-b px-4 py-2 text-left">
                  <Link className="text-blue-500" href={`/client/${client.id}`}>
                    {client.id}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-left">
                  <Link
                    className="block h-full w-full"
                    href={`/client/${client.id}`}
                  >
                    {client.firstName} {client.lastName}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-left">
                  <Link
                    className="block h-full w-full"
                    href={`/client/${client.id}`}
                  >
                    {client.email}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-left">
                  <Link
                    className="block h-full w-full"
                    href={`/client/${client.id}`}
                  >
                    {client.mobile}
                  </Link>
                </td>
                <td className="border-b border-l bg-white px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <EditClient client={client} />
                    <DeleteClient id={client.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
