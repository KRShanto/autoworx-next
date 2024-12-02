import React from "react";
import { SolutionCard } from "./SolutionCard";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";
import { DecorativeDivider } from "./Devider";

const solutions = [
  {
    category: "Quick Quotes & Invoices",

    imageSrc: image1,
    features: [
      "Instant Quotes: Create accurate quotes in just a few clicks with automatic cost calculations for parts, labor, and service.",
      "One-Click Invoice Conversion: Seamlessly convert accepted quotes into invoices, leading to faster client profiles.",
      "Payment Management: Track payments, outstanding balances, and issue receipts with integration options for major payment gateways.",
    ],
  },
  {
    category: "Calendar & Task Management",

    imageSrc: image2,
    features: [
      "Centralized Scheduling: View client appointments, team availability, and workspace utilization with daily, weekly, or monthly views.",
      "Automated Reminders: Send clients reminders to reduce no-shows, with easy drag-&-drop rescheduling.",
      "Task Breakdown & Tracking: Assign, prioritize, and track daily tasks in real time to ensure efficient, on-time task delivery.",
    ],
  },
  {
    category: "Workforce & Contractor Management",

    imageSrc: image1,
    features: [
      "Job Assignments & Alerts: Assign jobs, set deadlines, and notify team members automatically.",
      "Time & Performance Tracking: Monitor time tracking, team productivity, and productivity insights with easy access to detailed performance reports.",
      "Contractor Management: Onboard and manage contractors with job assignments, ensuring smooth collaboration.",
    ],
  },
  {
    category: "Inventory Tracking",

    imageSrc: image2,
    features: [
      "Real-Time Stock Management: Track parts and supplies, receive low stock alerts, and simplify reordering.",
      "Mobile Scan for Quick Updates: Use mobile scanning to log inventory use instantly.",
      "Detailed Analytics: View stock trends and predictive values for better inventory decisions.",
    ],
  },
];

export function SolutionsSection() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="bg-custom-gradient-lp mb-4 bg-clip-text text-6xl font-bold text-transparent">
            The Solutions We Provide
          </p>
          <p className="mx-auto max-w-3xl text-3xl font-normal text-gray-900">
            Autoworx offers powerful tools tailored to streamline every aspect
            of your automotive business, from quotes and scheduling to inventory
            and workforce management.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={index}
              features={solution.features}
              imageSrc={solution.imageSrc}
              category={solution.category}
            />
          ))}
        </div>
      </div>
      <DecorativeDivider />
    </section>
  );
}
