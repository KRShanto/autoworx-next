import React from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="bg-[#F8F9FA]">
      <h1 className="my-4 ml-4 text-3xl font-bold">Settings</h1>
      <div className="relative flex h-full items-start space-x-4">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default layout;
