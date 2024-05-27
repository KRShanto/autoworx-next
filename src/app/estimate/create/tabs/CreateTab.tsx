"use client";

import Selector from "@/components/Selector";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { nanoid } from "nanoid";
import { HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";
import { create } from "mutative";
import { SelectTags } from "@/components/Lists/SelectTags";

export function CreateTab() {
  const items = useEstimateCreateStore((x) => x.items);
  const { setCurrentSelectedCategoryId } = useEstimateCreateStore();
  const { open } = useEstimatePopupStore();
  const services = useListsStore((x) => x.services);
  const materials = useListsStore((x) => x.materials);
  const labors = useListsStore((x) => x.labors);
  const tags = useListsStore((x) => x.tags);

  return (
    <>
      <div className="-mx-8">
        <table className="w-full border-separate border-spacing-x-8 border-spacing-y-4">
          <colgroup>
            <col className=" w-1/4" />
            <col className=" w-1/4" />
            <col className=" w-1/4" />
            <col className=" w-1/5" />
            <col />
          </colgroup>
          <thead>
            <tr>
              {["Services", "Materials/Parts", "Labor", "Tags"].map((x) => (
                <th key={x}>{x}</th>
              ))}
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>
                  <Selector
                    newButton={
                      <button
                        type="button"
                        onClick={() => open("SERVICE", { itemId: item.id })}
                      >
                        + Create new Service
                      </button>
                    }
                    label={item.service ? item.service.name : "Service"}
                  >
                    <div className="">
                      {services.map((service) => (
                        <button
                          type="button"
                          key={service.id}
                          className="mx-auto my-1 block w-[95%] cursor-pointer rounded-md border border-[#6571FF] p-1 text-left text-[#6571FF] hover:bg-gray-100"
                          onClick={() => {
                            useEstimateCreateStore.setState((x) =>
                              create(x, (x) => {
                                x.items[i].service = service;
                              }),
                            );
                            setCurrentSelectedCategoryId(service.categoryId!);
                          }}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  </Selector>
                </td>
                <td>
                  <Selector
                    newButton={
                      <button
                        type="button"
                        onClick={() => open("MATERIAL", { itemId: item.id })}
                      >
                        + New Material
                      </button>
                    }
                    label={
                      item.material ? item.material.name : "Materials/Parts"
                    }
                  >
                    <div>
                      {materials.map((material) => (
                        <button
                          type="button"
                          key={material.id}
                          className="mx-auto my-1 block w-[95%] cursor-pointer rounded-md border border-[#6571FF] p-1 text-left text-[#6571FF] hover:bg-gray-100"
                          onClick={() =>
                            useEstimateCreateStore.setState((x) =>
                              create(x, (x) => {
                                x.items[i].material = material;
                              }),
                            )
                          }
                        >
                          {material.name}
                        </button>
                      ))}
                    </div>
                  </Selector>
                </td>
                <td>
                  <Selector
                    newButton={
                      <button
                        type="button"
                        onClick={() => open("LABOR", { itemId: item.id })}
                      >
                        + New Labor
                      </button>
                    }
                    label={item.labor ? item.labor.name : "Labor"}
                  >
                    <div className="">
                      {labors.map((labor) => (
                        <button
                          type="button"
                          key={labor.id}
                          className="mx-auto my-1 block w-[95%] cursor-pointer rounded-md border border-[#6571FF] p-1 text-left text-[#6571FF] hover:bg-gray-100"
                          onClick={() =>
                            useEstimateCreateStore.setState((x) =>
                              create(x, (x) => {
                                x.items[i].labor = labor;
                              }),
                            )
                          }
                        >
                          {labor.name}
                        </button>
                      ))}
                    </div>
                  </Selector>
                </td>
                <td>
                  <SelectTags
                    value={item.tags}
                    setValue={(tags) => {
                      useEstimateCreateStore.setState((x) =>
                        create(x, (x) => {
                          x.items[i].tags =
                            tags instanceof Function ? tags(item.tags) : tags;
                        }),
                      );
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      useEstimateCreateStore.setState((x) => ({
                        items: items.toSpliced(i, 1),
                      }));
                    }}
                  >
                    <HiOutlineXCircle size="1.2em" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50">
        <button
          type="button"
          className="flex items-center gap-2  p-2 text-[#6571FF]"
          onClick={() => {
            useEstimateCreateStore.setState((x) => ({
              items: [
                ...x.items,
                {
                  id: nanoid(),
                  service: null,
                  material: null,
                  labor: null,
                  tags: [],
                },
              ],
            }));
          }}
        >
          <HiOutlinePlusCircle size="1.2em" />
          Add Service
        </button>
      </div>
    </>
  );
}
