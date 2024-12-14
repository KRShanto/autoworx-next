"use client";
import { deleteLabor } from "@/actions/estimate/labor/deleteLabor";
import { updateLabor } from "@/actions/estimate/labor/updateLabor";
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
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useListsStore } from "@/stores/lists";
import { Category, Labor } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
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
          isCanned={true}
        />
      </div>
      <div className="">
        <Table className="h-full">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>Labor Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>$/Hour</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="custom-scrollbar h-full">
            {labors.map((labor) => (
              <LaborComponent key={labor.id} labor={labor} />
            ))}
          </TableBody>
        </Table>
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
  const [category, setCategory] = useState<Category | null>(
    labor?.category || null,
  );
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
  };

  return (
    <TableRow>
      <TableCell>
        {" "}
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
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>
        {" "}
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
      </TableCell>
      <TableCell>
        {" "}
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
      </TableCell>
    </TableRow>
  );
};
