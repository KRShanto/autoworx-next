// import { CarouselTestimonials } from "./CarouselTestimonials";
import dynamic from "next/dynamic";

const ScaleCarouselTestimonials = dynamic(
  () => import("./ScaleCarouselTestimonials"),
  { ssr: false },
);

export default function Testimonials() {
  return (
    <div className="mt-20 bg-gradient-to-r from-[#26AADF42] to-[#01A79E42]">
      <div className="mx-auto flex h-screen max-w-7xl items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-x-5">
          {/* <CarouselTestimonials /> */}
          <ScaleCarouselTestimonials />
        </div>
      </div>
    </div>
  );
}
