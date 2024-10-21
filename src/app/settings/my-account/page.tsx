import getUser from "@/lib/getUser";
import React from "react";
import MyAccount from "./MyAccount";

const page = async () => {
  const user = await getUser();
  return <MyAccount user={user} />;
};

export default page;
