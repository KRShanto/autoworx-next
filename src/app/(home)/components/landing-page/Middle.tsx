import React from "react";
import DataMigration from "./DataMigration";
import Testimonials from "./Testimonials";

export default function Middle() {
  return (
    <div className="bg-[#F6FDFF]">
      <div className="mx-auto max-w-7xl">
        <DataMigration />
        <Testimonials />
      </div>
    </div>
  );
}
