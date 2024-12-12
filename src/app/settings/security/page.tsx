import { getCompany } from "@/actions/settings/getCompany";
import React from "react";
import SecurityPage from "./SecurityPage";

type Props = {};

const page = async (props: Props) => {
  const company = await getCompany();

  return <SecurityPage company={JSON.parse(JSON.stringify(company))} />;
};

export default page;
