import React from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex items-start h-full">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;
