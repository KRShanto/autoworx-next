/* eslint-disable @next/next/no-img-element */
"use client";

import React, { SetStateAction, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiWechatLogoLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { EmployeeSelector } from "./EmployeeSelector";

import Link from "next/link";
import { Tag } from "@prisma/client";
import { EmployeeTagSelector } from "./EmployeeTagSelector";


const newLeads = [{ name: "Al Noman", email: "noman@me.com", phone: "123456" }];

const leadsGenerated = Array(5).fill({ name: "ali nur", email: "xyz@gmail.com", phone: "123456789" });
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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

export default function Pipelines() {
  const [selectedEmployees, setSelectedEmployees] = useState<{
    [key: string]: Employee | null;
  }>({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState<{
    category: number;
    index: number;
  } | null>(null);

  // const [tagOpenDropdown, setTagOpenDropdown] = useState(false);
  const [tag, setTag] = useState<Tag>();
  const [tagDropdownStates, setTagDropdownStates] = useState<{ [key: string]: boolean }>({});
  const [leadTags, setLeadTags] = useState<{ [key: string]: Tag[] }>({});

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

    const handleTagDropdownToggle = (categoryIndex: number, leadIndex: number) => {
      const key = `${categoryIndex}-${leadIndex}`;
      setTagDropdownStates((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
    };
    //for tag handling
    const handleTagSelect = (categoryIndex: number, leadIndex: number, selectedTag: Tag | undefined) => {
      if (selectedTag) {
        const key = `${categoryIndex}-${leadIndex}`;
        setLeadTags((prevState) => {
          const existingTags = prevState[key] || [];
          const tagExists = existingTags.find(tag => tag.id === selectedTag.id);
    
          if (tagExists) {
            return {
              ...prevState,
              [key]: existingTags.filter(tag => tag.id !== selectedTag.id),
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
              className="mt-5 flex flex-col gap-3 overflow-auto p-1"
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

                
                return (
                  <li
                    key={leadIndex}
                    className="relative mx-2 max-h-[150px] min-h-[150px] rounded-xl border bg-white p-2"
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
                        <div className="absolute top-8 right-0 z-10">
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
                    {tagsForLead.map((tag) => (
                      <span
                        key={tag.id}
                        className="mr-2 inline-flex items-center rounded bg-gray-300 px-1 py-1 text-xs font-semibold text-gray-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                      
                      <button
                      onClick={() => handleTagDropdownToggle(categoryIndex, leadIndex)}
                      className="inline-flex items-center rounded bg-blue-500 px-1 py-1 text-xs font-semibold text-white"
                    >
                      + Add
                    </button>
                  </div>
                  {isTagDropdownOpen && (
                    <div className="absolute top-8 right-0 z-20">
                      <EmployeeTagSelector
                        value={tag}
                        setValue={(selectedTag) => handleTagSelect(categoryIndex, leadIndex, selectedTag)}
                        open={isTagDropdownOpen}
                        setOpen={() => handleTagDropdownToggle(categoryIndex, leadIndex)}
                      />
                    </div>
                  )}

                    <div>
                      <p className="overflow-auto pb-2 text-sm">lead sources</p>
                      
                    </div>
                    <div>
                      <p className="overflow-auto pb-2 text-sm">services selections</p>
                      
                    </div>

                    <div className="flex justify-between">

                    <div className="flex items-center  gap-2">
                      <Link href="/">
                      <PiWechatLogoLight size={18}/>
                      </Link>
                      <Link href="/">
                      <img src="/icons/invoice.png" alt="" width={12} height={12}  style={{marginBottom: "0px"}}/>
                       </Link>
                       <Link href="/">
                      <CiCalendar size={18}/>
                      </Link>
                      
                    </div>
                    <button className="bg-whiet border-2 border-[#66738C] rounded-md  px-2  text-center text-gray-500 text-xs">
                        Add Task
                      </button>
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
