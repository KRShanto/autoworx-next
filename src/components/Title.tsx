import { cn } from "@/lib/cn";
import React from "react";

export default function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn("text-[26px] font-bold text-[#797979]", className)}>
      {children}
    </h1>
  );
}
