"use client";
import React, { useState } from "react";
import CalendarAndTasks from "./CalendarAndTasks";
import Communications from "./Communications";
import EstimatesAndInvoices from "./EstimatesAndInvoices";
import Inventory from "./Inventory";
import LeadsGeneratedAndSalesPipeline from "./LeadsGeneratedAndSalesPipeline";
import OperationalPipeline from "./OperationalPipeline";
import Payments from "./Payments";
import Workforce from "./Workforce";

type Props = {};

const Page = (props: Props) => {
  const [leadsGeneratedOpen, setLeadsGeneratedOpen] = useState(false);
  const [operationalPipelineOpen, setOperationalPipelineOpen] = useState(false);
  const [calendarAndTasksOpen, setCalendarAndTasksOpen] = useState(false);
  const [estimatesAndInvoicesOpen, setEstimatesAndInvoicesOpen] =
    useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [communicationsOpen, setCommunicationsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [workforceOpen, setWorkforceOpen] = useState(false);

  function handleClose() {
    setOperationalPipelineOpen(false);
    setLeadsGeneratedOpen(false);
    setCalendarAndTasksOpen(false);
    setEstimatesAndInvoicesOpen(false);
    setPaymentsOpen(false);
    setCommunicationsOpen(false);
    setInventoryOpen(false);
    setWorkforceOpen(false);
  }

  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <h3 className="my-4 text-lg font-bold">Overall Notification Settings</h3>
      <h3 className="my-4 text-lg italic">
        Toggle between email, push and silenced notifications for the following
      </h3>
      <div className="grid grid-cols-2 gap-x-8">
        {/* account detail */}
        <div className="#w-1/2">
          <div className="space-y-4 rounded-md p-8">
            <LeadsGeneratedAndSalesPipeline
              leadsGeneratedOpen={leadsGeneratedOpen}
              setLeadsGeneratedOpen={setLeadsGeneratedOpen}
              handleClose={handleClose}
            />
            <OperationalPipeline
              operationalPipelineOpen={operationalPipelineOpen}
              setOperationalPipelineOpen={setOperationalPipelineOpen}
              handleClose={handleClose}
            />
            <CalendarAndTasks
              calendarAndTasksOpen={calendarAndTasksOpen}
              setCalendarAndTasksOpen={setCalendarAndTasksOpen}
              handleClose={handleClose}
            />
            <EstimatesAndInvoices
              estimatesAndInvoicesOpen={estimatesAndInvoicesOpen}
              setEstimatesAndInvoicesOpen={setEstimatesAndInvoicesOpen}
              handleClose={handleClose}
            />
          </div>
        </div>
        {/* new password */}
        <div className="#w-1/2">
          <div className="space-y-4 rounded-md p-8">
            <Payments
              paymentsOpen={paymentsOpen}
              setPaymentsOpen={setPaymentsOpen}
              handleClose={handleClose}
            />
            <Communications
              communicationsOpen={communicationsOpen}
              setCommunicationsOpen={setCommunicationsOpen}
              handleClose={handleClose}
            />
            <Inventory
              inventoryOpen={inventoryOpen}
              setInventoryOpen={setInventoryOpen}
              handleClose={handleClose}
            />
            <Workforce
              workforceOpen={workforceOpen}
              setWorkforceOpen={setWorkforceOpen}
              handleClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
