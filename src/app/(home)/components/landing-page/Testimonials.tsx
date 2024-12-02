import CarouselTestimonial from "./CarouselTestimonial";
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
];

export default function Testimonials() {
  return (
    <div className="mt-20 bg-gradient-to-r from-[#26AADF42] to-[#01A79E42]">
      <div className="mx-auto flex h-screen max-w-7xl items-center justify-center">
        <div className="flex items-center justify-center gap-x-5">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
