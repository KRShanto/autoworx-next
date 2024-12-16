import React from "react";
import BusinessForm from "./BusinessForm";
import { getCompany } from "@/actions/settings/getCompany";

export default async function Container() {
  const company = await getCompany();
  return (
    <div className="rounded-md p-8 pt-2 shadow-md">
      <BusinessForm company={JSON.parse(JSON.stringify(company))} />
    </div>
  );
}
