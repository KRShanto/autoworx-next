import { getCompany } from "@/actions/settings/getCompany";
import { regenerateZapierToken } from "@/actions/settings/regenerateZapierToken";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import React from "react";
import SecurityPage from "./SecurityPage";

type Props = {};

const page = async (props: Props) => {
  const company = await getCompany();
 
  return <SecurityPage company={company} />;
};

export default page;
