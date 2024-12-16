import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import newService from "../../../actions/estimate/service/newService";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Close from "./CloseEstimate";
import SelectCategory from "@/components/Lists/SelectCategory";
import { create } from "mutative";
import { updateService } from "@/actions/estimate/service/updateService";

export default function ServiceCreate() {
  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const edit = data?.edit as boolean | undefined;
  const { categories } = useListsStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [description, setDescription] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (data?.service && data.edit) {
      setName(data.service.name);
      setCategory(categories.find((cat) => cat.id === data.service.categoryId));
      setDescription(data.service.description);
    } else {
      setName("");
      setCategory(undefined);
      setDescription("");
    }
  }, [data]);

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
      const i = useEstimateCreateStore
        .getState()
        .items.findIndex((item) => item.id === itemId);

      useEstimateCreateStore.setState((x) =>
        create(x, (x) => {
          x.items[i].service = res.data;
        }),
      );

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

    // Update the service
    const res = await updateService({
      id: data?.service.id,
      name,
      categoryId: category?.id,
      description,
    });

    // Change the service in the items
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            service: {
              ...item.service,
              name,
              categoryId: category?.id,
              description,
            },
          };
        }
        return item;
      });
      return { items };
    });

    close();
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

      <SelectCategory
        onCategoryChange={setCategory}
        labelPosition="none"
        categoryData={category}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
      />

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
