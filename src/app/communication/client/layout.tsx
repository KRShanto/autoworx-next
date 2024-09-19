import Title from "@/components/Title";
import React from "react";

export default function ClientPageLayout({
  children,
  list,
  box,
  details,
}: {
  children: React.ReactNode;
  list: React.ReactNode;
  box: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <div>
      <Title>Communication Hub - Client</Title>

      <div className="mt-5 flex justify-around ">
        {children}
        {list}
        {box}
        {details}
      </div>
    </div>
  );
}
