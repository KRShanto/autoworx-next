"use client";
import { cn } from "@/lib/cn";
import Image from "next/image";
import React, { SetStateAction, useEffect, useRef, useState } from "react";

type TProps = {
  imageSrc: File | null;
  setImageSrc: React.Dispatch<SetStateAction<File | null>>;
};

export default function ProfilePicture({ imageSrc, setImageSrc }: TProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleProfilePictureChange = (
    e: React.MouseEvent<HTMLImageElement>,
  ) => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleFileChange = function (event: Event) {
      const input = event?.target as HTMLInputElement;
      const file = input?.files?.[0];
      if (file) {
        setImageSrc(file);
      }
    };
    if (fileInputRef.current) {
      fileInputRef.current.onchange = handleFileChange;
    }
    return () => {
      fileInputRef.current?.removeEventListener("onchange", handleFileChange);
    };
  }, []);
  return (
    <div className="flex items-center gap-x-8">
      <div className="relative mr-4 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-violet-400/20">
        <Image
          className={cn(imageSrc ? "w-fit rounded-full" : "")}
          src={
            imageSrc ? URL.createObjectURL(imageSrc!) : "/icons/business.png"
          }
          alt=""
          width={80}
          height={80}
        />
        <div>
          <input hidden ref={fileInputRef} type="file" name="" id="" />
          <Image
            onClick={handleProfilePictureChange}
            src="/icons/upArrow.png"
            alt=""
            className="absolute bottom-2 right-2 cursor-pointer"
            width={30}
            height={30}
          />
        </div>
      </div>
      <div>
        <p className="font-semibold">Profile Picture for Business</p>
        <p className="text-sm italic">
          Optimal Size of image size is 512x512 px (&#60;2.5 MB)
        </p>
      </div>
    </div>
  );
}
