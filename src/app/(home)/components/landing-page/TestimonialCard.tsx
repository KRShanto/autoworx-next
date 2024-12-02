import Image from "next/image";
import React from "react";
import Ratings from "./Ratings";

type TProps = {
  testimonial: {
    id: number;
    imageUrl: string;
    content: string;
    ratings: number;
  };
};

export default function TestimonialCard({ testimonial }: TProps) {
  const { imageUrl, content, ratings } = testimonial || {};
  return (
    <div className="h-[593px] w-[443px] rounded-xl bg-white shadow-lg">
      <div className="relative mx-auto -mt-[93px] flex size-[196px] items-center justify-center overflow-hidden rounded-full">
        <Image src={imageUrl} alt="person image" fill />
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="px-16 py-8 text-center text-xl font-normal leading-9">
          {content}
        </p>
        <Ratings ratings={ratings} />
      </div>
    </div>
  );
}
