import { cn } from "@/lib/cn";
import Image from "next/image";
import React from "react";

export default function Avatar({
  photo,
  width,
  height,
  className,
}: {
  photo?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-full", className)}
      style={{
        width: `${width || 50}px`,
        height: `${height || 50}px`,
      }}
    >
      <Image
        src={
          !photo
            ? "/images/default.png"
            : photo.includes("/images/default.png")
              ? "/images/default.png"
              : photo
        }
        alt="User Image"
        className={"rounded-full object-fill"}
        fill
      />
    </div>
  );
}
