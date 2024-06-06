"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { Category, InventoryProductType } from "@prisma/client";
import { useEffect, useState } from "react";
import newCategory from "../estimate/create/actions/newCategory";
import { createProduct } from "./actions/create";

export default function AddNewProduct() {
  const { categories } = useListsStore();

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>();

  const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>(
    [],
  );
  const [categoryInput, setCategoryInput] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (categorySearch) {
      setCategoriesToDisplay(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
        ),
      );
    } else {
      setCategoriesToDisplay(categories.slice(0, 4));
    }
  }, [categorySearch, categories]);

  async function handleNewCategory() {
    const res = await newCategory({
      name: categoryInput,
    });

    if (res.type === "success") {
      useListsStore.setState((state) => {
        return { categories: [...state.categories, res.data] };
      });
      setCategory(res.data);
      setCategoryInput("");
      setCategoryOpen(false);
    }
  }

  async function handleSubmit(data: FormData) {
    const name = data.get("productName") as string;
    const description = data.get("description") as string;
    const price = Number(data.get("price"));
    const categoryId = category?.id;
    const vendorName = data.get("vendorName") as string;
    const quantity = Number(data.get("quantity"));
    const unit = data.get("unit") as string;
    const lot = data.get("lot") as string;
    const type =
      (data.get("type") as InventoryProductType) ||
      InventoryProductType.Product;

    const res = await createProduct({
      name,
      description,
      price,
      categoryId,
      vendorName,
      quantity,
      unit,
      lot,
      type,
    });

    if (res.type === "success") {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
          Add New Product
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="grid grid-cols-2 gap-5 overflow-y-auto">
          <div>
            <div>
              {/* TODO: create a reusable component */}
              <label className="text-semibold">Category</label>
              <Selector
                label={category ? category.name : ""}
                openState={[categoryOpen, setCategoryOpen]}
                setSearch={setCategorySearch}
                newButton={
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full rounded-md border-2 border-slate-400 p-1"
                    />
                    <button
                      onClick={handleNewCategory}
                      className={cn(
                        "text-nowrap rounded-md px-2 text-white",
                        categoryInput ? "bg-slate-700" : "bg-slate-400",
                      )}
                      type="button"
                      disabled={!categoryInput}
                    >
                      Quick Add
                    </button>
                  </div>
                }
              >
                <div>
                  {categoriesToDisplay.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat)}
                      className="mx-auto my-1 block w-[90%] rounded-md border-2 border-slate-400 p-1 text-center hover:bg-slate-200"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </Selector>
            </div>

            <SlimInput name="productName" />
            <SlimInput name="vendorName" required={false} />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              required={false}
              className="h-28 w-[95%] rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6"
            />
            <div>
              <div>
                <input
                  id="product"
                  type="radio"
                  name="type"
                  value={InventoryProductType.Product}
                  className="mr-1"
                />
                <label htmlFor="product">Products</label>
              </div>
              <div>
                <input
                  id="supply"
                  type="radio"
                  name="type"
                  value={InventoryProductType.Supply}
                  className="mr-1"
                />
                <label htmlFor="supply">Supplies</label>
              </div>
            </div>
          </div>
          <div className="col-span-3 mt-5 flex w-[90%] gap-5">
            <SlimInput name="quantity" type="number" required={false} />
            <SlimInput name="price" type="number" required={false} />
            <SlimInput name="unit" required={false} />
            <SlimInput name="lot" label="Lot#" required={false} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <Submit
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
            formAction={handleSubmit}
          >
            Add
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
