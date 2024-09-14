"use client";
import NewVehicle from "@/components/Lists/NewVehicle";
import SelectCategory from "@/components/Lists/SelectCategory";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Labor, Vehicle } from "@prisma/client";
import { setHours } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { updateLabor } from "@/actions/estimate/labor/updateLabor";
import { deleteLabor } from "@/actions/estimate/labor/deleteLabor";

export default function CannedLabor({
  labors,
}: {
  labors: (Labor & { category: Category })[];
}) {
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
              <LaborComponent key={labor.id} labor={labor} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const LaborComponent = ({
  labor,
}: {
  labor: Labor & { category?: Category };
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hours, setHours] = useState<number>(Number(labor.charge));
  const [name, setName] = useState<string>(labor.name);

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);

  const handleEdit = async () => {
    const res = await updateLabor({
      id: labor.id,
      name,
      charge: hours,
      categoryId: category?.id,
    });

    setIsEdit(false);
    console.log("Edit");
  };

  return (
    <tr className={cn("cursor-pointer rounded-md py-3")}>
      <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{labor.name}</span>
        ) : (
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="#text-xs max-w-[150px] rounded-md border-2 border-slate-400 p-1 px-4"
            placeholder="Labor Name"
          />
        )}
      </td>
      <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
        {!isEdit ? (
          <span className="px-4">{labor.category?.name}</span>
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
          <span className="px-4">{`$${labor.charge}`}</span>
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
        {isEdit && (
          <button onClick={() => handleEdit()} className="mr-4 text-green-500">
            <IoMdCheckmarkCircleOutline />
          </button>
        )}

        <button
          onClick={() => setIsEdit(!isEdit)}
          className="mr-4 text-[#6571FF]"
        >
          <RiEditFill />
        </button>
        <button className="text-red-400" onClick={() => deleteLabor(labor.id)}>
          <FaTimes />
        </button>
      </td>
    </tr>
  );
};
