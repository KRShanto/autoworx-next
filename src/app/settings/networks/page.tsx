import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import React from "react";
import NetworksPage from "./NetworksPage";

type Props = {};

const page = async (props: Props) => {
  const userCompanyId = await getCompanyId();

  const currentCompany = await db.company.findUnique({
    where: {
      id: userCompanyId,
    },
  });

  const connectedCompanyIds = await db.companyJoin.findMany({
    where: {
      OR: [{ companyOneId: userCompanyId }, { companyTwoId: userCompanyId }],
    },
    select: {
      companyOneId: true,
      companyTwoId: true,
      createdAt: true,
    },
  });

  const collaborationDates = connectedCompanyIds.map((join) => join.createdAt);

  const connectedIds = connectedCompanyIds.flatMap((join) =>
    [join.companyOneId, join.companyTwoId].filter((id) => id !== userCompanyId),
  );

  const connectedCompanies = await db.company.findMany({
    where: {
      id: {
        in: connectedIds,
      },
    },
  });

  const unconnectedCompanies = await db.company.findMany({
    where: {
      id: {
        notIn: connectedIds,
        not: userCompanyId,
      },
    },
  });

  return (
    <NetworksPage
      connectedCompanies={connectedCompanies}
      collaborationDates={collaborationDates}
      unconnectedCompanies={unconnectedCompanies}
      currentCompany={currentCompany}
    />
  );
};

export default page;
