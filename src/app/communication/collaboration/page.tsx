import React from "react";
import Collaboration from "./Collaboration";
import Title from "@/components/Title";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";

export const metadata: Metadata = {
  title: "Communication Hub - Collaboration",
};

export default async function CollaborationPage() {
  const session = (await auth()) as AuthSession;
  const userCompanyId = session?.user?.companyId;

  const connectedCompanies = await db.companyJoin.findMany({
    where: {
      OR: [{ companyOneId: userCompanyId }, { companyTwoId: userCompanyId }],
    },
    include: {
      companyOne: {
        include: {
          users: true,
        },
      },
      companyTwo: {
        include: {
          users: true,
        },
      },
    },
  });

  const oppositeCompanies = connectedCompanies.map((join) => {
    if (join.companyOneId === userCompanyId) {
      return join.companyTwo;
    } else {
      return join.companyOne;
    }
  });

  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          from: parseInt(session?.user?.id),
        },
        {
          to: parseInt(session?.user?.id),
        },
      ],
    },
    include: {
      attachment: true,
    },
  });

  const companyWithAdmin = await db.company.findMany({
    where: {
      NOT: { id: userCompanyId },
    },
    select: {
      id: true,
      name: true,
      users: {
        where: { role: "admin" },
        select: {
          firstName: true,
          lastName: true,
          companyId: true,
          email: true,
          role: true,
          image: true,
        },
      },
    },
  });

  const filteredCompanyWithAdmin = companyWithAdmin
    .map((company) => {
      return company.users.map((user) => {
        return {
          ...user,
          companyName: company.name,
          isConnected: oppositeCompanies.some((c) => c.id === user.companyId),
        };
      });
    })
    .flat();
  return (
    <div>
      <Title>Communication Hub - Collaboration</Title>
      <Collaboration
        companyWithAdmin={filteredCompanyWithAdmin}
        companies={oppositeCompanies}
        currentUser={session?.user}
        messages={messages}
      />
    </div>
  );
}
