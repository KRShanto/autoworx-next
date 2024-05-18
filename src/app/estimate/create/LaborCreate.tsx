import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { use, useState } from "react";
import newCategory from "./actions/newCategory";
import newService from "./actions/newService";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { newLabor } from "./actions/newLabor";

export default function LaborCreate() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [hours, setHours] = useState<number>();
  const [charge, setCharge] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [addToCannedLabor, setAddToCannedLabor] = useState<boolean>(false);

  const categories = useListsStore((x) =>
    x.categories.filter((cat) => cat.type === "Labor"),
  );
  const [categoryInput, setCategoryInput] = useState("");

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  async function handleNewCategory() {
    const res = await newCategory({
      name: categoryInput,
      type: "Labor",
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
      addToCannedLabor,
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
    }
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      <h3 className="w-full text-xl font-semibold">Labor Information</h3>

      <input
        type="text"
        placeholder="Labor Name"
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
        className="h-30 rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="No. of Hours"
        value={hours}
        onChange={(e) => setHours(parseInt(e.target.value))}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="$/hr"
        value={charge}
        onChange={(e) => setCharge(parseFloat(e.target.value))}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <input
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) => setDiscount(parseFloat(e.target.value))}
        className="rounded-md border-2 border-slate-400 p-1 text-xs"
      />

      <div className="flex items-center gap-5">
        <input
          id="check"
          type="checkbox"
          checked={addToCannedLabor}
          onChange={(e) => setAddToCannedLabor(e.target.checked)}
        />
        <label htmlFor="check">Add to Canned Labor</label>
      </div>

      <button
        className="mx-auto w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
        onClick={handleSubmit}
        type="button"
      >
        Done
      </button>
    </div>
  );
}
