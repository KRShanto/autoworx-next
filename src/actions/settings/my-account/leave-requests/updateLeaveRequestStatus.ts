"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { LeaveRequest, LeaveRequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Updates the status of a leave request.
 * @param {number} leaveRequestId - The ID of the leave request to update.
 * @param {LeaveRequestStatus} status - The new status of the leave request.
 * @returns {Promise<{success: boolean, message: string, data?: LeaveRequest}>} - The result of the operation.
 */
export const updateLeaveRequestStatus = async (
  leaveRequestId: number,
  status: LeaveRequestStatus,
) => {
  try {
    const user = await getUser();

    // Check if the user is an Admin or Manager
    if (user.employeeType !== "Admin" && user.employeeType !== "Manager") {
      throw new Error("");
    }

    // Update the leave request status
    const updatedLeaveRequest = await db.leaveRequest.update({
      where: {
        id: leaveRequestId,
      },
      data: {
        status,
      },
    });

    // Revalidate the paths
    revalidatePath("/settings/my-account/leave-requests");
    revalidatePath("/");

    return {
      success: true,
      message: "Leave Request Status Updated Successfully",
      data: updatedLeaveRequest,
    };
  } catch (err: any) {
    return { success: false, message: "Leave Request Status Updating Failed" };
  }
};
