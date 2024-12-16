import { Category, Labor, Service } from "@prisma/client";
import React from "react";
import CannedLabor from "./CannedLabor";
import CannedServices from "./CannedServices";

type Props = {
  labors: (Labor & { category: Category })[];
  services: (Service & { category: Category })[];
};

const CannedTable = (props: Props) => {
  return (
    <div className="flex h-full flex-col rounded-md lg:flex-row lg:items-start">
      {/* canned labor */}
      <div className="h-full lg:basis-1/2">
        <CannedLabor labors={props.labors} />
      </div>
      {/* canned services */}
      <div className="h-full lg:basis-1/2">
        <CannedServices services={props.services} />
      </div>
    </div>
  );
};

export default CannedTable;
