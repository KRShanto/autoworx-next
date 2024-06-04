"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Customer } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import NewCustomer from "./NewCustomer";
import { SelectProps } from "./select-props";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SelectClient({
  name = "customerId",
  value = null,
  setValue,
}: SelectProps<Customer | null>) {
  const state = useState(value);
  const [client, setClient] = setValue ? [value, setValue] : state;
  const clientList = useListsStore((x) => x.customers);
  const [clientsToDisplay, setClientsToDisplay] = useState<Customer[]>([]);
  const { newAddedCustomer } = useListsStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (newAddedCustomer) {
      setClient(newAddedCustomer);
      setOpenDropdown(false);
    }
  }, [newAddedCustomer]);

  useEffect(() => {
    if (client) {
      const params = new URLSearchParams(searchParams);
      params.set("clientId", client.id.toString());
      replace(`${pathname}?${params.toString()}`);

      useListsStore.setState({ customer: client });
    }
  }, [client]);

  useEffect(() => {
    if (search) {
      setClientsToDisplay(
        clientList.filter((client) =>
          `${client.firstName} ${client.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      );
    } else {
      setClientsToDisplay(clientList.slice(0, 4));
    }
  }, [search, clientList]);

  return (
    <>
      <input type="hidden" name={name} value={client?.id ?? ""} />
      <Selector
        newButton={<NewCustomer />}
        label={client ? `${client.firstName} ${client.lastName}` : "Client"}
        openState={[openDropdown, setOpenDropdown]}
        setSearch={setSearch}
      >
        <div>
          {clientsToDisplay.map((client) => (
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
