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
                <Image src="/icons/avatar.png" alt="" width={80} height={80} />
                <Image
                  src="/icons/up arrow.png"
                  alt=""
                  className="absolute bottom-2 right-2"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <p className="font-semibold">Profile Picture</p>
                <p className="text-sm italic">
                  Optimal Size of image size is 512x512px (&#60;2.5 MB)
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* name */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput name="firstName" />
                <SlimInput name="lastName" />
              </div>
              {/* email and phone number */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput name="email" />
                <SlimInput name="mobileNumber" type="number" />
              </div>
              {/* address */}
              <div className="grid grid-cols-1">
                <SlimInput name="address" />
              </div>
              <div className="grid grid-cols-3 gap-x-8">
                <SlimInput name="city" />
                <SlimInput name="state" />
                <SlimInput name="zip" />
              </div>
              <div className="text-right">
                <button className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* new password */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">New Password</h3>

          <div className="space-y-4 rounded-md p-8 shadow-md">
            <SlimInput name="currentPassword" type="password" />
            <SlimInput name="newPassword" type="password" />
            <SlimInput name="confirmNewPassword" type="password" />
            <div className="mt-4 text-right">
              <button className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
