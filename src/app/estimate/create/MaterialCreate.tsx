import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import React, { useEffect, useState } from "react";
import newCategory from "./actions/newCategory";
import { Category, Tag, Vendor } from "@prisma/client";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Selector from "@/components/Selector";
import { newMaterial } from "./actions/newMaterial";
import NewVendor from "./NewVendor";
import Close from "./CloseEstimate";
import { updateMeterial } from "./actions/updateMeterial";
import { SelectTags } from "@/components/Lists/SelectTags";
import { cn } from "@/lib/cn";

export default function MaterialCreate() {
  const { categories } = useListsStore();
  const { vendors } = useListsStore();

  const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>(
    [],
  );
  const [vendorsToDisplay, setVendorsToDisplay] = useState<Vendor[]>([]);

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

  const [categoryInput, setCategoryInput] = useState("");

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");

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
      setQuantity(data.material.quantity || 0);
      setCost(data.material.cost || 0);
      setSell(data.material.sell || 0);
      setDiscount(data.material.discount || 0);
      setAddToInventory(data.material.addToInventory || false);
    } else {
      setName("");
      setCategory(null);
      setVendor(null);
      setTags([]);
      setNotes("");
      setQuantity(0);
      setCost(0);
      setSell(0);
      setDiscount(0);
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

  useEffect(() => {
    if (vendorSearch) {
      setVendorsToDisplay(
        vendors.filter((ven) =>
          `${ven.firstName} ${ven.lastName}`
            .toLowerCase()
            .includes(vendorSearch.toLowerCase()),
        ),
      );
    } else {
      setVendorsToDisplay(vendors.slice(0, 4));
    }
  }, [vendorSearch, vendors]);

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

  async function handleEdit() {
    if (!name) {
      alert("Material name is required");
      return;
    }

    const res = await updateMeterial({
      id: data.material.id,
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
      // Update the material in the items
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

      // Update the material in the listsStore
      useListsStore.setState((state) => {
        const materials = state.materials.map((material) => {
          if (material.id === res.data.id) {
            return res.data;
          }
          return material;
        });
        return { materials };
      });

      close();
    }
  }

  return (
    <div className="flex flex-col gap-2 p-5">
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
          // placeholder="Material/Parts Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="w-28 text-end text-sm">Category</label>
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

      <div className="flex items-center gap-2">
        <label className="w-28 text-end text-sm">Vendor</label>
        <Selector
          label={vendor ? vendor.firstName || "Vendor" : ""}
          openState={[vendorOpen, setVendorOpen]}
          setSearch={setVendorSearch}
          newButton={
            <NewVendor
              itemId={itemId}
              setVendorOpenState={setVendorOpen}
              setVendor={setVendor}
            />
          }
        >
          <div>
            {vendorsToDisplay.map((ven) => (
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

      {/* TODO: add to backend */}
      <div className="flex items-center gap-2">
        <label htmlFor="tags" className="w-28 text-end text-sm">
          Tags
        </label>
        <div className="w-full">
          <SelectTags value={tags} setValue={setTags} />
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
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="price" className="w-28 text-end text-sm">
          Cost Price
        </label>
        <input
          type="number"
          id="price"
          value={cost}
          onChange={(e) => setCost(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sell" className="w-28 text-end text-sm">
          Sell Price
        </label>
        <input
          type="number"
          id="sell"
          value={sell}
          onChange={(e) => setSell(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="discount" className="w-28 text-end text-sm">
          Discount
        </label>
        <input
          type="number"
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <label className="ml-5 flex items-center gap-2">
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
          onClick={data.edit ? handleEdit : handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
