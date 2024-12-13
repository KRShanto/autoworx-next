"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { LeaveRequest } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Deletes a leave request.
 * @param {LeaveRequest} leaveRequest - The leave request to delete.
 * @returns {Promise<{success: boolean, message: string}>} - The result of the operation.
 */
export const deleteLeaveRequest = async (leaveRequest: LeaveRequest) => {
  try {
    const user = await getUser();

    // Check if the user is the owner of the leave request
    if (user.id !== leaveRequest.userId) {
      throw new Error("");
    }

    // Delete the leave request
    await db.leaveRequest.delete({
      where: {
        id: leaveRequest.id,
      },
    });

    // Revalidate the path
    revalidatePath("/settings/my-account/leave-requests");

    return {
      success: true,
      message: "Leave Request Deleted Successfully",
    };
  } catch (err: any) {
    return { success: false, message: "Delete Leave Request Failed" };
  }
};
