import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { useState } from "react";
import newService from "./actions/newService";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Close from "./CloseEstimate";
import { updateService } from "./actions/updateService";
import SelectCategory from "@/components/Lists/SelectCategory";

export default function ServiceCreate() {
  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const edit = data?.edit as boolean | undefined;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [description, setDescription] = useState("");

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

      <SelectCategory
        onCategoryChange={setCategory}
        showLabelAsValue
        labelPosition="none"
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
