"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Client } from "@prisma/client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import NewCustomer from "./NewCustomer";
import { SelectProps } from "./select-props";
import Avatar from "../Avatar";

export function SelectClient({
  name = "clientId",
  value = null,
  setValue,
  openDropdown,
  setOpenDropdown,
}: SelectProps<Client | null>) {
  const state = useState(value);
  const [client, setClient] = setValue ? [value, setValue] : state;
  const clientList = useListsStore((x) => x.customers);
  const { newAddedCustomer } = useListsStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (newAddedCustomer && setOpenDropdown) {
      setClient(newAddedCustomer);
      setOpenDropdown(false);
    }
  }, [newAddedCustomer]);

  useEffect(() => {
    if (client) {
      const params = new URLSearchParams(searchParams);
      params.set("clientId", client.id.toString());
      replace(`${pathname}?${params.toString()}`);

      useListsStore.setState({ client });
    }
  }, [client]);

  return (
    <>
      <input type="hidden" name={name} value={client?.id ?? ""} />

      <Selector
        label={(client: Client | null) =>
          client ? `${client.firstName} ${client.lastName}` : "Client"
        }
        newButton={<NewCustomer />}
        displayList={(client: Client) => (
          <div className="flex gap-3">
            <Avatar photo={client.photo} width={50} height={50} />
            <div>
              <h3 className="font-bold">{`${client.firstName} ${client.lastName}`}</h3>
              <p>
                {client.mobile} {client.email}
              </p>
            </div>
          </div>
        )}
        items={clientList}
        onSearch={(search: string) =>
          clientList.filter((client) =>
            `${client.firstName} ${client.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
        }
        openState={[
          openDropdown as boolean,
          setOpenDropdown as Dispatch<SetStateAction<boolean>>,
        ]}
        selectedItem={client}
        setSelectedItem={setClient}
      />
    </>
  );
}
