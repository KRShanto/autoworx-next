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
  const { newAddedCustomer } = useListsStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

  return (
    <>
      <input type="hidden" name={name} value={client?.id ?? ""} />

      <Selector
        label={(client: Customer | null) =>
          client ? `${client.firstName} ${client.lastName}` : "Client"
        }
        newButton={<NewCustomer />}
        displayList={(client: Customer) => (
          <div className="flex gap-3">
            <Image
              src={client.photo || "/images/default.png"}
              alt="Client Image"
              width={50}
              height={50}
              className="rounded-full"
            />
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
        openState={[openDropdown, setOpenDropdown]}
        selectedItem={client}
        setSelectedItem={setClient}
      />
    </>
  );
}
