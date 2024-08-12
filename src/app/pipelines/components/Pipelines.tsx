/* eslint-disable @next/next/no-img-element */
"use client";
import { User } from "@prisma/client";
import React, { SetStateAction, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiWechatLogoLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { EmployeeSelector } from "./EmployeeSelector";

import Link from "next/link";
import { Tag } from "@prisma/client";
import { EmployeeTagSelector } from "./EmployeeTagSelector";
import ServiceSelector from "./ServiceSelector";
import TaskForm from "./TaskForm";

const newLeads = [{ name: "Al Noman", email: "noman@me.com", phone: "123456" }];

const leadsGenerated = Array(5).fill({
  name: "ali nur",
  email: "xyz@gmail.com",
  phone: "123456789",
});
const followUp = Array(5).fill({ name: "", email: "", phone: "" });
const estimatesCreated = Array(5).fill({ name: "", email: "", phone: "" });
const archived = Array(5).fill({ name: "", email: "", phone: "" });
const converted = Array(5).fill({ name: "", email: "", phone: "" });

const data = [
  { title: "New Leads", leads: newLeads },
  { title: "Leads Generated", leads: leadsGenerated },
  { title: "Follow-up", leads: followUp },
  { title: "Estimates Created", leads: estimatesCreated },
  { title: "Archived", leads: archived },
  { title: "Converted", leads: converted },
];

//dummy services

const services = [
  {
    id: 1,
    name: "Service 1",
  },
  {
    id: 2,
    name: "Service 2",
  },
  {
    id: 3,
    name: "Service 3",
  },
  {
    id: 4,
    name: "Service 4",
  },
  {
    id: 5,
    name: "Service 5",
  },
];

//interfaces
interface Service {
  id: number;
  name: string;
}
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface Task {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  assignedTo: string;
  priority: string;
}
interface CompPropsType {
  users: User[];
}
export default function Pipelines({ users }: CompPropsType) {
  const [selectedEmployees, setSelectedEmployees] = useState<{
    [key: string]: Employee | null;
  }>({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState<{
    category: number;
    index: number;
  } | null>(null);

  // const [tagOpenDropdown, setTagOpenDropdown] = useState(false);
  const [tag, setTag] = useState<Tag>();
  const [tagDropdownStates, setTagDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [leadTags, setLeadTags] = useState<{ [key: string]: Tag[] }>({});

  // Track selected services per item
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: Service | null;
  }>({});
  const [showAllServices, setShowAllServices] = useState<{
    [key: string]: boolean;
  }>({});
  const [openServiceDropdown, setOpenServiceDropdown] = useState<{
    [key: string]: boolean;
  }>({});

  const handleDropdownToggle = (categoryIndex: number, leadIndex: number) => {
    if (
      openDropdownIndex?.category === categoryIndex &&
      openDropdownIndex.index === leadIndex
    ) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex({ category: categoryIndex, index: leadIndex });
    }
  };

  const getInitials = (employee: Employee | null) => {
    if (employee) {
      const firstNameInitial = employee.firstName.charAt(0).toUpperCase();
      const lastNameInitial = employee.lastName.charAt(0).toUpperCase();
      return `${firstNameInitial}${lastNameInitial}`;
    }
    return "";
  };

  const createEmployeeSelectHandler =
    (categoryIndex: number, leadIndex: number) =>
    (value: SetStateAction<Employee | null>) => {
      const key = `${categoryIndex}-${leadIndex}`;
      setSelectedEmployees((prevState) => ({
        ...prevState,
        [key]: typeof value === "function" ? value(prevState[key]) : value,
      }));
      setOpenDropdownIndex(null);
    };

  const handleTagDropdownToggle = (
    categoryIndex: number,
    leadIndex: number,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    setTagDropdownStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  //for tag handling
  const handleTagSelect = (
    categoryIndex: number,
    leadIndex: number,
    selectedTag: Tag | undefined,
  ) => {
    if (selectedTag) {
      const key = `${categoryIndex}-${leadIndex}`;
      setLeadTags((prevState) => {
        const existingTags = prevState[key] || [];
        const tagExists = existingTags.find((tag) => tag.id === selectedTag.id);
        //deleting each tag
        if (tagExists) {
          return {
            ...prevState,
            [key]: existingTags.filter((tag) => tag.id !== selectedTag.id),
          };
        } else {
          return {
            ...prevState,
            [key]: [...existingTags, selectedTag],
          };
        }
      });
    }
  };

  //service

  const handleServiceSelect = (
    categoryIndex: number,
    leadIndex: number,
    service: Service,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    setSelectedServices((prevState) => ({
      ...prevState,
      [key]: service,
    }));
    setShowAllServices((prevState) => ({
      ...prevState,
      [key]: false,
    }));
    setOpenServiceDropdown((prevState) => ({
      ...prevState,
      [key]: false, // Close dropdown after selection
    }));
  };

  const handleServiceDropdownToggle = (
    categoryIndex: number,
    leadIndex: number,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    setOpenServiceDropdown((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex justify-between">
        {data.map((item, categoryIndex) => (
          <div
            key={categoryIndex}
            className="w-[16%] rounded-md border"
            style={{
              backgroundColor: "rgba(101, 113, 255, 0.15)",
              padding: "0",
            }}
          >
            <h2 className="rounded-lg bg-[#6571FF] px-4 py-3 text-center text-white">
              <p className="text-base font-bold">{item.title}</p>
            </h2>

            <ul
              className="mt-3 flex flex-col gap-1 overflow-auto p-1"
              style={{ maxHeight: "70vh" }}
            >
              {item.leads.map((lead, leadIndex) => {
                const key = `${categoryIndex}-${leadIndex}`;
                const selectedEmployee = selectedEmployees[key];
                const isDropdownOpen =
                  openDropdownIndex?.category === categoryIndex &&
                  openDropdownIndex.index === leadIndex;

                const isTagDropdownOpen = tagDropdownStates[key];
                const tagsForLead = leadTags[key] || [];

                const selectedService = selectedServices[key];
                
                const isServiceDropdownOpen = openServiceDropdown[key] || false;

                return (
                  <li
                    key={leadIndex}
                    className="relative mx-1 my-1 rounded-xl border bg-white p-1"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-inter overflow-auto pb-2 font-semibold text-black">
                        {lead.name}
                      </h3>
                      {!isDropdownOpen && (
                        <button
                          onClick={() =>
                            handleDropdownToggle(categoryIndex, leadIndex)
                          }
                        >
                          {selectedEmployee ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-xs text-black">
                              {getInitials(selectedEmployee)}
                            </div>
                          ) : (
                            <IoAddCircleOutline size={26} />
                          )}
                        </button>
                      )}
                      {isDropdownOpen && (
                        <div className="absolute right-0 top-8 z-10">
                          <EmployeeSelector
                            name="employeeId"
                            value={selectedEmployee}
                            setValue={createEmployeeSelectHandler(
                              categoryIndex,
                              leadIndex,
                            )}
                            openDropdown={true}
                            setOpenDropdown={() => setOpenDropdownIndex(null)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-1 flex items-center">
                      {tagsForLead.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="mr-2 inline-flex h-[18px] items-center rounded bg-gray-300 px-1 py-1 text-xs font-semibold text-white"
                          style={{
                            backgroundColor: tag?.bgColor,
                            // color: tag?.textColor,
                          }}
                        >
                          {tag.name}
                          <button
                            className="ml-1 text-xs text-white"
                            onClick={() =>
                              handleTagSelect(categoryIndex, leadIndex, tag)
                            }
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                      {/* {tagsForLead.length > 3 && (
                        <span className="text-xs font-semibold text-gray-700">
                          +{tagsForLead.length - 3} more
                        </span>
                      )} */}

                      <button
                        onClick={() =>
                          handleTagDropdownToggle(categoryIndex, leadIndex)
                        }
                        className="inline-flex h-[20px] items-center justify-center rounded bg-[#6571FF] px-1 py-1 text-xs font-semibold text-white"
                      >
                        + Add
                      </button>
                    </div>
                    {isTagDropdownOpen && (
                      <div className="-left-100 absolute top-12 z-20">
                        <EmployeeTagSelector
                          value={tag}
                          setValue={(selectedTag) =>
                            handleTagSelect(
                              categoryIndex,
                              leadIndex,
                              selectedTag,
                            )
                          }
                          open={isTagDropdownOpen}
                          setOpen={() =>
                            handleTagDropdownToggle(categoryIndex, leadIndex)
                          }
                        />
                      </div>
                    )}
                    <div>
                      <p className="overflow-auto mb-2 text-xs">Vehicle Year Make Model</p>
                    </div>
                    {/* Service selection */}
                    <div className="relative mb-2">
                      {/* Display selected service or dropdown toggle */}
                      <div
                        onClick={() =>
                          handleServiceDropdownToggle(categoryIndex, leadIndex)
                        }
                        className="flex w-[60%] cursor-pointer justify-between rounded-md border border-[#6571FF] px-2 py-1 text-xs"
                        style={{
                          visibility: isServiceDropdownOpen
                            ? "hidden"
                            : "visible",
                        }}
                      >
                        {selectedService ? (
                          <span className="text-[#6571FF]">
                            {selectedService.name}
                          </span>
                        ) : (
                          <span className="inline-flex w-full justify-between text-[#6571FF]">
                            <span className="text-left">
                              {services.length > 1
                                ? `${services[0].name}...`
                                : "Select a service"}
                            </span>
                            {services.length > 1 && (
                              <span className="text-right">
                                + {services.length - 1}
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Dropdown menu */}
                      {isServiceDropdownOpen && (
                        <div className="-top-18 font-Inter z-10 rounded-md border border-[#6571FF] text-[#6571FF]">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              onClick={() => {
                                handleServiceSelect(
                                  categoryIndex,
                                  leadIndex,
                                  service,
                                );
                              }}
                              className={`cursor-pointer px-2 py-1 text-sm hover:bg-gray-200 ${selectedService?.id === service.id ? "bg-white" : ""}`}
                            >
                              {service.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="overflow-auto pb-2 text-xs">Lead Source</p>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Link href="/" className="group relative">
                          <PiWechatLogoLight size={18} />
                          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/4 transform rounded bg-[#66738C] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Communications
                          </span>
                        </Link>
                        <Link href="/" className="group relative">
                          <img
                            src="/icons/invoice.png"
                            alt=""
                            width={12}
                            height={12}
                            style={{ marginBottom: "0px" }}
                          />
                          <span className="-translate-x-1/5 absolute bottom-full left-1/2 mb-2 w-auto transform whitespace-nowrap rounded bg-[#66738C] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Create Draft Estimate
                          </span>
                        </Link>
                        <Link href="/" className="group relative">
                          <CiCalendar size={18} />
                          <span className="translate-x-1/6 absolute bottom-full left-1/2 mb-2 transform whitespace-nowrap rounded bg-[#66738C] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Create Appointment
                          </span>
                        </Link>
                      </div>

                      <TaskForm companyUsers={users} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
