import React from "react";
import BusinessForm from "./BusinessForm";
import { getCompany } from "@/actions/settings/getCompany";

export default async function Container() {
  const company = await getCompany();
  return (
    <div className="space-y-8 rounded-md p-8 shadow-md">
      <BusinessForm company={company!} />
    </div>
  );
}
