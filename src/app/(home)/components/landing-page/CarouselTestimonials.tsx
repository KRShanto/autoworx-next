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
      "AutoWorx provided exceptional service! My car has never run smoother. From the moment I walked in, I was greeted with professionalism and friendliness. The technicians took the time to explain every detail of the repairs needed. Highly recommended!",
    ratings: 5,
  },
  {
    id: 2,
    imageUrl: "/images/landing/person-2.png",
    content:
      "The team was professional and efficient. They diagnosed the issue with my car quickly and had it fixed in no time! Their transparency and dedication are unmatched. I appreciate their honest work and will definitely be coming back.",
    ratings: 5,
  },
  {
    id: 3,
    imageUrl: "/images/landing/person-1.jfif",
    content:
      "Excellent experience! The staff was friendly and my vehicle feels brand new. They even offered a complimentary car wash after the service. I'll definitely be returning for any future needs. Thank you, AutoWorx!",
    ratings: 5,
  },
  {
    id: 4,
    imageUrl: "/images/landing/person-2.png",
    content:
      "I'm impressed with their quality of work. AutoWorx is my go-to from now on. They went above and beyond to ensure my car was in top condition. Their attention to detail and customer service exceeded my expectations.",
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
          delay: 2500,
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
