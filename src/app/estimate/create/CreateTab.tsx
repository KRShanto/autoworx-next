"use client";

import Selector from "@/components/Selector";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { HiOutlinePlusCircle, HiOutlineXCircle } from "react-icons/hi2";

export function CreateTab() {
  const items = useEstimateCreateStore((x) => x.items);
  return (
    <>
      <table className="w-full border-separate border-spacing-x-8 border-spacing-y-4">
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
                  newButton={<div>+ Create new Service</div>}
                  label={item.service ? item.service : "Service"}
                >
                  <div className=""></div>
                </Selector>
              </td>
              <td>
                <Selector
                  newButton={<div>+ Create new Service</div>}
                  label={item.service ? item.service : "Materials/Parts"}
                >
                  <div className=""></div>
                </Selector>
              </td>
              <td>
                <Selector
                  newButton={<div>+ Create new Service</div>}
                  label={item.service ? item.service : "Labor"}
                >
                  <div className=""></div>
                </Selector>
              </td>
              <td>
                <Selector
                  newButton={<div>+ Create new Service</div>}
                  label={item.service ? item.service : "Tags"}
                >
                  <div className=""></div>
                </Selector>
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
      <div className="bg-slate-50">
        <button
          type="button"
          className="flex items-center gap-2  p-2 text-[#6571FF]"
          onClick={() => {
            useEstimateCreateStore.setState((x) => ({
              items: [
                ...x.items,
                { service: "", material: "", labor: "", tags: [] },
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
