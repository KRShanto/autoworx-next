"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Select from "./Select";
import { getWorkOrders } from "@/actions/pipelines/getWorkOrders";
import { useServerGet } from "@/hooks/useServerGet";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { usePipelineFilterStore } from "@/stores/PipelineFilterStore";
interface DropdownProps {
  pipelineType: string;
}
const DropdownMenuDemo = ({ pipelineType }: DropdownProps) => {
  const { data: invoices } = useServerGet(getWorkOrders);
  const [columnStatus, setColumnStatus] = useState<
    { id: number; title: string; type: string }[]
  >([]);
  const { setFilter, status } = usePipelineFilterStore();
  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType(pipelineType);
      setColumnStatus(columns);
    };
    fetchShopColumns();
  }, [pipelineType]);

  const uniqueServices = new Set<string>();
  invoices?.forEach((invoice) => {
    invoice.invoiceItems.forEach((item) => {
      if (item.service?.name) {
        uniqueServices.add(item.service.name);
      }
    });
  });

  // Convert the Set back to an array
  const serviceItems = Array.from(uniqueServices).map((serviceName, index) => ({
    id: `service-${index}`,
    value: serviceName,
    label: serviceName,
  }));

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-x-12 rounded-md border px-4 py-2"
          aria-label="Customise options"
        >
          <span>Filter</span>
          <FaChevronDown />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] py-8 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
          sideOffset={5}
        >
          <div className="flex flex-col gap-y-2">
            <Select
              label="Status"
              items={[
                { id: "all", value: "All", label: "All" },
                ...columnStatus.map((column) => ({
                  id: column.id,
                  value: column.title,
                  label: column.title,
                })),
              ]}
              onChange={(value) =>
                setFilter({ status: value === "All" ? "" : value })
              }
            />

            <Select
              label="Services"
              items={[
                { id: "all", value: "All", label: "All" },
                ...serviceItems,
              ]}
              onChange={(value) =>
                setFilter({ service: value === "All" ? "" : value })
              }
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
