import { SlimInput } from "@/components/SlimInput";
import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        {/* account detail */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Account Details</h3>
          <div className="space-y-8 rounded-md p-8 shadow-md">
            {/* profile picture */}
            <div className="flex items-center gap-x-8">
              <div className="relative mr-4 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-violet-400/20">
                <Image
                  src="/icons/business.png"
                  alt=""
                  width={80}
                  height={80}
                />
                <Image
                  src="/icons/up arrow.png"
                  alt=""
                  className="absolute bottom-2 right-2"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <p className="font-semibold">Profile Picture for Business</p>
                <p className="text-sm italic">
                  Optimal Size of image size is 512x512 px (&#60;2.5 MB)
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* name and registration number */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput
                  label="Legal Business Name*"
                  name="legalBusinessName"
                />
                <SlimInput
                  label="Business Registration ID Number*"
                  name="businessRegistrationIDNumber"
                />
              </div>
              {/* businessType and phone number */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput label="Business Type*" name="businessType" />
                <SlimInput
                  label="Business Phone*"
                  name="businessPhone"
                  type="number"
                />
              </div>
              {/* industry and website */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput
                  label="Industry/Specialization"
                  name="industrySpecialization"
                />
                <SlimInput label="Business Website" name="businessWebsite" />
              </div>
              <div className="grid grid-cols-1">
                <SlimInput label="Company Address*" name="companyAddress" />
              </div>
              <div className="grid grid-cols-3 gap-x-8">
                <SlimInput label="City*" name="city" />
                <SlimInput label="State*" name="state" />
                <SlimInput label="Zip*" name="zip" />
              </div>
              <div className="text-right">
                <button className="ml-auto mt-4 rounded-md bg-[#6571FF] px-6 py-1 text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
