import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import crypto from "crypto";
import { google } from "googleapis";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = { searchParams: { clientId: string } };

async function Page(props: Props) {
  const companyId = await getCompanyId();
  const clientId = props.searchParams.clientId;

  if (!clientId) {
    // Redirect to first client
    const clients = await db.client.findMany({
      where: { companyId },
      include: { tag: true, source: true },
    });

    if (clients.length === 0) {
      // TODO: @bettercallsundim - Show a message that there are no clients. Add a link to go to /client page
      return (
        <div className="mt-24 flex flex-col items-center justify-center text-xl capitalize">
          <div>No clients found</div>
          <div>
            Please{" "}
            <Link className="text-violet-600 underline" href="/client">
              add a client
            </Link>{" "}
            to your company
          </div>
        </div>
      );
    } else {
      redirect(`/communication/client/?clientId=${clients[0].id}`);
    }
  }

  const client = await db.client.findFirst({
    where: { id: parseInt(clientId) },
  });

  if (!client) {
    // TODO: @bettercallsundim - Show a message that the client was not found
    return <div className="mt-24 flex flex-col items-center justify-center text-xl capitalize">Client not found</div>;
  }
}

export default Page;
