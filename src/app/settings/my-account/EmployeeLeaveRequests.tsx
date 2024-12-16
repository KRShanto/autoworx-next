/* eslint-disable @next/next/no-img-element */
import { deleteLeaveRequest } from "@/actions/settings/my-account/leave-requests/deleteLeaveRequest";
import { cn } from "@/lib/cn";
import { errorToast, successToast } from "@/lib/toast";
import formatDateToReadable from "@/utils/formatDate";
import { LeaveRequest } from "@prisma/client";
import React from "react";

const EmployeeLeaveRequests = ({
  leaveRequests = [],
  fullHeight = false,
  shadow = true,
}: {
  leaveRequests: LeaveRequest[];
  fullHeight?: boolean;
  shadow?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col rounded-md p-8 ${shadow && "shadow-lg"} ${fullHeight ? "h-[82vh]" : "h-[38vh]"}`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold">Leave Requests</span>{" "}
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col space-y-4">
        {leaveRequests.map((leaveRequest, idx) => (
          <EmployeeLeaveRequest key={idx} leaveRequest={leaveRequest} />
        ))}
        {leaveRequests.length === 0 && (
          <div className="flex flex-1 items-center justify-center self-center text-center">
            <span>No Leave Requests</span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeeLeaveRequest = ({
  leaveRequest,
}: {
  leaveRequest: LeaveRequest;
}) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-gray-400 px-4 py-4 text-xs 2xl:flex-row 2xl:items-start 2xl:justify-between">
      <div className="flex h-full flex-col justify-between 2xl:w-[35%]">
        <div>
          <p className="font-semibold">{leaveRequest.title}</p>
          {/* <p>Employee : John Doe</p> */}
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
      <div className="relative flex h-full flex-col items-center justify-between gap-y-3 text-xs 2xl:w-[15%]">
        {leaveRequest.status === "Pending" && (
          <button
            onClick={async () => {
              const res = await deleteLeaveRequest(leaveRequest);
              if (res.success) {
                successToast(res.message);
              } else {
                errorToast(res.message);
              }
            }}
            className="flex items-center justify-center self-end"
          >
            <img src="/icons/delete.png" alt="" />
          </button>
        )}
        <span
          className={cn("w-full rounded py-1 text-center text-white", {
            "bg-[#6571FF]": leaveRequest.status === "Approved",
            "bg-yellow-500": leaveRequest.status === "Pending",
            "bg-rose-500": leaveRequest.status === "Rejected",
          })}
        >
          {leaveRequest.status}
        </span>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequests;
