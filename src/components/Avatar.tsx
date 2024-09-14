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
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={
        !photo
          ? "/images/default.png"
          : photo.includes("/images/default.png")
            ? "/images/default.png"
            : `/api/images/${photo}`
      }
      alt="User Image"
      width={width}
      height={height}
      className={cn("rounded-full", className)}
    />
  );
}
