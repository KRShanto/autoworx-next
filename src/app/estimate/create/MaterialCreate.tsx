import NewVendor from "@/components/Lists/NewVendor";
import SelectCategory from "@/components/Lists/SelectCategory";
import { SelectTags } from "@/components/Lists/SelectTags";
import Selector from "@/components/Selector";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { Category, Tag, Vendor } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { newMaterial } from "../../../actions/estimate/material/newMaterial";
import Close from "./CloseEstimate";
import { useActionStoreCreateEdit } from "@/stores/createEditStore";
import { errorToast } from "@/lib/toast";
import { errorHandler } from "@/error-boundary/globalErrorHandler";

export default function MaterialCreate() {
  const { categories } = useListsStore();
  const { vendors } = useListsStore();

  const { currentSelectedCategoryId } = useEstimateCreateStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [quantity, setQuantity] = useState<number>();
  const [cost, setCost] = useState<number>();
  const [sell, setSell] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [addToInventory, setAddToInventory] = useState<boolean>(false);

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const materialIndex = data?.materialIndex;

  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { actionType } = useActionStoreCreateEdit();

  useEffect(() => {
    if (data.material && data.edit) {
      setName(data.material.name);
      setCategory(
        data.material.categoryId
          ? categories.find((cat) => cat.id === data.material.categoryId)!
          : null,
      );
      setVendor(
        data.material.vendorId
          ? vendors.find((ven) => ven.id === data.material.vendorId)!
          : null,
      );
      setTags(data.material.tags || []);
      setNotes(data.material.notes || "");
      setQuantity(
        data.material.quantity === 0 ? undefined : data.material.quantity,
      );
      const costValue = parseFloat(data.material.cost);
      setCost(costValue === 0 ? undefined : costValue);
      const sellValue = parseFloat(data.material.sell || data.material.cost);
      setSell(sellValue === 0 ? undefined : sellValue);
      const discountValue = parseFloat(data.material.discount);
      setDiscount(discountValue === 0 ? undefined : discountValue);
      setAddToInventory(data.material.addToInventory || false);
    } else {
      setName("");
      setCategory(null);
      setVendor(null);
      setTags([]);
      setNotes("");
      setQuantity(undefined);
      setCost(undefined);
      setSell(undefined);
      setDiscount(undefined);
      setAddToInventory(false);
    }
  }, [data]);

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);

  async function handleSubmit() {
    // if (!name) {
    //   alert("Material name is required");
    //   return;
    // }

    try {
      const res = await newMaterial({
        name,
        categoryId: category?.id,
        vendorId: vendor?.id,
        tags,
        notes,
        quantity: quantity || 1,
        cost: cost || 0,
        sell: sell || 0,
        discount: discount || 0,
        addToInventory,
      });

      if (res.type === "success") {
        // Change the service where itemId is the same and materialIndex is the same
        useEstimateCreateStore.setState((state) => {
          const items = state.items.map((item) => {
            if (item.id === itemId) {
              const materials = item.materials.map((material, i) => {
                if (i === materialIndex) {
                  return {
                    id: res.data.id,
                    name,
                    categoryId: category?.id || null,
                    vendorId: vendor?.id || null,
                    tags,
                    notes,
                    quantity: quantity || 0,
                    cost: Number(cost || 0) as any,
                    sell: Number(sell || 0) as any,
                    discount: Number(discount || 0) as any,
                    addToInventory,
                    companyId: res.data.companyId,
                    createdAt: res.data.createdAt,
                    productId: res.data.productId,
                    invoiceId: res.data.invoiceId,
                    invoiceItemId: res.data.invoiceItemId,
                    updatedAt: res.data.updatedAt,
                  };
                }
                return material;
              });

              return {
                ...item,
                materials,
              };
            }
            return item;
          });
          return { items };
        });

        // Add to listsStore
        useListsStore.setState((state) => {
          return { materials: [...state.materials, res.data] };
        });

        close();
      } else if (res.type === "globalError") {
        errorToast(
          res.errorSource?.length ? res.errorSource[0].message : res.message,
        );
      }
    } catch (err) {
      const formattedError = errorHandler(err);
      errorToast(
        formattedError.errorSource?.length
          ? formattedError.errorSource[0].message
          : formattedError.message,
      );
    }
  }

  async function handleEdit() {
    if (!name) {
      alert("Material name is required");
      return;
    }

    // Update the material in the items
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          const materials = item.materials.map((material, i) => {
            if (i === materialIndex) {
              return {
                ...material,
                name,
                categoryId: category?.id,
                vendorId: vendor?.id,
                tags,
                notes,
                quantity: quantity || 0,
                cost: cost || 0,
                sell: sell || 0,
                discount: discount ?? 0,
                addToInventory,
              };
            }
            return material;
          });

          return {
            ...item,
            materials,
          };
        }
        return item;
      });
      return { items };
    });

    close();
  }

  useEffect(() => {
    if (categoryOpen && (vendorOpen || tagsOpen)) {
      setVendorOpen(false);
      setTagsOpen(false);
    } else if (vendorOpen && (categoryOpen || tagsOpen)) {
      setCategoryOpen(false);
      setTagsOpen(false);
    } else if (tagsOpen && (categoryOpen || vendorOpen)) {
      setCategoryOpen(false);
      setVendorOpen(false);
    }
  }, [categoryOpen, vendorOpen, tagsOpen]);

  // console.log("MaterialCreates", sell);
  // console.log("MaterialCreateDiscount", discount);
  // console.log("MaterialCreateQuantity", quantity);
  return (
    <div className="flex flex-col gap-2 p-10 md:p-5">
      <h3 className="w-full text-xl font-semibold">
        {/* Materials/Parts Information */}
        {data.edit ? "Edit Materials/Parts" : "Materials/Parts Information"}
      </h3>

      <div className="flex items-center gap-2">
        <label htmlFor="name" className="w-28 text-end text-sm">
          Material/
          <br /> Parts Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <SelectCategory
        onCategoryChange={setCategory}
        labelPosition="left"
        categoryData={category}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
      />

      <div className="flex items-center gap-2">
        <label className="w-28 text-end text-sm">Vendor</label>

        <Selector
          label={(vendor: Vendor | null) =>
            vendor ? vendor?.companyName || vendor?.name : "Vendor"
          }
          newButton={
            <NewVendor
              button={
                <button type="button" className="text-xs text-[#6571FF]">
                  + New Vendor
                </button>
              }
              afterSubmit={(vendor) => {
                useListsStore.setState(({ vendors }) => ({
                  vendors: [...vendors, vendor],
                }));

                useEstimateCreateStore.setState((state) => {
                  const items = state.items.map((item) => {
                    if (item.id === itemId) {
                      return {
                        ...item,
                        vendor,
                      };
                    }
                    return item;
                  });
                  return { items };
                });

                setVendor(vendor);
                setVendorOpen(false);
              }}
            />
          }
          items={vendors}
          onSearch={(search: string) =>
            vendors.filter(
              (vendor) =>
                vendor?.companyName
                  ?.toLowerCase()
                  ?.includes(search.toLowerCase()) ||
                vendor.name.toLowerCase().includes(search.toLowerCase()),
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

      {/* TODO: add to backend */}
      <div className="flex items-center gap-2">
        <label htmlFor="tags" className="w-28 text-end text-sm">
          Tags
        </label>
        <div className="w-full">
          <SelectTags
            value={tags}
            setValue={setTags}
            openStates={[tagsOpen, setTagsOpen]}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="notes" className="w-28 text-end text-sm">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="qt" className="w-28 text-end text-sm">
          Quantity
        </label>
        <input
          type="number"
          id="qt"
          value={actionType === "create" && data.edit === false ? 1 : quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="1"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="price" className="w-28 text-end text-sm">
          Cost Price
        </label>
        <input
          type="number"
          id="price"
          value={cost ?? ""}
          onChange={(e) =>
            setCost(e.target.value ? parseFloat(e.target.value) : undefined)
          }
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0"
          disabled={data.edit}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sell" className="w-28 text-end text-sm">
          Sell Price
        </label>
        <input
          type="number"
          id="sell"
          value={sell ?? ""}
          onChange={(e) =>
            setSell(e.target.value ? parseFloat(e.target.value) : undefined)
          }
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="discount" className="w-28 text-end text-sm">
          Discount
        </label>
        <input
          type="number"
          id="discount"
          value={discount ?? ""}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0"
        />
      </div>

      {!data.edit && (
        <label className="ml-5 flex items-center gap-2">
          <input
            type="checkbox"
            checked={addToInventory}
            onChange={(e) => setAddToInventory(e.target.checked)}
          />
          <span>Add to Inventory</span>
        </label>
      )}

      <div className="flex justify-center gap-5">
        <Close />
        <button
          className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
          onClick={data.edit ? handleEdit : handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
