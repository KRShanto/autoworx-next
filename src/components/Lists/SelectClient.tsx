"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Customer } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import NewCustomer from "./NewCustomer";
import { SelectProps } from "./select-props";

export function SelectClient({
  name = "customerId",
  value = null,
  setValue,
}: SelectProps<Customer | null>) {
  const state = useState(value);
  const [client, setClient] = setValue ? [value, setValue] : state;
  const clientList = useListsStore((x) => x.customers);
  const { newAddedCustomer } = useListsStore();
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (newAddedCustomer) {
      setClient(newAddedCustomer);
      setOpenDropdown(false);
    }
  }, [newAddedCustomer]);

  return (
    <>
      <input type="hidden" name={name} value={client?.id ?? ""} />
      <Selector
        newButton={<NewCustomer />}
        label={client ? `${client.firstName} ${client.lastName}` : "Client"}
        openState={[openDropdown, setOpenDropdown]}
      >
        <div>
          {clientList.map((client) => (
            <button
              type="button"
              key={client.id}
              className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
              onClick={() => setClient(client)}
            >
              <Image
                src={client.photo!}
                alt="Client Image"
                width={30}
                height={30}
                className="rounded-full"
              />

              <div>
                <p className="text-start text-sm font-bold">
                  {client.firstName} {client.lastName}
                </p>
                <p className="text-xs">{client.email}</p>
              </div>
            </button>
          ))}
        </div>
      </Selector>
    </>
  );
}
