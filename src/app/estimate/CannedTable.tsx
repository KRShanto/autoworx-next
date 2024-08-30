import React from "react";
import CannedLabor from "./CannedLabor";
import CannedServices from "./CannedServices";

type Props = {};

const CannedTable = (props: Props) => {
  return (
    <div className="flex min-h-[65vh] items-start rounded-md">
      {/* canned labor */}
      <div className="w-1/2">
        <CannedLabor />
      </div>
      {/* canned services */}
      <div className="w-1/2">
        <CannedServices />
      </div>
    </div>
  );
};

export default CannedTable;
