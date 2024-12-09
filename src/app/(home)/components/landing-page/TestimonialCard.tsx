"use client";
import Image from "next/image";
import React from "react";
import Ratings from "./Ratings";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type TProps = {
  testimonial: {
    id: number;
    imageUrl: string;
    content: string;
    ratings: number;
  };
  currentIndex?: number;
  index?: number;
};

export default function TestimonialCard({
  testimonial,
  currentIndex = 0,
  index,
}: TProps) {
  const { imageUrl, content, ratings } = testimonial || {};
  return (
    <motion.div
      className={cn(
        "h-[593px] w-[443px] select-none rounded-xl bg-white shadow-2xl",
      )}
    >
      <div className="relative mx-auto -mt-[93px] flex size-[196px] items-center justify-center overflow-hidden rounded-full">
        <Image src={imageUrl} alt="person image" fill />
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="px-16 py-8 text-center text-xl font-normal leading-9">
          {content}
        </p>
        <Ratings ratings={ratings} />
      </div>
    </motion.div>
  );
}
