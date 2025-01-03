"use client";
import { deleteService } from "@/actions/estimate/service/deleteService";
import { updateService } from "@/actions/estimate/service/updateService";
import NewVehicle from "@/components/Lists/NewVehicle";
import SelectCategory from "@/components/Lists/SelectCategory";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Service, Vehicle } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
import NewService from "./NewService";
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
      <div className="max-h-[500px]">
        <Table className="h-full">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>Services Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="custom-scrollbar h-full">
            {services.map((service, index) => (
              <ServiceComponent key={index} service={service} />
            ))}
          </TableBody>
        </Table>
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
  const [category, setCategory] = useState<Category | null>(
    service?.category || null,
  );
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
    <TableRow className={cn("cursor-pointer rounded-md py-3")}>
      <TableCell>
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
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>
        {isEdit && (
          <button onClick={handleUpdateService} className="mr-4 text-green-500">
            <IoMdCheckmarkCircleOutline />
          </button>
        )}

        <button onClick={() => setIsEdit(!isEdit)} className="text-[#6571FF]">
          <RiEditFill />
        </button>
        <button
          className="ml-4 text-red-400"
          onClick={() => deleteService(service.id)}
        >
          <FaTimes />
        </button>
      </TableCell>
    </TableRow>
  );
};
