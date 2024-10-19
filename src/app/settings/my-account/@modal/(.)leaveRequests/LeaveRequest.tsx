"use client";
import EmployeeLeaveRequests from "@/app/(dashboard)/EmployeeLeaveRequests";
import {
  DialogClose,
  DialogContentBlank,
  DialogOverlay,
  DialogPortal,
  InterceptedDialog,
} from "@/components/Dialog";
import { LeaveRequest as TLeaveRequest } from "@prisma/client";
import { HiXMark } from "react-icons/hi2";

const LeaveRequest = ({
  leaveRequests,
}: {
  leaveRequests: TLeaveRequest[];
}) => {
  return (
    <InterceptedDialog>
      <div>
        <DialogPortal>
          <DialogOverlay />
          <DialogContentBlank className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-full translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200">
            <div className="#shadow-lg relative grid h-[90vh] w-[740px] shrink grow-0 gap-4 overflow-y-auto border bg-background p-6">
              <div className="bg-white">
                <EmployeeLeaveRequests
                  fullHeight
                  leaveRequests={leaveRequests}
                />
              </div>

              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground print:hidden">
                <HiXMark className="h-6 w-6 text-slate-500" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </DialogContentBlank>
        </DialogPortal>
      </div>
    </InterceptedDialog>
  );
};

export default LeaveRequest;
