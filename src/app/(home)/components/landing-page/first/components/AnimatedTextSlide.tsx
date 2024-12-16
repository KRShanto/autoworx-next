import React from "react";
import StarIcon from "./StarIcon";

const sentences = [
  "Streamline your automotive business with Autoworx",
  "Discover seamless scheduling, inventory tracking, and client management",
  "Transform your workflow with intelligent automation solutions",
  "Boost efficiency with our comprehensive management tools",
];

export function AnimatedTextSlide() {
  return (
    <div className="overflow-hidden bg-[#013633] py-4 text-white">
      <div className="animate-landingpage-left-animation flex py-3">
        <div className="flex shrink-0">
          {[...sentences, ...sentences].map((sentence, index) => (
            <span
              key={`first-${index}`}
              className="inline-flex gap-6 whitespace-nowrap px-4 text-xl font-semibold"
            >
              <StarIcon />
              <span>{sentence}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
