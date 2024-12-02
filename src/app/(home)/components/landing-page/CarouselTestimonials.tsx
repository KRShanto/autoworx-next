"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel.tsx";
import TestimonialCard from "./TestimonialCard.tsx";

import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    id: 1,
    imageUrl: "/images/landing/person-1.jfif",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ratings: 5,
  },
  {
    id: 2,
    imageUrl: "/images/landing/person-2.png",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ratings: 5,
  },
  {
    id: 3,
    imageUrl: "/images/landing/person-1.jfif",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ratings: 5,
  },
  {
    id: 4,
    imageUrl: "/images/landing/person-2.png",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ratings: 5,
  },
];

export function CarouselTestimonials() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 1200,
        }),
      ]}
      orientation="horizontal"
      className="w-full max-w-7xl"
    >
      <CarouselContent className="-mt-1">
        {testimonials.map((testimonial, index) => (
          <CarouselItem
            key={index}
            className="flex h-[800px] cursor-pointer select-none items-center justify-center pt-1 md:basis-1/3"
          >
            <TestimonialCard testimonial={testimonial} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
}
