"use client";
import React, { useState } from "react";
import Image from "next/image";

interface PricePlansProps {
  setClose: () => void;
  setSelectedPlan: (planName: string) => void;
  currentPlan: string | null;
}
export function PricePlans({
  setClose,
  setSelectedPlan,
  currentPlan,
}: PricePlansProps) {
  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);

    setClose();
  };

  const getButtonLabel = (planName: string) => {
    return currentPlan === planName ? "Current Plan" : "Choose Plan";
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 py-20"
    onClick={setClose}
    >
      <div className="max-w-8xl relative mx-auto px-4">
        <div className="flex w-[1000px] justify-center space-x-6"
         onClick={(e) => e.stopPropagation()}
        >
          {/* Plan 1 */}
          <div className="w-full max-w-xl rounded-md bg-white shadow-lg">
            <div className="flex flex-col items-center p-6 pt-0">
              <div className="mb-4">
                <button
                  type="button"
                  className="rounded-sm bg-gray-500 px-4 py-2 text-white"
                  onClick={() => handlePlanSelect("Autoworx Basic Plan")}
                >
                  {getButtonLabel("Autoworx Basic Plan")}
                </button>
              </div>
              <Image
                src="/icons/CompanyLogo1.svg"
                width={200}
                height={200}
                alt="Company logo"
              ></Image>
              <h2 className="mb-4 mt-4 text-lg font-semibold text-gray-500">
                Autoworx Basic Plan
              </h2>
              <ul className="text-gray-600">
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 1
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 2
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 3
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 4
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 6
                </li>
              </ul>
            </div>
          </div>
          {/* Plan 2 */}
          <div className="w-full max-w-sm rounded-md bg-white shadow-lg">
            <div className="flex flex-col items-center p-6 pt-0">
              <div className="mb-4">
                <button
                  type="button"
                  className="rounded-sm bg-[#6571FF] px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => handlePlanSelect("Autoworx Standard Plan")}
                >
                  {getButtonLabel("Autoworx Standard Plan")}
                </button>
              </div>
              <Image
                src="/icons/CompanyLogo2.svg"
                width={200}
                height={200}
                alt="Company logo"
              ></Image>
              <h2 className="mb-4 mt-4 text-lg font-semibold text-[#6571FF]">
                Autoworx Standard Plan
              </h2>
              <ul className="text-gray-600">
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 1
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 2
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 3
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 4
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 6
                </li>
              </ul>
            </div>
          </div>
          {/* Plan 3 */}
          <div className="w-full max-w-sm rounded-md bg-white shadow-lg">
            <div className="flex flex-col items-center p-6 pt-0">
              <div className="mb-4">
                <button
                  type="button"
                  className="rounded-sm bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  onClick={() => handlePlanSelect("Autoworx Premium Plan")}
                >
                  {getButtonLabel("Autoworx Premium Plan")}
                </button>
              </div>
              <Image
                src="/icons/CompanyLogo3.svg"
                width={200}
                height={200}
                alt="Company logo"
              ></Image>
              <h2 className="mb-4 mt-4 text-lg font-semibold text-yellow-500">
                Autoworx Premium Plan
              </h2>
              <ul className="text-gray-600">
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 1
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 2
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 3
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 4
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2">✔</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✔</span> Feature 6
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
