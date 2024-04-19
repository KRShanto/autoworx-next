import React from "react";
import Collaboration from "./Collaboration";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communication Hub - Collaboration",
};

export default function Page() {
  return (
    <div>
      <Title>Communication Hub - Collaboration</Title>

      <Collaboration />
    </div>
  );
}
