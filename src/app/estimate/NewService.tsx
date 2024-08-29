"use client";
import SelectCategory from "@/components/Lists/SelectCategory";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

import newService from "@/actions/estimate/service/newService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";

export default function NewService({
  newButton,
}: {
  newButton?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const edit = data?.edit as boolean | undefined;
  const { categories } = useListsStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [description, setDescription] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (data?.service && data.edit) {
      setName(data.service.name);
      setCategory(categories.find((cat) => cat.id === data.service.categoryId));
      setDescription(data.service.description);
    } else {
      setName("");
      setCategory(undefined);
      setDescription("");
    }
  }, [data]);

  async function handleSubmit() {
    if (!name) {
      alert("Service name is required");
      return;
    }

    const res = await newService({
      name,
      categoryId: category?.id,
      description,
    });

    if (res.type === "success") {
      // Change the service where itemId is the same
      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              service: res.data,
            };
          }
          return item;
        });
        return { items };
      });

      // Add to listsStore
      useListsStore.setState((state) => {
        return { services: [...state.services, res.data] };
      });

      close();
    }
  }

  async function handleEdit() {
    if (!name) {
      alert("Service name is required");
      return;
    }

    // Change the service in the items
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            service: {
              ...item.service,
              name,
              categoryId: category?.id,
              description,
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
            + New Service
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-md grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 p-10">
          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border-2 border-slate-400 p-2"
          />

          <SelectCategory
            onCategoryChange={setCategory}
            labelPosition="none"
            categoryData={category}
            categoryOpen={categoryOpen}
            setCategoryOpen={setCategoryOpen}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-40 rounded-md border-2 border-slate-400 p-2"
          />
        </div>
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
            onClick={edit ? handleEdit : handleSubmit}
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
