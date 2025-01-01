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
import { useListsStore } from "@/stores/lists";
import {
  Category,
  InventoryProduct,
  InventoryProductType,
  Vendor,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { editProduct } from "../../actions/inventory/edit";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { errorToast } from "@/lib/toast";
import { useFormErrorStore } from "@/stores/form-error";
import { UNITS } from "@/validations/schemas/inventory/inventoryProduct.validation";

type TProps = {
  productData: InventoryProduct & { category: Category; vendor: Vendor };
};

type TInputType = {
  productName: string | null;
  description: string | null;
  price: number | null;
  unit: string | null;
  lot: string | null;
  type: InventoryProductType;
  receipt: string | null;
  lowInventory: number | null;
};

export default function EditProduct({ productData }: TProps) {
  const [open, setOpen] = useState(false);
  const { vendors } = useListsStore(); // useful
  const [vendor, setVendor] = useState<Vendor | null>(productData.vendor);
  const [category, setCategory] = useState<Category | null>(
    productData.category,
  );

  const { showError, clearError } = useFormErrorStore();
  const [vendorOpen, setVendorOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [product, setProduct] = useState<TInputType>({
    productName: productData.name,
    description: productData.description,
    price: Number(productData.price) as number,
    unit: productData.unit,
    lot: productData.lot,
    type: productData.type,
    receipt: productData.receipt,
    lowInventory: productData.lowInventoryAlert,
  });

  useEffect(() => setVendorOpen(false), [categoryOpen]);
  useEffect(() => setCategoryOpen(false), [vendorOpen]);

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
    const unit = product.unit as string;
    const lot = product.lot as string;
    const type = product.type as InventoryProductType;
    const receipt = product.receipt as string;
    const lowInventory = Number(product.lowInventory) as number;

    try {
      const res = await editProduct({
        id: productData.id,
        name,
        description,
        price,
        categoryId,
        vendorId: vendor?.id,
        unit: unit as (typeof UNITS)[number],
        lot,
        type,
        receipt,
        lowInventoryAlert: lowInventory,
      });

      if (res.type === "success") {
        setOpen(false);
        clearError();
      } else if (res.type === "globalError") {
        showError({
          field: res.field ?? "all",
          message:
            res.errorSource && res.errorSource?.length > 0
              ? res.errorSource[0].message
              : res.message,
        });
      }
    } catch (err) {
      const formattedError = errorHandler(err);
      errorToast(
        formattedError.errorSource && formattedError.errorSource.length > 0
          ? formattedError.errorSource[0].message
          : formattedError.message,
      );
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <CiEdit />
        </DialogTrigger>
        <DialogContent
          className="max-h-[80%] w-[96%] max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>

          <FormError />

          <div className="grid-cols-2 gap-5 overflow-y-auto md:grid">
            <div>
              <SelectCategory
                categoryData={category}
                onCategoryChange={setCategory}
                categoryOpen={categoryOpen}
                setCategoryOpen={setCategoryOpen}
              />
              <SlimInput
                onChange={handleChange}
                value={product.productName as string}
                name="productName"
              />
              <div>
                <label>Vendor</label>

                <Selector
                  label={(vendor: Vendor | null) =>
                    vendor
                      ? vendor?.companyName ||
                        vendor.name ||
                        `Vendor ${vendor.id}`
                      : "Vendor"
                  }
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
                  items={vendors}
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
                  displayList={(vendor: Vendor) => (
                    <p>{vendor?.companyName || vendor.name}</p>
                  )}
                  openState={[vendorOpen, setVendorOpen]}
                  selectedItem={vendor}
                  setSelectedItem={setVendor}
                />
              </div>
            </div>
            <div>
              <label>Description</label>
              <textarea
                onChange={handleChange}
                name="description"
                required={false}
                className="h-28 w-[95%] rounded-sm border border-primary-foreground border-slate-400 bg-white px-2 py-0.5 leading-6"
                value={product.description as string}
              />

              <div>
                <div>
                  <input
                    id="product"
                    type="radio"
                    name="type"
                    value={InventoryProductType.Product}
                    onChange={handleChange}
                    className="mr-1"
                    checked={product.type === InventoryProductType.Product}
                  />
                  <label htmlFor="product">Products</label>
                </div>
                <div>
                  <input
                    id="supply"
                    type="radio"
                    name="type"
                    value={InventoryProductType.Supply}
                    onChange={handleChange}
                    className="mr-1"
                    checked={product.type === InventoryProductType.Supply}
                  />
                  <label htmlFor="supply">Supplies</label>
                </div>
              </div>
            </div>

            <div className="col-span-3 mt-5 flex w-[90%] flex-wrap gap-5 md:flex-nowrap">
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
            <div>
              <SlimInput
                onChange={handleChange}
                value={product.receipt as string}
                name="receipt"
                label="Receipt#"
                required={false}
              />
            </div>
            <div className="mt-5 rounded-md bg-[#6571FF5E] p-2 md:mt-0">
              <p className="font-semibold">Quantity for Low Inventory</p>
              <i className="text-xs">(Leave blank to disable notifications)</i>
              <SlimInput
                name="lowInventory"
                label={""}
                type="number"
                required={false}
                value={product.lowInventory as number}
                onChange={handleChange}
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
