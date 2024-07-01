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
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { Category, InventoryProduct, Vendor } from "@prisma/client";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { editProduct } from "./actions/edit";

type TProps = {
  productData: InventoryProduct & { category: Category; vendor: Vendor };
};

type TInputType = {
  productName: string | null;
  description: string | null;
  price: number | null;
  quantity: number | null;
  unit: string | null;
  lot: string | null;
};

export default function EditProduct({ productData }: TProps) {
  const [open, setOpen] = useState(false);
  const { vendors } = useListsStore(); // useful
  const [vendor, setVendor] = useState<Vendor | null>(productData.vendor);
  const [category, setCategory] = useState<Category | null>(
    productData.category,
  );
  const [vendorOpen, setVendorOpen] = useState(false); // useful
  const [vendorSearch, setVendorSearch] = useState(""); // useful
  const [vendorsToDisplay, setVendorsToDisplay] = useState<Vendor[]>([]); // useful
  const [error, setError] = useState<string | null>("");
  const [product, setProduct] = useState<TInputType>({
    productName: productData.name,
    description: productData.description,
    price: Number(productData.price) as number,
    quantity: productData.quantity,
    unit: productData.unit,
    lot: productData.lot,
  });
  useEffect(() => {
    if (vendorSearch) {
      setVendorsToDisplay(
        vendors.filter((ven) =>
          ven.name.toLowerCase().includes(vendorSearch.toLowerCase()),
        ),
      );
    } else {
      const alreadySelectedVendor = vendors.find(
        (ven) => ven.id === vendor?.id,
      ) as Vendor;
      let defaultVendors = vendors.slice(0, 4);
      if (
        !defaultVendors.find(
          (vendor) => vendor.id === alreadySelectedVendor?.id,
        ) &&
        alreadySelectedVendor
      ) {
        defaultVendors = [alreadySelectedVendor, ...defaultVendors];
      }
      setVendorsToDisplay(defaultVendors);
    }
  }, [vendorSearch, vendors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setProduct({ ...product, [name]: value });
  };

  async function handleSubmit() {
    const name = product.productName as string;
    const description = product.description as string;
    const price = Number(product.price) as number;
    const categoryId = category?.id as number;
    const quantity = Number(product.quantity) as number;
    const unit = product.unit as string;
    const lot = product.lot as string;
    try {
      if (!(price > 0 && quantity > 0)) {
        throw new Error("Price and quantity must be greater than 0");
      }
      const res = await editProduct({
        id: productData.id,
        name,
        description,
        price,
        categoryId,
        vendorId: vendor?.id,
        quantity,
        unit,
        lot,
      });

      if (res.type === "success") {
        setOpen(false);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message as string);
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <CiEdit />
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <DialogHeader>
            {error && (
              <p className="bg-red-500 py-2 text-center text-sm text-white">
                {error}
              </p>
            )}
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>

          <FormError />

          <div className="grid grid-cols-2 gap-5 overflow-y-auto">
            <div>
              <SelectCategory
                categoryData={category}
                onCategoryChange={setCategory}
              />
              <SlimInput
                onChange={handleChange}
                value={product.productName as string}
                name="productName"
              />
              <div>
                <label>Vendor</label>
                <Selector
                  label={vendor ? vendor.name || "Vendor" : ""}
                  openState={[vendorOpen, setVendorOpen]}
                  setSearch={setVendorSearch}
                  newButton={
                    <NewVendor
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
                >
                  <div>
                    {vendorsToDisplay.map((ven) => (
                      <button
                        type="button"
                        key={ven?.id}
                        onClick={() => setVendor(ven)}
                        className={cn(
                          "mx-auto my-1 block w-[90%] rounded-md border-2 border-slate-400 p-1 text-center hover:bg-slate-200",
                          {
                            "bg-slate-300": vendor && vendor?.id === ven?.id,
                          },
                        )}
                      >
                        {ven?.name}
                      </button>
                    ))}
                  </div>
                </Selector>
              </div>
            </div>
            <div>
              <label>Description</label>
              <textarea
                onChange={handleChange}
                name="description"
                required={false}
                className="h-28 w-[95%] rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6"
                value={product.description as string}
              />
            </div>
            <div className="col-span-3 mt-5 flex w-[90%] gap-5">
              <SlimInput
                onChange={handleChange}
                value={product.quantity as number}
                name="quantity"
                type="number"
                required={false}
              />
              <SlimInput
                onChange={handleChange}
                value={product.price as number}
                name="price"
                type="number"
                required={false}
              />
              <SlimInput
                onChange={handleChange}
                value={product.unit as string}
                name="unit"
                required={false}
              />
              <SlimInput
                onChange={handleChange}
                value={product.lot as string}
                name="lot"
                label="Lot#"
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
              Edit
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
