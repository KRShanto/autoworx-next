"use client";
import React from "react";

import UserRolesTable from "./UserRolesTable";
import UserComponent from "./UserComponent";

export default function Page() {
  return (
    <div className="flex w-[100vw] gap-4">
      <div className="w-[60%]">
        <UserRolesTable />
      </div>

      <div className="w-[40%]">
        <UserComponent />
      </div>
    </div>
  );
}
