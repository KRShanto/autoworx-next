"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import SelectClientSource from "@/components/Lists/SelectClientSource";
import { SelectClientTags } from "@/components/Lists/SelectClientTags";
import { SlimInput } from "@/components/SlimInput";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import NewClientSource from "@/components/Lists/NewClientSource";
import { Customer, Source, Tag } from "@prisma/client";
import { getSources } from "@/components/Lists/getSources";
import { deleteSource } from "@/components/Lists/deleteSource";
import { useFormErrorStore } from "@/stores/form-error";
import { FaPenToSquare } from "react-icons/fa6";
import { editCustomer } from "../customer/edit";

export default function EditCustomer({
  client,
}: {
  client: Customer & { tag: Tag | null; source: Source | null };
}) {
  const [open, setOpen] = useState(false);
  const [clientSource, setClientSource] = useState<Source | null>(
    client.source,
  );
  const [openClientSource, setOpenClientSource] = useState(false);
  const [tagOpenDropdown, setTagOpenDropdown] = useState(false);
  const [tag, setTag] = useState<Tag | undefined>(client.tag!);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [clientSources, setClientSources] = useState<Source[]>([]);
  const { showError } = useFormErrorStore();

  async function getClientSources() {
    const data = await getSources();
    setClientSources(data);
  }

  async function deleteClientSource(id: number) {
    await deleteSource(id);

    setClientSources((prev: Source[]) => {
      return prev.filter((source) => source.id !== id);
    });

    if (clientSource?.id === id) {
      setClientSource(null);
    }
  }

  async function handleSubmit() {
    let photo;

    const firstName = document.querySelector<HTMLInputElement>("#firstName")
      ?.value as string;
    const lastName =
      document.querySelector<HTMLInputElement>("#lastName")?.value;
    const email = document.querySelector<HTMLInputElement>("#email")?.value;
    const mobile = document.querySelector<HTMLInputElement>("#mobile")?.value;
    const customerCompany =
      document.querySelector<HTMLInputElement>("#customerCompany")?.value;
    const address = document.querySelector<HTMLInputElement>("#address")?.value;
    const city = document.querySelector<HTMLInputElement>("#city")?.value;
    const state = document.querySelector<HTMLInputElement>("#state")?.value;
    const zip = document.querySelector<HTMLInputElement>("#zip")?.value;

    const res = await editCustomer({
      id: client.id,
      firstName,
      lastName,
      email,
      mobile,
      customerCompany,
      address,
      city,
      state,
      zip,
      tagId: tag?.id,
      sourceId: clientSource?.id,
    });

    if (res.type !== "success") {
      showError({
        field: res.field || "make",
        message: res.message || "Failed to add customer",
      });
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    getClientSources();
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-xs text-[#6571FF]">
            <FaPenToSquare />
          </button>
        </DialogTrigger>

        <DialogContent className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]">
          <div className="mt-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Client</h1>

            {/* TODO: update profile pic */}
            {profilePic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(profilePic)}
                alt="profile"
                className="h-14 w-14 cursor-pointer rounded-full border border-slate-400"
                onClick={() => {
                  setProfilePic(null);
                }}
              />
            ) : (
              <label
                className="flex cursor-pointer items-center justify-center gap-x-2 rounded-full border border-slate-400 pl-2"
                htmlFor="profilePicture"
              >
                <input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePic(file);
                    }
                  }}
                />
                <span>Upload a profile picture</span> <RxAvatar size={48} />
              </label>
            )}
          </div>

          <FormError />

          <div className="space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between">
              <SlimInput name="firstName" defaultValue={client.firstName} />
              <SlimInput
                name="lastName"
                required={false}
                defaultValue={client.lastName!}
              />
            </div>

            <div className="flex items-center justify-between">
              <SlimInput name="email" defaultValue={client.email!} />
              <SlimInput
                name="mobile"
                required={false}
                defaultValue={client.mobile!}
              />
            </div>

            <div className="flex items-center justify-between">
              <SlimInput
                rootClassName="flex-1"
                name="address"
                required={false}
                defaultValue={client.address!}
              />
            </div>

            <div className="flex items-center justify-between gap-x-2">
              <SlimInput
                name="city"
                required={false}
                defaultValue={client.city!}
              />
              <SlimInput
                name="state"
                required={false}
                defaultValue={client.state!}
              />
              <SlimInput
                name="zip"
                required={false}
                defaultValue={client.zip!}
              />
            </div>

            <div className="flex items-center justify-between gap-x-4">
              <SlimInput
                name="customerCompany"
                required={false}
                defaultValue={client.customerCompany!}
                label="Company"
              />

              <div className="w-full">
                <p className="mb-1 font-medium">Client Source</p>
                {/* TODO: use `Selector` component and make the hieght auto */}
                <SelectClientSource
                  clickabled={false}
                  label={(clientSrc) =>
                    clientSource ? clientSource.name : "Client Source"
                  }
                  newButton={
                    <NewClientSource setClientSources={setClientSources} />
                  }
                  items={clientSources}
                  displayList={(clientSource: Source) => (
                    <div className="flex">
                      <button
                        className="w-full text-left text-sm font-bold"
                        onClick={() => {
                          setClientSource(clientSource);
                          setOpenClientSource(false);
                        }}
                        type="button"
                      >
                        {clientSource.name}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            deleteClientSource(clientSource.id);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                  selectedItem={clientSource}
                  setSelectedItem={setClientSource}
                  onSearch={(search: string) => {
                    return clientSources.filter((clientSource: Source) =>
                      clientSource.name
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    );
                  }}
                  openState={[openClientSource, setOpenClientSource]}
                />
              </div>
            </div>
            <div className="">
              {/* BUG: when making the root `form`, this dropdown doesn't work */}
              <p className="mb-1 font-medium">Tag</p>
              <SelectClientTags
                value={tag}
                setValue={setTag}
                open={tagOpenDropdown}
                setOpen={setTagOpenDropdown}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
              Cancel
            </DialogClose>
            <button
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              onClick={handleSubmit}
            >
              Add
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
