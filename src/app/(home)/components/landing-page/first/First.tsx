import React from "react";
import { FirstContact } from "./components/FirstContact";
import { SolutionsSection } from "./components/SolutionSection";

import { AnimatedTextSlide } from "./components/AnimatedTextSlide";

export default function First() {
  return (
    <div className="bg-landing-bg-color">
      <FirstContact />
      <SolutionsSection />
      <AnimatedTextSlide />
    </div>
  );
}
