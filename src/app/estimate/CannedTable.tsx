import React from "react";
import CannedLabor from "./CannedLabor";
import CannedServices from "./CannedServices";
import { Category, Labor } from "@prisma/client";

type Props = {
  labors: (Labor & { category: Category })[];
  services: any;
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
        <CannedServices />
      </div>
    </div>
  );
};

export default CannedTable;
