import React from "react";
import ReportLink from "../components/ReportLink";

type TProps = {
  children: React.ReactNode;
};

export default function ReportLayout({ children }: TProps) {
  return (
    <div>
      <div className="flex items-center p-5">
        <h1 className="mr-4 text-2xl font-bold">Reporting</h1>
        <div className="flex items-center gap-x-4">
          <ReportLink href="/reporting/revenue">Revenue</ReportLink>
          <ReportLink href="/reporting/inventory">Inventory</ReportLink>
          <ReportLink href="/reporting/pipeline">Pipeline</ReportLink>
          <ReportLink href="/reporting/payments">Payments</ReportLink>
          <ReportLink href="/reporting/workforce">Workforce</ReportLink>
        </div>
      </div>
      <div className="rounded-lg bg-white p-5 shadow-md">{children}</div>
    </div>
  );
}
