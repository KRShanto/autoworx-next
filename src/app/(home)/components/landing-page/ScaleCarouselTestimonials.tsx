"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

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

export default function ScaleCarouselTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const timeIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    timeIdRef.current = setInterval(prevSlide, 2000);
    return () => {
      clearInterval(timeIdRef.current as NodeJS.Timeout);
      timeIdRef.current = null;
    };
  }, []);

  const getTestimonialPosition = (index: number) => {
    const total = testimonials.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return "visible-left";
    if (diff === 1) return "visible-right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "right";
    return "hidden";
  };

  const onMouseover = () => {
    clearInterval(timeIdRef.current as NodeJS.Timeout);
    timeIdRef.current = null;
  };

  const onMouseLeave = () => {
    timeIdRef.current = setInterval(prevSlide, 2000);
  };

  return (
    <div className="carousel-container">
      <button
        onMouseOver={onMouseover}
        onMouseLeave={onMouseLeave}
        onClick={prevSlide}
        className="carousel-btn"
      >
        ◀
      </button>
      <div className="carousel">
        {testimonials.map((testimonial, index) => {
          const position = getTestimonialPosition(index);
          return (
            <motion.div
              onMouseOver={onMouseover}
              onMouseLeave={onMouseLeave}
              key={testimonial.id}
              className={`testimonial-card ${position} cursor-pointer`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={
                position === "visible-left" || position === "visible-right"
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0.5, scale: 0.7 }
              }
              transition={{ duration: 0.5 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          );
        })}
      </div>
      <button
        onMouseOver={onMouseover}
        onMouseLeave={onMouseLeave}
        onClick={nextSlide}
        className="carousel-btn"
      >
        ▶
      </button>
    </div>
  );
}
