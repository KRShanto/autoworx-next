"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function Last() {
  return (
    <div>
      <PricingPlans />
      <FAQSection />
      <Footer />
    </div>
  );
}

function FAQSection() {
  return (
    <div className="bg-[#bde7f1] py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-[#00B8D4]">
          FAQs
        </h2>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="overflow-hidden rounded-xl border-2 border-[#00B8D4] bg-white"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <span className="text-lg font-semibold">What is Autoworx?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                Autoworx is a comprehensive automotive shop management platform
                that helps streamline your business operations, from customer
                communication to inventory management and everything in between.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="overflow-hidden rounded-xl border-2 border-[#00B8D4] bg-white"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <span className="text-lg font-semibold">
                  How does Autoworx help with quotes and invoices?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                Autoworx provides an intuitive system for creating professional
                quotes and invoices, with features like automated pricing
                calculations, digital signatures, and integration with popular
                accounting software.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="overflow-hidden rounded-xl border-2 border-[#00B8D4] bg-white"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <span className="text-lg font-semibold">
                  Can Autoworx help manage my team and contractors?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                Yes, Autoworx includes comprehensive team management features,
                including employee scheduling, time tracking, performance
                monitoring, and contractor management tools to help coordinate
                your entire workforce.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="overflow-hidden rounded-xl border-2 border-[#00B8D4] bg-white"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <span className="text-lg font-semibold">
                  Does Autoworx support data migration?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                Yes, Autoworx offers comprehensive data migration support to
                help you seamlessly transfer your existing business data into
                the platform, including customer records, inventory, and
                historical transaction data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function PricingPlans() {
  const activeColor = "#01A79E2E";
  const [activePlan, setActivePlan] = useState("Monthly");
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#00B8D4]">Pricing Plan</h2>
        <p className="text-xl">Get started with Autoworx today!</p>
      </div>

      <div className="mb-12 flex justify-center">
        <div className="#bg-white inline-flex items-center rounded-full border border-[#00B8D4] p-1">
          <Button
            onClick={() => {
              setActivePlan("Monthly");
            }}
            variant="ghost"
            className={`${activePlan === "Monthly" && `bg-[#01A79E2E] text-[#00B8D4] hover:bg-[#01A79E2E] hover:text-[#00B8D4]`} rounded-full px-6`}
          >
            Monthly
          </Button>
          <Button
            onClick={() => {
              setActivePlan("Annual");
            }}
            variant="ghost"
            className={`${activePlan === "Annual" && `bg-[#01A79E2E] text-[#00B8D4] hover:bg-[#01A79E2E] hover:text-[#00B8D4]`} rounded-full px-6`}
          >
            Annual
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-x-6">
        {/* Basic Plan */}
        <Card className="w-[23%] bg-[#024B5A] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-[#00B8D4]">Basic</CardTitle>
            <div className="text-4xl font-bold">$299</div>
          </CardHeader>
          <CardContent>
            <Button className="mb-6 w-full bg-white font-medium text-[#00B8D4] hover:bg-gray-100">
              GET STARTED
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>SMS & Email</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Sales Pipeline</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Reporting & Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Estimates & Invoicing</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Workflows, Inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Payments (CARFAX, Employee Timesheets)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Shop Plan */}
        <Card className="w-[20%] bg-[#024B5A] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-[#00B8D4]">Shop</CardTitle>
            <div className="text-4xl font-bold">$499</div>
          </CardHeader>
          <CardContent>
            <Button className="mb-6 w-full bg-white font-medium text-[#00B8D4] hover:bg-gray-100">
              GET STARTED
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Inspections</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Unlimited SMS & Email</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Sales Pipeline</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Reporting & Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Estimates & Invoicing</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Custom Workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 text-white" />
                <span>Inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />
                <span>
                  Payments (E-signatures, Mobile App for Technicians & Sales
                  Staff, Vehicle Lookup, CARFAX, QuickBooks Integrations,
                  Employee Timesheets)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="w-[20%] bg-[#024B5A] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-[#B042FF]">
              Enterprise
            </CardTitle>
            <div className="text-4xl font-bold">$699</div>
          </CardHeader>
          <CardContent>
            <Button className="mb-6 w-full bg-white font-medium text-[#00B8D4] hover:bg-gray-100">
              GET STARTED
            </Button>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Labor Guides</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Inspections</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Unlimited SMS & Email</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Custom Sales Pipelines</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Reporting & Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Estimates & Invoicing</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Custom Workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>Inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <FaRegCircleCheck className="h-5 w-5 shrink-0 text-white" />

                <span>
                  Payments (E-signatures, Mobile App for Technicians & Sales
                  Staff, Vehicle Lookup, CARFAX, QuickBooks Integrations,
                  Employee Timesheets)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Custom Plan */}
        <Card className="w-[20%] bg-[#024B5A] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-[#FFB342]">Custom</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mb-6 w-full border-4 border-[#00B8D4] bg-[#024B5A] text-white">
              REQUEST A QUOTE
            </Button>
            <div className="mt-4">
              <p>
                Customize Autoworx to provide exactly what you need for your
                growing business
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#024B5A] py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Contact Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Any Questions?</h2>
            <p className="text-gray-300">
              Let us know! We are at your service!
            </p>

            <div className="space-y-2">
              <h3 className="text-lg">Call us</h3>
              <p className="text-2xl font-bold">12348635043</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg">Email</h3>
              <a href="mailto:autoworx@autoworx.com" className="text-xl">
                autoworx@autoworx.com
              </a>
            </div>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/design" className="hover:text-[#00B8D4]">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/prototyping" className="hover:text-[#00B8D4]">
                  Prototyping
                </Link>
              </li>
              <li>
                <Link
                  href="/development-features"
                  className="hover:text-[#00B8D4]"
                >
                  Development features
                </Link>
              </li>
              <li>
                <Link href="/design-systems" className="hover:text-[#00B8D4]">
                  Design systems
                </Link>
              </li>
              <li>
                <Link
                  href="/collaboration-features"
                  className="hover:text-[#00B8D4]"
                >
                  Collaboration features
                </Link>
              </li>
              <li>
                <Link href="/design-process" className="hover:text-[#00B8D4]">
                  Design process
                </Link>
              </li>
              <li>
                <Link href="/figjam" className="hover:text-[#00B8D4]">
                  FigJam
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-[#00B8D4]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/best-practices" className="hover:text-[#00B8D4]">
                  Best practices
                </Link>
              </li>
              <li>
                <Link href="/colors" className="hover:text-[#00B8D4]">
                  Colors
                </Link>
              </li>
              <li>
                <Link href="/color-wheel" className="hover:text-[#00B8D4]">
                  Color wheel
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#00B8D4]">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-[#00B8D4]">
                  Developers
                </Link>
              </li>
              <li>
                <Link href="/resource-library" className="hover:text-[#00B8D4]">
                  Resource library
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo Section */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="space-y-2">
              <div className="w-full">
                <Image
                  src="/icons/footerLogo.png"
                  alt="Autoworx Logo"
                  width={200}
                  height={100}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
