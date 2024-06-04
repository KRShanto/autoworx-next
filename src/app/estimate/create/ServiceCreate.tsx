import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Category, Service } from "@prisma/client";
import { use, useEffect, useState } from "react";
import newCategory from "./actions/newCategory";
import newService from "./actions/newService";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Close from "./CloseEstimate";
import { updateService } from "./actions/updateService";

export default function ServiceCreate() {
  const { categories } = useListsStore();
  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const edit = data?.edit as boolean | undefined;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>(
    [],
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data.service && edit) {
      setName(data.service.name);
      setDescription(data.service.description);
      setCategory(categories.find((cat) => cat.id === data.service.categoryId));
    } else {
      setName("");
      setDescription("");
      setCategory(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (search) {
      setCategoriesToDisplay(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setCategoriesToDisplay(categories.slice(0, 4));
    }
  }, [search, categories]);

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

  async function handleEdit() {
    if (!name) {
      alert("Service name is required");
      return;
    }

    const res = await updateService({
      id: data.service.id,
      name,
      categoryId: category?.id,
      description,
    });

    if (res.type === "success") {
      // Change the service in the items
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

      // Update the service in the listsStore
      useListsStore.setState((state) => {
        const services = state.services.map((service) => {
          if (service.id === data.service.id) {
            return res.data;
          }
          return service;
        });
        return { services };
      });

      close();
    }
  }

  return (
    <div className="flex flex-col gap-5 p-10">
      <h3 className="w-full text-xl font-semibold">
        {edit ? "Update Service" : "Add New Service"}
      </h3>

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
          openState={[categoryOpen, setCategoryOpen]}
          setSearch={setSearch}
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

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-40 rounded-md border-2 border-slate-400 p-2"
      />

      <div className="flex justify-center gap-5">
        <Close />
        <button
          className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
          onClick={edit ? handleEdit : handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
