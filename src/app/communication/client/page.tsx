import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import crypto from "crypto";
import { google } from "googleapis";
import { cookies } from "next/headers";

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
      // TODO
      return <div>No Clients</div>;
    } else {
      redirect(`/communication/client/?clientId=${clients[0].id}`);
    }
  }

  const client = await db.client.findFirst({
    where: { id: parseInt(clientId) },
  });

  if (!client) {
    // TODO
    return <div>Client not found</div>;
  }
}

export default Page;
