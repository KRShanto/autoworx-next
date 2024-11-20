"use client";
import SelectCategory from "@/components/Lists/SelectCategory";
import { SelectTags } from "@/components/Lists/SelectTags";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { Category, Tag } from "@prisma/client";
import { useEffect, useState } from "react";

import { newLabor } from "@/actions/estimate/labor/newLabor";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import Submit from "@/components/Submit";
import Close from "./create/CloseEstimate";

export default function NewLabor({
  newButton,
  isCanned = false,
}: {
  newButton?: React.ReactNode;
  isCanned?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [hours, setHours] = useState<number>();
  const [charge, setCharge] = useState<number>();
  const [discount, setDiscount] = useState<number>();

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  const [tagsOpen, setTagsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);

  useEffect(() => {
    setTagsOpen(false);
  }, [categoryOpen]);

  useEffect(() => {
    setCategoryOpen(false);
  }, [tagsOpen]);

  useEffect(() => {
    if (data?.labor && data.edit) {
      setName(data.labor.name);
      setCategory(categories.find((cat) => cat.id === data.labor.categoryId)!);
      setTags(data.labor.tags);
      setNotes(data.labor.notes);
      setHours(data.labor.hours);
      setCharge(data.labor.charge);
      setDiscount(data.labor.discount);
    } else {
      setName("");
      setCategory(null);
      setTags([]);
      setNotes("");
      setHours(undefined);
      setCharge(undefined);
      setDiscount(undefined);
    }
  }, [data]);

  async function handleSubmit() {
    if (!name) {
      alert("Labor name is required");
      return;
    }

    const res = await newLabor({
      name,
      categoryId: category?.id,
      tags,
      notes,
      hours: hours || 1,
      charge: charge || 0,
      discount: discount || 0,
      cannedLabor: isCanned,
    });

    if (res.type === "success") {
      // Change the service where itemId is the same
      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              labor: res.data,
            };
          }
          return item;
        });
        return { items };
      });

      // Add to listsStore
      useListsStore.setState((state) => {
        return { labors: [...state.labors, res.data] };
      });

      close();
      setOpen(false);
    }
    setName("");
    setCategory(null);
    setTags([]);
    setNotes("");
    setHours(undefined);
    setCharge(undefined);
    setDiscount(undefined);
  }

  async function handleEdit() {
    if (!name) {
      alert("Labor name is required");
      return;
    }

    // Change the service where itemId is the same
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            labor: {
              ...item.labor,
              name,
              categoryId: category?.id,
              tags,
              notes,
              hours,
              charge,
              discount,
            },
          };
        }
        return item;
      });
      return { items };
    });
    close();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {newButton ? (
          newButton
        ) : (
          <button type="button" className="# px-4text-xs text-[#6571FF]">
            + New Vehicle
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-md grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add New Labor</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-8 p-5">
          {/* <h3 className="w-full text-xl font-semibold">
            {data?.edit ? "Edit Labor Information" : "Labor Information"}
          </h3> */}

          <div className="#items-center flex gap-2">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="Labor Name"
            />
          </div>

          <SelectCategory
            onCategoryChange={setCategory}
            labelPosition="none"
            categoryData={category}
            categoryOpen={categoryOpen}
            setCategoryOpen={setCategoryOpen}
          />

          <div className="#items-center flex gap-2">
            <div className="w-full">
              <SelectTags
                value={tags}
                setValue={setTags}
                openStates={[tagsOpen, setTagsOpen]}
              />
            </div>
          </div>

          <div className="#items-center flex gap-2">
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-30 #text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="Notes"
            />
          </div>

          <div className="#items-center flex gap-2">
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="No. of Hours"
            />
          </div>

          <div className="#items-center flex gap-2">
            <input
              type="number"
              id="perhour"
              value={charge}
              onChange={(e) => setCharge(parseFloat(e.target.value))}
              className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="$/hr"
            />
          </div>

          <div className="#items-center flex gap-2">
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              className="#text-xs w-full rounded-md border-2 border-slate-400 p-1 px-4"
              placeholder="Discount"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
            onClick={data?.edit ? handleEdit : handleSubmit}
            type="button"
          >
            Done
          </button>
          {/* <Submit
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
            formAction={() => {}}
          >
            Add
          </Submit> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
