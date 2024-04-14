import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-bold text-[#797979] text-[26px]">{children}</h1>;
}
