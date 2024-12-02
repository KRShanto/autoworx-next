import React from "react";
import Image from "next/image";

export function FirstContact() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              <span className="bg-custom-gradient-lp bg-clip-text text-transparent">
                Run Your Automotive
                <br />
                Business with Ease
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-justify text-3xl leading-relaxed text-black">
              Autoworx is your all-in-one business management platform,
              streamlining everything from client bookings to inventory
              management. Start simplifying your day-to-day and watch your
              business grow with a tool built for the automotive industry.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="flex items-center rounded-lg bg-custom-gradient-lp px-8 py-3 uppercase text-white hover:opacity-90">
                Request A Demo
              </button>
              <div className="inline-block rounded-lg bg-custom-gradient-lp p-[2px]">
                <button className="rounded-lg bg-white px-8 py-3 uppercase">
                  <span className="bg-custom-gradient-lp bg-clip-text font-semibold text-transparent">
                    Contact Us
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <Image
              src="/landing/firstContact.svg"
              alt="Automotive Workshop"
              className="w-full rounded-sm"
              width={600}
              height={450}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
