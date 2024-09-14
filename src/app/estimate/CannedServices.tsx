"use client";
import NewVehicle from "@/components/Lists/NewVehicle";
import SelectCategory from "@/components/Lists/SelectCategory";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Service, Vehicle } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
import NewService from "./NewService";
import { updateService } from "@/actions/estimate/service/updateService";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { deleteService } from "@/actions/estimate/service/deleteService";

export default function CannedServices({
  services,
}: {
  services: (Service & { category: Category })[];
}) {
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
            {services.map((service, index) => (
              <ServiceComponent key={index} service={service} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ServiceComponent = ({
  service,
}: {
  service: Service & { category?: Category };
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);

  async function handleUpdateService() {
    const res = await updateService({
      id: service.id,
      name: name,
      description: description || "",
      categoryId: category?.id,
    });

    setIsEdit(false);
  }

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);
  return (
    <tr className={cn("cursor-pointer rounded-md py-3")}>
      <td className="text-nowrap px-4 py-1 text-left align-top 2xl:px-10">
        {!isEdit ? (
          <span>{service.name}</span>
        ) : (
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="#text-xs max-w-[150px] rounded-md border-2 border-slate-400 p-1 px-4"
          />
        )}
      </td>
      <td className="text-nowrap px-4 py-1 text-left align-top 2xl:px-10">
        {!isEdit ? (
          <span>{service.category?.name}</span>
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
        {!isEdit ? (
          <span className="max-w-[2rem]">{service.description}</span>
        ) : (
          <div>
            <textarea
              placeholder="Description"
              value={description!}
              onChange={(e) => setDescription(e.target.value)}
              className="h-40 max-w-[150px] rounded-md border-2 border-slate-400 p-2"
            />
          </div>
        )}
      </td>
      <td className="flex items-center gap-x-4 px-4 py-1 text-left 2xl:px-10">
        {isEdit && (
          <button onClick={handleUpdateService} className="mr-4 text-green-500">
            <IoMdCheckmarkCircleOutline />
          </button>
        )}

        <button onClick={() => setIsEdit(!isEdit)} className="text-[#6571FF]">
          <RiEditFill />
        </button>
        <button
          className="text-red-400"
          onClick={() => deleteService(service.id)}
        >
          <FaTimes />
        </button>
      </td>
    </tr>
  );
};
