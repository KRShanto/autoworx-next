import { CarouselTestimonials } from "./CarouselTestimonials";

export default function Testimonials() {
  return (
    <div className="mt-20 bg-gradient-to-r from-[#26AADF42] to-[#01A79E42]">
      <div className="mx-auto flex h-screen max-w-7xl items-center justify-center">
        <div className="flex items-center justify-center gap-x-5">
          <CarouselTestimonials />
        </div>
      </div>
    </div>
  );
}
