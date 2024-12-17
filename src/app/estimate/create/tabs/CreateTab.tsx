"use client";

import ItemSelector from "@/components/ItemSelector";
import { SelectTags } from "@/components/Lists/SelectTags";
import ResponsiveEstimateCreateTab from "@/components/mobile-responsive/estimate/ResponsiveEstimateCreateTab";
import { cn } from "@/lib/cn";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { create } from "mutative";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useMediaQuery } from "react-responsive";

export function CreateTab() {
  const { items, removeMaterial } = useEstimateCreateStore();
  const { open } = useEstimatePopupStore();

  const isMax640 = useMediaQuery({ query: "(max-width: 640px)" });

  const services = useListsStore((x) => x.services);
  const materials = useListsStore((x) => x.materials);
  const labors = useListsStore((x) => x.labors);

  // dropdown state
  const [dropdownsOpen, setDropdownsOpen] = useState({
    SERVICE: [-1, -1],
    MATERIAL: [-1, -1],
    LABOR: [-1, -1],
    TAG: [-1, -1],
  });

  return (
    <>
      <div className="-mx-8">
        {isMax640 ? (
          <ResponsiveEstimateCreateTab />
        ) : (
          <table className="w-full border-separate border-spacing-x-8 border-spacing-y-5">
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
                <tr key={`item-${i}`}>
                  {Object.keys(item).map((itemKey, j) => {
                    switch (itemKey) {
                      case "service":
                        return (
                          <td>
                            <ItemSelector
                              type="SERVICE"
                              label="Service"
                              item={item}
                              list={[...services].reverse()}
                              display="name"
                              onEdit={() =>
                                open("SERVICE", {
                                  itemId: item.id,
                                  edit: true,
                                  service: item.service,
                                })
                              }
                              onSelect={(service) =>
                                useEstimateCreateStore.setState((x) =>
                                  create(x, (x) => {
                                    x.items[i].service = service;
                                  }),
                                )
                              }
                              onSearch={(search) => {
                                if (search) {
                                  const filteredServices = services.filter(
                                    (service) =>
                                      service.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                  );

                                  return filteredServices;
                                } else {
                                  return services;
                                }
                              }}
                              onDelete={() =>
                                useEstimateCreateStore.setState((x) => {
                                  // set the service to null
                                  const items = x.items.map((item, index) => {
                                    if (index === i) {
                                      return { ...item, service: null };
                                    }
                                    return item;
                                  });
                                  return { items };
                                })
                              }
                              index={[i, j]}
                              dropdownsOpen={dropdownsOpen}
                              setDropdownsOpen={setDropdownsOpen}
                            />
                          </td>
                        );
                      case "materials":
                        return item.materials.length >= 0 ? (
                          <td className="relative">
                            {item.materials.length > 0 &&
                              item.materials.map((material, j) => (
                                <div
                                  className={cn("mt-2.5", j === 0 && "mt-0")}
                                  key={`material-${j}`}
                                >
                                  <ItemSelector
                                    key={`material-${j}`}
                                    type="MATERIAL"
                                    label="Materials/Parts"
                                    item={item}
                                    list={[...materials].reverse()}
                                    display="name"
                                    alwaysShowDeleteButton={
                                      item.materials.length > 1 && j > 0
                                    }
                                    materialIndex={j}
                                    onDelete={() => {
                                      console.log("calling delete material");
                                      removeMaterial({
                                        itemIndex: i,
                                        materialIndex: j,
                                      });
                                    }}
                                    onEdit={() =>
                                      open("MATERIAL", {
                                        itemId: item.id,
                                        edit: true,
                                        material,
                                        materialIndex: j,
                                      })
                                    }
                                    onSelect={(material) => {
                                      useEstimateCreateStore.setState((x) =>
                                        create(x, (x) => {
                                          x.items[i].materials[j] = {
                                            ...material,
                                            quantity: 0,
                                          };
                                        }),
                                      );

                                      open("MATERIAL", {
                                        itemId: item.id,
                                        edit: true,
                                        material,
                                        materialIndex: j,
                                      });
                                    }}
                                    onSearch={(search) => {
                                      if (search) {
                                        const filteredMaterials =
                                          materials.filter((material) =>
                                            material.name
                                              .toLowerCase()
                                              .includes(search.toLowerCase()),
                                          );
                                        return filteredMaterials;
                                      } else {
                                        return materials;
                                      }
                                    }}
                                    index={[i, j]}
                                    dropdownsOpen={dropdownsOpen}
                                    setDropdownsOpen={setDropdownsOpen}
                                  />

                                  {/* Check if this is the last material */}
                                  {/* Add new material button */}
                                  {j === item.materials.length - 1 ? (
                                    <button
                                      type="button"
                                      className="absolute flex items-center gap-1 text-sm text-[#6571FF]"
                                      onClick={() => {
                                        useEstimateCreateStore.setState((x) =>
                                          create(x, (x) => {
                                            x.items[i].materials.push(null);
                                          }),
                                        );
                                      }}
                                    >
                                      <HiOutlinePlusCircle size="1.2em" /> Add
                                      More
                                    </button>
                                  ) : null}
                                </div>
                              ))}

                            {item.materials.length == 0 && (
                              <div
                                className={cn("mt-2.5", j === 0 && "mt-0")}
                                key={`material-${j}`}
                              >
                                <ItemSelector
                                  key={`material-${j}`}
                                  type="MATERIAL"
                                  label="Materials/Parts"
                                  item={item}
                                  list={[...materials].reverse()}
                                  display="name"
                                  alwaysShowDeleteButton={
                                    item.materials.length > 1 && j > 0
                                  }
                                  materialIndex={j}
                                  onDelete={() => {
                                    console.log("calling delete material");
                                    removeMaterial({
                                      itemIndex: i,
                                      materialIndex: j,
                                    });
                                  }}
                                  // onEdit={() => {}}
                                  onSelect={(material) => {
                                    useEstimateCreateStore.setState((x) =>
                                      create(x, (x) => {
                                        x.items[i].materials[j] = {
                                          ...material,
                                          quantity: 0,
                                        };
                                      }),
                                    );

                                    open("MATERIAL", {
                                      itemId: item.id,
                                      edit: true,
                                      material,
                                      materialIndex: j,
                                    });
                                  }}
                                  onSearch={(search) => {
                                    if (search) {
                                      const filteredMaterials =
                                        materials.filter((material) =>
                                          material.name
                                            .toLowerCase()
                                            .includes(search.toLowerCase()),
                                        );
                                      return filteredMaterials;
                                    } else {
                                      return materials;
                                    }
                                  }}
                                  index={[i, j]}
                                  dropdownsOpen={dropdownsOpen}
                                  setDropdownsOpen={setDropdownsOpen}
                                />

                                {/* Check if this is the last material */}
                                {/* Add new material button */}
                                {j === item.materials.length - 1 ? (
                                  <button
                                    type="button"
                                    className="absolute flex items-center gap-1 text-sm text-[#6571FF]"
                                    onClick={() => {
                                      useEstimateCreateStore.setState((x) =>
                                        create(x, (x) => {
                                          x.items[i].materials.push(null);
                                        }),
                                      );
                                    }}
                                  >
                                    <HiOutlinePlusCircle size="1.2em" /> Add
                                    More
                                  </button>
                                ) : null}
                              </div>
                            )}
                          </td>
                        ) : (
                          <td></td>
                        );
                      case "labor":
                        return (
                          <td>
                            <ItemSelector
                              type="LABOR"
                              label="Labor"
                              item={item}
                              list={[...labors].reverse()}
                              display="name"
                              onEdit={() =>
                                open("LABOR", {
                                  itemId: item.id,
                                  edit: true,
                                  labor: item.labor,
                                })
                              }
                              onSelect={(labor) => {
                                useEstimateCreateStore.setState((x) =>
                                  create(x, (x) => {
                                    x.items[i].labor = labor;
                                  }),
                                );

                                open("LABOR", {
                                  itemId: item.id,
                                  edit: true,
                                  labor,
                                });
                              }}
                              onSearch={(search) => {
                                if (search) {
                                  const filteredLabors = labors.filter(
                                    (labor) =>
                                      labor.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                  );

                                  return filteredLabors;
                                } else {
                                  return labors;
                                }
                              }}
                              onDelete={() =>
                                useEstimateCreateStore.setState((x) => {
                                  // set the labor to null
                                  const items = x.items.map((item, index) => {
                                    if (index === i) {
                                      return { ...item, labor: null };
                                    }
                                    return item;
                                  });
                                  return { items };
                                })
                              }
                              index={[i, j]}
                              dropdownsOpen={dropdownsOpen}
                              setDropdownsOpen={setDropdownsOpen}
                            />
                          </td>
                        );
                      case "tags":
                        return (
                          <td>
                            <SelectTags
                              type="TAG"
                              value={item.tags}
                              setValue={(tags) => {
                                useEstimateCreateStore.setState((x) =>
                                  create(x, (x) => {
                                    x.items[i].tags =
                                      tags instanceof Function
                                        ? tags(item.tags)
                                        : tags;
                                  }),
                                );
                              }}
                              index={[i, j]}
                              dropdownsOpen={dropdownsOpen}
                              setDropdownsOpen={setDropdownsOpen}
                            />
                          </td>
                        );
                    }
                  })}
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
        )}
      </div>
      <div className="flex gap-52 bg-slate-50">
        <button
          type="button"
          className="flex items-center gap-2 p-2 text-[#6571FF]"
          onClick={() => {
            useEstimateCreateStore.setState((x) => ({
              items: [
                ...x.items,
                {
                  id: nanoid(),
                  service: null,
                  materials: [null],
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
