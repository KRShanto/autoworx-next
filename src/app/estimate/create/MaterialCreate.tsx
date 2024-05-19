import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import React, { useState } from "react";
import newCategory from "./actions/newCategory";
import { Category, Vendor } from "@prisma/client";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Selector from "@/components/Selector";
import { newMaterial } from "./actions/newMaterial";
import NewVendor from "./NewVendor";
import Close from "./CloseEstimate";

export default function MaterialCreate() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tags, setTags] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [quantity, setQuantity] = useState<number>();
  const [cost, setCost] = useState<number>();
  const [sell, setSell] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [addToInventory, setAddToInventory] = useState<boolean>(false);

  const [categoryInput, setCategoryInput] = useState("");

  const categories = useListsStore((x) =>
    x.categories.filter((cat) => cat.type === "Material"),
  );
  const vendors = useListsStore((x) => x.vendors);

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  async function handleNewCategory() {
    const res = await newCategory({
      name: categoryInput,
      type: "Material",
    });

    if (res.type === "success") {
      useListsStore.setState((state) => {
        return { categories: [...state.categories, res.data] };
      });
      setCategory(res.data);
    }
  }

  async function handleSubmit() {
    if (!name) {
      alert("Material name is required");
      return;
    }

    const res = await newMaterial({
      name,
      categoryId: category?.id,
      vendorId: vendor?.id,
      tags,
      notes,
      quantity: quantity || 0,
      cost: cost || 0,
      sell: sell || 0,
      discount: discount || 0,
      addToInventory,
    });

    if (res.type === "success") {
      // Change the service where itemId is the same
      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              material: res.data,
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
    }
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      <h3 className="w-full text-xl font-semibold">
        Materials/Parts Information
      </h3>

      <input
        type="text"
        placeholder="Material/Parts Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <div className="w-full">
        <Selector
          label={category ? category.name : "Category"}
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
                className="text-nowrap rounded-md bg-slate-700 px-2 text-white"
                type="button"
              >
                Quick Add
              </button>
            </div>
          }
        >
          <div>
            {categories.map((cat) => (
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

      <div className="w-full">
        <Selector
          label={vendor ? vendor.firstName || "Vendor" : "Vendor"}
          newButton={<NewVendor itemId={itemId} />}
        >
          <div>
            {vendors.map((ven) => (
              <button
                type="button"
                key={ven.id}
                onClick={() => setVendor(ven)}
                className="mx-auto my-1 block w-[90%] rounded-md border-2 border-slate-400 p-1 text-center hover:bg-slate-200"
              >
                {ven.firstName} {ven.lastName}
              </button>
            ))}
          </div>
        </Selector>
      </div>

      <input
        type="text"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(+e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="Cost"
        value={cost}
        onChange={(e) => setCost(+e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="Sell"
        value={sell}
        onChange={(e) => setSell(+e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) => setDiscount(+e.target.value)}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={addToInventory}
          onChange={(e) => setAddToInventory(e.target.checked)}
        />
        <span>Add to Inventory</span>
      </label>

      <div className="flex justify-center gap-5">
        <Close />
        <button
          className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
          onClick={handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
