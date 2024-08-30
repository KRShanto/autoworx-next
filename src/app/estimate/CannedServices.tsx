"use client";
import NewVehicle from "@/components/Lists/NewVehicle";
import SelectCategory from "@/components/Lists/SelectCategory";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Vehicle } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
import NewService from "./NewService";

const cannedServices = [
  {
    name: "Service 1",
    category: "Category 1",
    description: "Description 1",
  },
  {
    name: "Service 2",
    category: "Category 2",
    description: "Description 2",
  },
  {
    name: "Service 3",
    category: "Category 3",
    description: "Description 3",
  },
];

export default function CannedServices() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="h-full w-full space-y-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <h3 className="text-2xl font-bold">Canned Services</h3>
        </div>
        <NewService
          newButton={
            <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
              + Add Service
            </button>
          }
        />
      </div>
      {/* TODO: make it scrollable */}
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b">
              <th className="px-4 text-left 2xl:px-10">Service Name</th>
              <th className="px-4 text-left 2xl:px-10">Category</th>
              <th className="px-4 text-left 2xl:px-10">Description</th>
              <th className="px-4 text-left 2xl:px-10">Edit</th>
            </tr>
          </thead>

          <tbody className="border border-gray-200">
            {cannedServices.map((service, index) => (
              <Service key={index} service={service} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Service = ({ service }: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [categoryOpen, setCategoryOpen] = useState(false);
  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);
  return (
    <tr
      className={cn(
        "cursor-pointer rounded-md py-3",
        // index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
        // vehicleId &&
        //   vehicleId === vehicle?.id &&
        //   "border-2 border-[#6571FF]",
      )}
    >
      <td className="text-nowrap px-4 py-1 text-left align-top 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{service.name}</span>
        ) : (
          <input
            type="text"
            id="name"
            value={service.name}
            onChange={(e) => {}}
            className="#text-xs max-w-[150px] rounded-md border-2 border-slate-400 p-1 px-4"
          />
        )}
      </td>
      <td className="text-nowrap px-4 py-1 text-left align-top 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{service.category}</span>
        ) : (
          <SelectCategory
            onCategoryChange={setCategory}
            labelPosition="none"
            categoryData={category}
            categoryOpen={categoryOpen}
            setCategoryOpen={setCategoryOpen}
          />
        )}
      </td>
      <td className="px-4 py-1 text-left 2xl:px-10">
        {" "}
        {!isEdit ? (
          <span className="px-4">{service.description}</span>
        ) : (
          <div>
            <textarea
              placeholder="Description"
              value={service.description}
              onChange={(e) => {}}
              className="h-40 max-w-[150px] rounded-md border-2 border-slate-400 p-2"
            />
          </div>
        )}
      </td>
      <td className="flex items-center gap-x-4 px-4 py-1 text-left 2xl:px-10">
        <button onClick={() => setIsEdit(!isEdit)} className="text-[#6571FF]">
          <RiEditFill />
        </button>
        <button className="text-red-400">
          <FaTimes />
        </button>
      </td>
    </tr>
  );
};
