"use client";
import { createLeaveRequest } from "@/actions/settings/my-account/leaveRequests/createLeaveRequest";
import {
  changePassword,
  editMyAccountInfo,
  getMyAccountInfo,
} from "@/actions/settings/myAccount";
import { SlimInput } from "@/components/SlimInput";
import { SlimTextarea } from "@/components/SlimTextarea";
import { errorToast, successToast } from "@/lib/toast";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmNewPw, setConfirmNewPw] = useState("");

  // leave request
  const [leaveRequest, setLeaveRequest] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSubmitLeaveRequest = async () => {
    if (
      leaveRequest.title === "" ||
      leaveRequest.startDate === "" ||
      leaveRequest.endDate === "" ||
      leaveRequest.description === ""
    ) {
      errorToast("All fields are required");
    }
    let res = await createLeaveRequest(leaveRequest);
    if (!res.success) {
      errorToast(res?.message);
      return;
    }
    if (res.success) {
      setLeaveRequest({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      successToast(res.message);
    }
  };

  useEffect(() => {
    getMyAccountInfo().then((res) => {
      if (!res.success) return;
      const {
        firstName,
        lastName,
        email,
        image,
        phone,
        address,
        city,
        state,
        zip,
      } = res.data as User;
      setUserInfo({
        firstName,
        lastName: lastName || "",
        email,
        image,
        phone: phone || "",
        address: address || "",
        city: city || "",
        state: state || "",
        zip: zip || "",
      });
    });
  }, []);

  const uploadProfilePic = useCallback(
    async function () {
      if (profilePic) {
        const formData = new FormData();
        formData.append("photos", profilePic);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          return;
        }

        const json = await res.json();
        setUserInfo({
          ...userInfo,
          image: json.data[0],
        });
      }
    },
    [profilePic],
  );

  useEffect(() => {
    if (profilePic) uploadProfilePic();
  }, [profilePic]);

  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        {/* account detail */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Account Details</h3>
          <div className="space-y-8 rounded-md p-8 shadow-md">
            {/* profile picture */}
            <input
              ref={profilePicRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePic(file);
                }
              }}
            />
            <div className="flex items-center gap-x-8">
              <div
                onClick={() => {
                  profilePicRef.current?.click();
                }}
                className="relative mr-4 flex h-[150px] w-[150px] cursor-pointer items-center justify-center rounded-full bg-violet-400/20"
              >
                <Image
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : `/api/images/${userInfo?.image}`
                  }
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
                <p className="font-semibold">Profile Picture</p>
                <p className="text-sm italic">
                  Optimal Size of image size is 512x512px (&#60;2.5 MB)
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* name */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput
                  name="firstName"
                  value={userInfo?.firstName}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <SlimInput
                  name="lastName"
                  value={userInfo?.lastName}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </div>
              {/* email and phone number */}
              <div className="grid grid-cols-2 gap-x-8">
                <SlimInput
                  name="email"
                  value={userInfo?.email}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <SlimInput
                  name="phone"
                  type="number"
                  value={userInfo?.phone}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </div>
              {/* address */}
              <div className="grid grid-cols-1">
                <SlimInput
                  name="address"
                  value={userInfo?.address}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-x-8">
                <SlimInput
                  name="city"
                  value={userInfo?.city}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <SlimInput
                  name="state"
                  value={userInfo?.state}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <SlimInput
                  name="zip"
                  value={userInfo?.zip}
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="text-right">
                <button
                  onClick={async () => {
                    let result = await editMyAccountInfo(userInfo);
                    if (result?.success) {
                      successToast("Account details updated successfully");
                    }
                  }}
                  className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* new password */}
        <div className="#w-1/2">
          <>
            <h3 className="my-4 text-lg font-bold">New Password</h3>

            <div className="space-y-4 rounded-md p-8 shadow-md">
              <SlimInput
                name="currentPassword"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
              <SlimInput
                name="newPassword"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
              <SlimInput
                name="confirmNewPassword"
                type="password"
                value={confirmNewPw}
                onChange={(e) => setConfirmNewPw(e.target.value)}
              />
              <div className="mt-4 text-right">
                <button
                  onClick={async () => {
                    let res = await changePassword(
                      currentPw,
                      newPw,
                      confirmNewPw,
                    );
                    if (newPw !== confirmNewPw) {
                      errorToast("Passwords do not match");
                      return;
                    }
                    if (res?.success) {
                      setCurrentPw("");
                      setNewPw("");
                      setConfirmNewPw("");
                      successToast("Password changed successfully");
                    }
                  }}
                  className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white"
                >
                  Change Password
                </button>
              </div>
            </div>
          </>

          <>
            {/* employee leave request */}
            <div className="#w-1/2">
              <h3 className="my-4 text-lg font-bold">Leave Requests</h3>

              <div className="space-y-4 rounded-md p-8 shadow-md">
                <div className="">
                  <SlimInput
                    name="title"
                    value={leaveRequest.title}
                    onChange={(e) =>
                      setLeaveRequest({
                        ...leaveRequest,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8">
                  <SlimInput
                    name="startDate"
                    value={leaveRequest.startDate}
                    onChange={(e) =>
                      setLeaveRequest({
                        ...leaveRequest,
                        startDate: e.target.value,
                      })
                    }
                    type="date"
                  />
                  <SlimInput
                    name="endDate"
                    value={leaveRequest.endDate}
                    onChange={(e) =>
                      setLeaveRequest({
                        ...leaveRequest,
                        endDate: e.target.value,
                      })
                    }
                    type="date"
                  />
                </div>

                <SlimTextarea
                  name="description"
                  label="Description"
                  value={leaveRequest.description}
                  onChange={(e) =>
                    setLeaveRequest({
                      ...leaveRequest,
                      description: e.target.value,
                    })
                  }
                />
                <div className="mt-4 text-right">
                  <Link
                    href="/settings/my-account/leaveRequests"
                    className="ml-auto mt-4 rounded-md bg-white px-4 py-1 text-[#6571FF]"
                  >
                    View All Request
                  </Link>
                  <button
                    onClick={handleSubmitLeaveRequest}
                    className="ml-auto mt-4 rounded-md bg-[#6571FF] px-4 py-1 text-white"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default Page;
