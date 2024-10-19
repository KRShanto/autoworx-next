"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";

interface TLeaveRequestData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const createLeaveRequest = async (
  leaveRequestData: TLeaveRequestData,
) => {
  try {
    const user = await getUser();
    const leaveRequest = await db.leaveRequest.create({
      data: {
        ...leaveRequestData,
        userId: user.id,
        companyId: user.companyId,
        status: "Pending",
        startDate: new Date(leaveRequestData.startDate),
        endDate: new Date(leaveRequestData.endDate),
      },
    });
    revalidatePath("/settings/my-account/leave-requests");

    return {
      success: true,
      message: "Leave Request Submitted Successfully",
      data: leaveRequest,
    };
  } catch (err: any) {
    return { success: false, message: "Create Leave Request Failed" };
  }
};
