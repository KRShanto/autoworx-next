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
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { Category, InventoryProductType } from "@prisma/client";
import { useState } from "react";
import { createProduct } from "./actions/create";
import SelectCategory from "@/components/Lists/SelectCategory";

export default function AddNewProduct() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>();

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
            <SelectCategory onCategoryChange={setCategory} />
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
