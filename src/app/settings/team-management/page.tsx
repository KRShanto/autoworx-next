"use client";
import React from "react";

import UserRolesTable from "./UserRolesTable";
import UserComponent from "./UserComponent";

export default function Page() {
  return (
    <div className="flex w-[100vw] gap-4">
      {/* 1st Section */}
      <div className="w-[65%]">
        <UserRolesTable />
      </div>

      {/* 2nd Section */}
      <div className="w-[35%]">
        <UserComponent />
      </div>
    </div>
  );
}
