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
    <div>
      <div>
        <Image src={imageUrl} alt="person image" width={100} height={100} />
      </div>
      <p>{content}</p>
      <Ratings ratings={ratings} />
    </div>
  );
}
