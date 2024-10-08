import React from "react";
import CannedLabor from "./CannedLabor";
import CannedServices from "./CannedServices";
import { Category, Labor, Service } from "@prisma/client";

type Props = {
  labors: (Labor & { category: Category })[];
  services: (Service & { category: Category })[];
};

const CannedTable = (props: Props) => {
  return (
    <div className="flex min-h-[65vh] items-start rounded-md">
      {/* canned labor */}
      <div className="w-1/2">
        <CannedLabor labors={props.labors} />
      </div>
      {/* canned services */}
      <div className="w-1/2">
        <CannedServices services={props.services} />
      </div>
    </div>
  );
};

export default CannedTable;
