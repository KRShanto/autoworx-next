"use client";
import SliderRange from "@/app/employee/components/SliderRange";
import { SlimInput } from "@/components/SlimInput";
import { Switch } from "@/components/Switch";
import { Range } from "@radix-ui/react-slider";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

type Props = {};

const collaborations = [
  {
    name: "Business Name 1",
    website: "https://www.business1.com",
    logo: "/icons/business.png",
    specialization: "Business Specialization",
    phone: "(123) 456-7890",
    address: "123 Main Street, Anytown, USA",
  },
  {
    name: "Business Name 2",
    website: "https://www.business1.com",
    logo: "/icons/business.png",
    specialization: "Business Specialization",
    phone: "(123) 456-7890",
    address: "123 Main Street, Anytown, USA",
  },
  {
    name: "Business Name 3",
    website: "https://www.business1.com",
    logo: "/icons/business.png",
    specialization: "Business Specialization",
    phone: "(123) 456-7890",
    address: "123 Main Street, Anytown, USA",
  },
];

const Page = (props: Props) => {
  const [businessVisibility, setBusinessVisibility] = useState(true);
  const [phoneVisibility, setPhoneVisibility] = useState(true);
  const [businessAddressVisibility, setBusinessAddressVisibility] =
    useState(true);
  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Collaborations</h3>
          <div className="space-y-8 rounded-md p-8 shadow-md">
            {collaborations.map((collaboration, index) => (
              <div
                key={index}
                className="flex items-center rounded border border-gray-200 px-8 py-4 hover:border-gray-300"
              >
                <Image
                  src={collaboration.logo}
                  alt={collaboration.name}
                  width={40}
                  height={40}
                />
                <div className="ml-4 flex w-full items-center justify-between gap-x-12">
                  <div>
                    <p className="text-lg font-medium">{collaboration.name}</p>
                    <p className="text-sm">{collaboration.website}</p>
                    <p className="text-sm">{collaboration.specialization}</p>
                    <p className="text-sm">{collaboration.phone}</p>
                    <p className="text-sm">{collaboration.address}</p>
                  </div>
                  <div className="text-sm italic">
                    <p>Collaborating since</p>
                    <p>January 1, 2024</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* network settings */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Network Settings</h3>

          <div className="space-y-4 rounded-md p-8 shadow-md">
            {/* settings */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span>Business Visibility</span>
                <span>
                  <Switch
                    checked={businessVisibility}
                    setChecked={setBusinessVisibility}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Business Phone Visibility</span>
                <span>
                  <Switch
                    checked={phoneVisibility}
                    setChecked={setPhoneVisibility}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Business Address Visibility</span>
                <span>
                  <Switch
                    checked={businessAddressVisibility}
                    setChecked={setBusinessAddressVisibility}
                  />
                </span>
              </div>
              <div className="">
                <p>Company Range Visibility</p>
                <p className="flex items-center justify-between">
                  <span>12 miles</span>
                  <SliderRange value={[1, 3000]} onChange={() => {}} />
                  <span>67 miles</span>
                </p>
              </div>
            </div>
            {/* possible collaborations nearby */}
            <div className="w-full space-y-2">
              <h3 className="my-4 text-lg font-bold">
                Possible Collaborations Nearby
              </h3>
              <div className="relative h-[35px] w-full rounded-md border border-gray-300 text-gray-400">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
                  <IoSearchOutline />
                </span>
                <input
                  name="search"
                  type="text"
                  className="h-full w-full rounded-md border border-slate-400 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search"
                  onChange={() => {}}
                />
              </div>
              <div className="space-y-8 rounded-md p-8 shadow-md">
                {collaborations.map((collaboration, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded border border-gray-200 px-8 py-4 hover:border-gray-300"
                  >
                    <Image
                      src={collaboration.logo}
                      alt={collaboration.name}
                      width={40}
                      height={40}
                    />
                    <div className="ml-4 flex w-full items-center justify-between gap-x-12">
                      <div>
                        <p className="text-lg font-medium">
                          {collaboration.name}
                        </p>
                        <p className="text-sm">{collaboration.website}</p>
                        <p className="text-sm">
                          {collaboration.specialization}
                        </p>
                        <p className="text-sm">{collaboration.phone}</p>
                        <p className="text-sm">{collaboration.address}</p>
                      </div>
                      <div className="text-sm italic">
                        <p>Collaborating since</p>
                        <p>January 1, 2024</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

{
  /* <button className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white">
Change Password
</button> */
}
