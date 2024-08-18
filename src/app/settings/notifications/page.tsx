"use client";
import React, { useState } from "react";
import CalendarAndTasks from "./CalendarAndTasks";
import LeadsGeneratedAndSalesPipeline from "./LeadsGeneratedAndSalesPipeline";
import OperationalPipeline from "./OperationalPipeline";

type Props = {};

const Page = (props: Props) => {
  const [leadsGeneratedOpen, setLeadsGeneratedOpen] = useState(false);
  const [operationalPipelineOpen, setOperationalPipelineOpen] = useState(false);
  const [calendarAndTasksOpen, setCalendarAndTasksOpen] = useState(false);
  function handleClose() {
    setOperationalPipelineOpen(false);
    setLeadsGeneratedOpen(false);
    setCalendarAndTasksOpen(false);
  }
  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        {/* account detail */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Account Details</h3>
          <div className="space-y-8 rounded-md p-8 shadow-md">
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
          </div>
        </div>
        {/* new password */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">New Password</h3>

          <div className="space-y-4 rounded-md p-8 shadow-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
