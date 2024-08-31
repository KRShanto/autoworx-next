"use client";
import NewVehicle from "@/components/Lists/NewVehicle";
import SelectCategory from "@/components/Lists/SelectCategory";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Vehicle } from "@prisma/client";
import { setHours } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";

const labors = [
  {
    id: 1,
    name: "John Doe",
    category: "Category 1",
    $perHour: 4567,
  },
  {
    id: 2,
    name: "John Doe",
    category: "Category 1",
    $perHour: 4567,
  },
  {
    id: 3,
    name: "John Doe",
    category: "Category 1",
    $perHour: 4567,
  },
];

export default function CannedLabor() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="h-full w-full space-y-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <h3 className="text-2xl font-bold">Canned Labor</h3>
        </div>
        <NewLabor
          newButton={
            <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
              + Add Labor
            </button>
          }
        />
      </div>
      {/* TODO: make it scrollable */}
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b">
              <th className="px-4 text-left 2xl:px-10">Labor Name</th>
              <th className="px-4 text-left 2xl:px-10">Category</th>
              <th className="px-4 text-left 2xl:px-10">$/Hour</th>
              <th className="px-4 text-left 2xl:px-10">Edit</th>
            </tr>
          </thead>

          <tbody className="border border-gray-200">
            {labors.map((labor) => (
              <Labor key={labor.id} labor={labor} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Labor = ({ labor }: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hours, setHours] = useState<number>();

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);
  // if (!isEdit) {
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
      <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{labor.name}</span>
        ) : (
          <input
            type="text"
            id="name"
            value={labor.name}
            onChange={(e) => {}}
            className="#text-xs max-w-[150px] rounded-md border-2 border-slate-400 p-1 px-4"
            placeholder="Labor Name"
          />
        )}
      </td>
      <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{labor.category}</span>
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
      <td className="px-4 py-1 text-left align-middle 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{`$${labor.$perHour}`}</span>
        ) : (
          <div>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="#text-xs max-w-[150px] rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="No. of Hours"
            />
          </div>
        )}
      </td>
      <td className="px-4 py-1 text-left 2xl:px-10">
        <button
          onClick={() => setIsEdit(!isEdit)}
          className="mr-4 text-[#6571FF]"
        >
          <RiEditFill />
        </button>
        <button className="text-red-400">
          <FaTimes />
        </button>
      </td>
    </tr>
  );
  // }

  // else {
  //   return (
  //     <tr
  //       className={cn(
  //         "cursor-pointer",
  //         // index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
  //         // vehicleId &&
  //         //   vehicleId === vehicle?.id &&
  //         //   "border-2 border-[#6571FF]",
  //       )}
  //     >
  //       <td className="mx-10 text-nowrap text-left">
  //         <input
  //           type="text"
  //           id="name"
  //           value={labor.name}
  //           onChange={(e) => {}}
  //           className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
  //           placeholder="Labor Name"
  //         />
  //       </td>
  //       <td className="mx-10 text-nowrap text-left">
  //         <SelectCategory
  //           onCategoryChange={setCategory}
  //           labelPosition="none"
  //           categoryData={category}
  //           categoryOpen={categoryOpen}
  //           setCategoryOpen={setCategoryOpen}
  //         />
  //       </td>
  //       <td className="mx-10 text-left">
  //         {" "}
  //         <input
  //           type="number"
  //           id="hours"
  //           value={hours}
  //           onChange={(e) => setHours(parseInt(e.target.value))}
  //           className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
  //           placeholder="No. of Hours"
  //         />
  //       </td>
  //       <td className="flex items-center gap-x-4 text-left align-middle">
  //         <button onClick={() => setIsEdit(!isEdit)} className="text-[#6571FF]">
  //           <RiEditFill />
  //         </button>
  //         <button className="text-red-400">
  //           <FaTimes />
  //         </button>
  //       </td>
  //     </tr>
  //   );
  // }
};
