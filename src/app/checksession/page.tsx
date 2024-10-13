import { getUserFromSession } from "@/lib/getCurrentUser";
import React from "react";

export default async function page() {
  
  const user = await getUserFromSession();

  return <div>page:{user.employeeType}</div>;
}
