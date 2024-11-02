import { updateLeaveRequestStatus } from "@/actions/settings/my-account/leave-requests/updateLeaveRequestStatus";
import { errorToast, successToast } from "@/lib/toast";
import formatDateToReadable from "@/utils/formatDate";
import { LeaveRequest, User } from "@prisma/client";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

type Props = {};

const EmployeeLeaveRequests = ({
  pendingLeaveRequests = [],
  fullHeight = false,
}: {
  pendingLeaveRequests: (LeaveRequest & { user: User })[];
  fullHeight?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col rounded-md p-6 shadow-lg ${fullHeight ? "h-[82vh]" : "h-[38vh]"}`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-bold">Employee Leave Request</span>{" "}
        <span>
          <FaExternalLinkAlt />
        </span>
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col space-y-4">
        {pendingLeaveRequests.map((leaveRequest, idx) => (
          <EmployeeLeaveRequest key={idx} leaveRequest={leaveRequest} />
        ))}
        {[0].length === 0 && (
          <div className="flex flex-1 items-center justify-center self-center text-center">
            <span>No Employee Leave Requests</span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeeLeaveRequest = ({
  leaveRequest,
}: {
  leaveRequest: LeaveRequest & { user: User };
}) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-gray-400 px-4 py-4 text-xs 2xl:flex-row 2xl:items-start 2xl:justify-between">
      <div className="flex h-full flex-col justify-between 2xl:w-[35%]">
        <div>
          <p className="font-semibold">{leaveRequest.title}</p>
          <p>
            Employee : {leaveRequest.user.firstName}{" "}
            {leaveRequest.user.lastName}
          </p>
        </div>
        <div>
          <p className="mt-4 font-semibold">
            Start : {formatDateToReadable(leaveRequest.startDate)}
          </p>
          <p className="font-semibold">
            End : {formatDateToReadable(leaveRequest.endDate)}
          </p>
        </div>
      </div>
      <div className="2xl:w-[45%]">
        <p className="font-semibold">Details :</p>
        <p>{leaveRequest.description}</p>
      </div>
      <div className="flex flex-col gap-y-3 text-xs 2xl:w-[15%]">
        <button
          onClick={async () => {
            const res = await updateLeaveRequestStatus(
              leaveRequest.id,
              "Approved",
            );
            if (res.success) {
              successToast(res.message);
            } else {
              errorToast(res.message);
            }
          }}
          className="w-full rounded bg-[#6571FF] py-1 text-white"
        >
          Accept
        </button>
        <button
          onClick={async () => {
            const res = await updateLeaveRequestStatus(
              leaveRequest.id,
              "Rejected",
            );
            if (res.success) {
              successToast(res.message);
            } else {
              errorToast(res.message);
            }
          }}
          className="w-full rounded bg-red-500 py-1 text-white"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequests;
