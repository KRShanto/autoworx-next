import Title from "@/components/Title";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="p-8">
      <div className="mb-4">
        <Title>Dashboard</Title>
      </div>
      {children}
    </div>
  );
};

export default layout;
