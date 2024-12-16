import React from "react";

type TProps = {
  service: {
    id: number;
    name: string;
    description: string;
  };
};
export default function DataMigrationServiceCard({ service }: TProps) {
  return (
    <div className="size-[396px] space-y-3 rounded-[37px] bg-gradient-to-tl from-[#26AADF] to-[#01A79E] p-5">
      <h3 className="mt-5 text-center text-[33px] font-bold leading-[43px] text-white">
        {service.name}
      </h3>
      <p className="text-center text-2xl font-normal text-white">
        {service.description}
      </p>
    </div>
  );
}
