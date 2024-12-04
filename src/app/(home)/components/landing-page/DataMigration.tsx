import Image from "next/image";
import React from "react";
import DataMigrationServiceCard from "./DataMirgrationServiceCard";

const services = [
  {
    id: 1,
    name: "Comprehensive Onboarding Support",
    description:
      "Our experts work with you to understand your data needs, making sure all historical data, customer profiles, and job histories are transferred seamlessly.",
  },
  {
    id: 2,
    name: "Secure and Accurate Transfer",
    description:
      "Data integrity is crucial. We use industry-leading security protocols to protect your information during every step of the migration.",
  },
  {
    id: 3,
    name: "Flexible Solutions for Any System",
    description:
      "Whether you’re coming from spreadsheets, legacy software, or a different digital solution, our team is equipped to handle migrations from various formats.",
  },
];

export default function DataMigration() {
  return (
    <div className="mx-auto max-w-7xl" id="data">
      {/* title */}
      <div className="text-center">
        <h1 className="text-gradient text-[64px] font-bold">Data Migration</h1>
        <p className="text-[33px]">
          Effortless Data Migration for a Smooth Transition
        </p>
      </div>
      {/* image or content */}
      <div className="space-y-2">
        <div className="mx-auto h-[495px] w-[993px] overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              //   className="absolute"
              src={"/gif/sky.gif"}
              alt="sky gif"
              fill
              className="scale-125"
            />
            <Image
              src={"/gif/connect.gif"}
              alt="connect gif"
              fill
              className="!top-8 scale-110"
            />
          </div>
        </div>
        <p className="px-16 text-center text-[33px]">
          Switching to a new management platform shouldn’t disrupt your
          workflow. Autowrx prioritizes a seamless data migration process,
          ensuring your records move safely and accurately into our system. Our
          team of migration specialists will guide you every step of the way,
          from preparing your data to verifying its accuracy once it’s live.
        </p>
      </div>
      {/* data migration service card */}
      <div className="mt-12 grid grid-cols-3 items-center justify-center gap-x-6">
        {services.map((service) => (
          <DataMigrationServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
