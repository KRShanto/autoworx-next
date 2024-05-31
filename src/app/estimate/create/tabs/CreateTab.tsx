"use client";

import Selector from "@/components/Selector";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { nanoid } from "nanoid";
import { HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";
import { create } from "mutative";
import { SelectTags } from "@/components/Lists/SelectTags";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { deleteService } from "../actions/deleteService";
import { deleteMaterial } from "../actions/deleteMaterial";
import { deleteLabor } from "../actions/deleteLabor";

export function CreateTab() {
  const items = useEstimateCreateStore((x) => x.items);
  const { setCurrentSelectedCategoryId } = useEstimateCreateStore();
  const { open, close, type } = useEstimatePopupStore();
  const services = useListsStore((x) => x.services);
  const materials = useListsStore((x) => x.materials);
  const labors = useListsStore((x) => x.labors);

  async function handleServiceDelete(id: number) {
    await deleteService(id);

    useEstimateCreateStore.setState((x) => {
      return create(x, (x) => {
        x.items = x.items.map((item) => {
          if (item.service?.id === id) {
            item.service = null;
          }
          return item;
        });
      });
    });

    useListsStore.setState((x) => {
      return create(x, (x) => {
        x.services = x.services.filter((service) => service.id !== id);
      });
    });

    if (type === "SERVICE") {
      close();
    }
  }

  async function handleMaterialDelete(id: number) {
    await deleteMaterial(id);

    useEstimateCreateStore.setState((x) => {
      return create(x, (x) => {
        x.items = x.items.map((item) => {
          if (item.material?.id === id) {
            item.material = null;
          }
          return item;
        });
      });
    });

    useListsStore.setState((x) => {
      return create(x, (x) => {
        x.materials = x.materials.filter((material) => material.id !== id);
      });
    });

    if (type === "MATERIAL") {
      close();
    }
  }

  async function handleLaborDelete(id: number) {
    await deleteLabor(id);

    useEstimateCreateStore.setState((x) => {
      return create(x, (x) => {
        x.items = x.items.map((item) => {
          if (item.labor?.id === id) {
            item.labor = null;
          }
          return item;
        });
      });
    });

    useListsStore.setState((x) => {
      return create(x, (x) => {
        x.labors = x.labors.filter((labor) => labor.id !== id);
      });
    });

    if (type === "LABOR") {
      close();
    }
  }

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
                        <div
                          className="mx-auto my-1 flex w-[95%] cursor-pointer items-center justify-between gap-1 rounded-md border border-[#6571FF] p-1 text-[#6571FF] hover:bg-gray-100"
                          key={service.id}
                        >
                          <button
                            type="button"
                            className="w-full text-left"
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
                          <div className="flex">
                            <button
                              onClick={() =>
                                open("SERVICE", {
                                  itemId: item.id,
                                  edit: true,
                                  service,
                                })
                              }
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleServiceDelete(service.id)}
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
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
                        <div
                          className="mx-auto my-1 flex w-[95%] cursor-pointer items-center justify-between gap-1 rounded-md border border-[#6571FF] p-1 text-[#6571FF] hover:bg-gray-100"
                          key={material.id}
                        >
                          <button
                            type="button"
                            className="w-full text-left"
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
                          <div className="flex">
                            <button
                              onClick={() =>
                                open("MATERIAL", {
                                  itemId: item.id,
                                  edit: true,
                                  material,
                                })
                              }
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleMaterialDelete(material.id)}
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
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
                        <div
                          className="mx-auto my-1 flex w-[95%] cursor-pointer items-center justify-between gap-1 rounded-md border border-[#6571FF] p-1 text-[#6571FF] hover:bg-gray-100"
                          key={labor.id}
                        >
                          <button
                            type="button"
                            className="w-full text-left"
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
                          <div className="flex">
                            <button
                              onClick={() =>
                                open("LABOR", {
                                  itemId: item.id,
                                  edit: true,
                                  labor,
                                })
                              }
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleLaborDelete(labor.id)}
                              className="rounded-full p-2 transition-colors hover:bg-gray-200"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
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
