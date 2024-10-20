import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import React from "react";
import LeaveRequest from "./LeaveRequest";

type Props = {};

const page = async (props: Props) => {
  const user = await getUser();
  const leaveRequests = await db.leaveRequest.findMany({
    where: {
      userId: user.id,
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return <LeaveRequest leaveRequests={leaveRequests} user={user} />;
};

export default page;
