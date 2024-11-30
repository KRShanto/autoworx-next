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
import NewVendor from "@/components/Lists/NewVendor";
import SelectCategory from "@/components/Lists/SelectCategory";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { Category, InventoryProductType, Vendor } from "@prisma/client";
import { useEffect, useState } from "react";
import { createProduct } from "../../actions/inventory/create";

export default function AddNewProduct() {
  const [open, setOpen] = useState(false);
  const { vendors } = useListsStore();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [category, setCategory] = useState<Category | null>();
  const [vendorOpen, setVendorOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const name = data.get("productName") as string;
    const description = data.get("description") as string;
    const price = Number(data.get("price"));
    const categoryId = category?.id;
    const quantity = Number(data.get("quantity"));
    const unit = data.get("unit") as string;
    const lot = data.get("lot") as string;
    const type =
      (data.get("type") as InventoryProductType) ||
      InventoryProductType.Product;
    const receipt = data.get("receipt") as string;
    const lowInventory = data.get("lowInventory") as string;

    const res = await createProduct({
      name,
      description,
      price,
      categoryId,
      vendorId: vendor?.id,
      quantity,
      unit,
      lot,
      type,
      receipt,
      lowInventoryAlert: lowInventory ? Number(lowInventory) : undefined,
    });

    if (res.type === "success") {
      setOpen(false);
    } else {
      showError({
        field: res.field ?? "all",
        message: res.message ?? "An error occurred",
      });
    }
  }

  useEffect(() => setVendorOpen(false), [categoryOpen]);
  useEffect(() => setCategoryOpen(false), [vendorOpen]);

  return (
    <>
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
              <SelectCategory
                onCategoryChange={setCategory}
                categoryOpen={categoryOpen}
                setCategoryOpen={setCategoryOpen}
              />
              <SlimInput name="productName" />
              <div>
                <label>Vendor</label>

                <Selector
                  label={(vendor: Vendor | null) =>
                    vendor ? vendor.name || `Vendor ${vendor.id}` : "Vendor"
                  }
                  newButton={
                    <NewVendor
                      bgShadow={false}
                      afterSubmit={(ven) => {
                        setVendor(ven);
                        setVendorOpen(false);
                      }}
                      button={
                        <button
                          type="button"
                          className="text-xs text-[#6571FF]"
                        >
                          + New Vendor
                        </button>
                      }
                    />
                  }
                  items={vendors}
                  displayList={(vendor: Vendor) => (
                    <p>{vendor?.companyName || vendor.name}</p>
                  )}
                  onSearch={(search: string) =>
                    vendors.filter(
                      (vendor) =>
                        vendor?.companyName
                          ?.toLowerCase()
                          ?.includes(search.toLowerCase()) ||
                        vendor.name
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                  }
                  openState={[vendorOpen, setVendorOpen]}
                  selectedItem={vendor}
                  setSelectedItem={setVendor}
                />
              </div>
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

              <div>
                <label htmlFor="price" className="px-2 font-medium">
                  Price
                </label>
                <div className="mt-1 flex gap-1 rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6">
                  <span className="text-lg">$</span>
                  <input
                    type="text"
                    name="price"
                    className="w-full outline-none"
                    id="price"
                  />
                </div>
              </div>

              <SlimInput name="unit" required={false} />
              <SlimInput name="lot" label="Lot#" required={false} />
            </div>
            <div>
              <SlimInput name="receipt" label="Receipt#" required={false} />
            </div>
            <div className="rounded-md bg-[#6571FF5E] p-2">
              <p className="font-semibold">Quantity for Low Inventory</p>
              <i className="text-xs">(Leave blank to disable notifications)</i>
              <SlimInput
                name="lowInventory"
                label={""}
                type="number"
                required={false}
              />
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
    </>
  );
}
