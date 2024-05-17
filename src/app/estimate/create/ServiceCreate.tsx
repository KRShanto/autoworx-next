import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { use, useState } from "react";
import newCategory from "./actions/newCategory";
import newService from "./actions/newService";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useEstimateCreateStore } from "@/stores/estimate-create";

export default function ServiceCreate() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const categories = useListsStore((x) =>
    x.categories.filter((cat) => cat.type === "Service"),
  );
  const [categoryInput, setCategoryInput] = useState("");

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  async function handleNewCategory() {
    const res = await newCategory({
      name: categoryInput,
      type: "Service",
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

  return (
    <div className="flex flex-col gap-5 p-10">
      <h3 className="w-full text-xl font-semibold">Add New Service</h3>

      <input
        type="text"
        placeholder="Service Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-md border-2 border-slate-400 p-2"
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

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-40 rounded-md border-2 border-slate-400 p-2"
      />

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
