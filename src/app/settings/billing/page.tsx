"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PricePlans } from "./PricePlans";
const paymentHistory = [
  { amount: "$100", method: "Credit Card", date: "2024-08-01" },
  { amount: "$200", method: "PayPal", date: "2024-08-02" },
  { amount: "$150", method: "Bank Transfer", date: "2024-08-03" },
  { amount: "$250", method: "Credit Card", date: "2024-08-04" },
  { amount: "$250", method: "Credit Card", date: "2024-08-04" },
  { amount: "$250", method: "Credit Card", date: "2024-08-04" },
  { amount: "$250", method: "Credit Card", date: "2024-08-04" },
  { amount: "$250", method: "Credit Card", date: "2024-08-04" },
];

const planColors: { [key: string]: string } = {
  "Autoworx Basic Plan": "text-gray-500",
  "Autoworx Standard Plan": "text-[#6571FF]",
  "Autoworx Premium Plan": "text-yellow-500",
};
export default function Page() {
  const [plansOpen, setPlansOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Autoworx Basic Plan");
  return (
    <div className="">
      <div className="relative -top-10 m-2 flex flex-col items-center space-y-2 overflow-hidden p-2">
        {/* Subscription Section */}
        <div className="mb-2 mt-10 w-[762px]">
          <h2 className="font-inter mb-2 text-[20px] font-semibold text-[#66738C]">
            Subscription
          </h2>
          <div className="flex gap-4 rounded-[5px] border border-[#D9D9D9] bg-white p-6">
            <div className="h-[212px] w-[50%]">
              <p className="font-inter mb-2 text-[20px] font-semibold leading-[24px] text-[#66738C]">
                Subscribed to{" "}
                <span
                  className={`font-semibold italic ${planColors[selectedPlan] || "text-gray-500"}`}
                >
                  {selectedPlan}
                </span>
              </p>
              <p className="font-inter mb-2 text-[20px] font-normal italic leading-[24px] text-[#66738C]">
                Activated on{" "}
                <span className="font-semibold italic">8th August 2024</span>
              </p>
              <p className="font-inter mb-4 text-[20px] font-normal italic leading-[24px] text-[#66738C]">
                Expires on{" "}
                <span className="font-semibold italic">8th August 2025</span>
              </p>

              <div className="mt-8 flex space-x-4">
                <button
                  className="font-inter h-[45px] w-[123px] rounded-[5px] bg-[#66738C] text-[20px] font-normal leading-[24px] text-white"
                  onClick={() => setPlansOpen((prev) => !prev)}
                >
                  Re-new
                </button>
                <button
                  className="font-inter h-[45px] w-[136px] rounded-[5px] bg-[#6571FF] text-[20px] font-bold leading-[24px] text-white"
                  onClick={() => setPlansOpen((prev) => !prev)}
                >
                  Upgrade
                </button>
              </div>
              <p className="font-inter mb-6 mr-4 mt-4 text-[14px] font-normal italic leading-[17px] text-[#66738C]">
                If you want a package customized according to your preferences,
                contact us here
              </p>
            </div>
            {/* icon section */}
            <div>
              <Image
                src="/icons/CompanyLogo1.svg"
                width={200}
                height={200}
                alt="Company logo"
              ></Image>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-4 w-[762px]">
          <h2 className="font-inter mb-4 text-[20px] font-semibold leading-[24px] text-[#66738C]">
            Payment Methods
          </h2>
          <div className="flex space-x-4">
            {/* Placeholder for logos */}
            <div className="flex h-[131px] w-[147px] items-center justify-center rounded-[5px] border border-[#D9D9D9] bg-white">
              <p className="font-inter text-[40px] font-semibold leading-[48px] text-[#66738C]">
                Logo
              </p>
            </div>
            <div className="flex h-[131px] w-[147px] items-center justify-center rounded-[5px] border border-[#D9D9D9] bg-white">
              <p className="font-inter text-[40px] font-semibold leading-[48px] text-[#66738C]">
                Logo
              </p>
            </div>
            <div className="flex h-[131px] w-[147px] items-center justify-center rounded-[5px] border border-[#D9D9D9] bg-white">
              <p className="font-inter text-[40px] font-semibold leading-[48px] text-[#66738C]">
                Logo
              </p>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-4 w-[762px]">
          <h2 className="font-inter mb-4 text-[20px] font-semibold leading-[24px] text-[#66738C]">
            Payment History
          </h2>
          <div className="h-[180px] overflow-x-auto rounded-[5px] border border-[#D9D9D9] bg-white p-4">
            <table className="min-w-full text-left">
              <thead>
                <tr className="font-inter sticky -top-4 bg-white text-[16px] font-bold leading-[19px] text-[#66738C]">
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="border border-[#D9D9D9]">
                {paymentHistory.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}
                  >
                    <td className="px-6 py-3">{entry.amount}</td>
                    <td className="px-6 py-3">{entry.method}</td>
                    <td className="px-6 py-3">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {plansOpen && (
        <PricePlans
          setSelectedPlan={setSelectedPlan}
          setClose={() => setPlansOpen(false)}
          currentPlan={selectedPlan}
        />
      )}
    </div>
  );
}
