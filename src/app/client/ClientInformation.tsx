import { Customer, Source, Tag } from "@prisma/client";
import Image from "next/image";
import React from "react";

export default function ClientInformation({
  client,
}: {
  client: Customer & { tag: Tag | null; source: Source | null };
}) {
  return (
    <div className="mb-3 w-full p-2">
      <h3 className="text-lg font-semibold">Client Details</h3>
      <div className="rounded-md border border-gray-200 p-3">
        <div className="relative flex w-full items-center rounded">
          <div className="mr-3 flex flex-col items-center">
            <Image
              src={client.photo}
              alt="Client"
              width={200}
              height={200}
              className="h-auto w-auto rounded-full"
            />
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Name</label>
              <input
                type="text"
                value={client.firstName + " " + client.lastName}
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Email</label>
              <input
                type="email"
                value={client.email!}
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="mb-1 flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Phone</label>
              <input
                type="text"
                value={client.mobile!}
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-6 block w-20 text-gray-600">Address</label>
              <input
                type="text"
                value={client.address!}
                readOnly
                className="block w-full rounded border border-gray-200 px-4 py-2 text-gray-600"
              />
            </div>
          </div>
        </div>
        <div className="tags mt-4 flex items-center gap-x-4">
          {client.tag && (
            <span
              className="rounded-sm px-3 py-1 text-xs"
              style={{
                backgroundColor: client.tag.bgColor,
                color: client.tag.textColor,
              }}
            >
              {client.tag.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
