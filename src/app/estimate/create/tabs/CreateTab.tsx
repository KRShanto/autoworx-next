"use client";

import ItemSelector from "@/components/ItemSelector";
import { SelectTags } from "@/components/Lists/SelectTags";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { create } from "mutative";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";

export function CreateTab() {
  const { items, removeMaterial } = useEstimateCreateStore();
  const { open } = useEstimatePopupStore();

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
              <React.Fragment key={`item-${i}`}>
                {item.materials.map((material, j) => (
                  <tr key={`item-${i}-material-${j}`}>
                    <td>
                      {j > 0 ? null : (
                        <ItemSelector
                          type="SERVICE"
                          label="Service"
                          item={item}
                          list={services}
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
                            const filteredServices = services.filter(
                              (service) =>
                                service.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase()),
                            );

                            return filteredServices;
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
                      )}
                    </td>
                    <td className="relative">
                      <ItemSelector
                        type="MATERIAL"
                        label="Materials/Parts"
                        item={item}
                        list={materials}
                        display="name"
                        alwaysShowDeleteButton={
                          item.materials.length > 1 && j > 0
                        }
                        materialIndex={j}
                        onDelete={() =>
                          removeMaterial({ itemIndex: i, materialIndex: j })
                        }
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
                          const filteredMaterials = materials.filter(
                            (material) =>
                              material.name
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                          );
                          return filteredMaterials;
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
                          <HiOutlinePlusCircle size="1.2em" /> Add More
                        </button>
                      ) : null}
                    </td>
                    <td>
                      {j > 0 ? null : (
                        <ItemSelector
                          type="LABOR"
                          label="Labor"
                          item={item}
                          list={labors}
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
                            const filteredLabors = labors.filter((labor) =>
                              labor.name
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                            );

                            return filteredLabors;
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
                      )}
                    </td>
                    <td>
                      {j > 0 ? null : (
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
                      )}
                    </td>
                    <td>
                      {j > 0 ? null : (
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
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
