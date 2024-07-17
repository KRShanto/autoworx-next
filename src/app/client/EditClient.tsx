"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import NewVendor from "@/components/Lists/NewVendor";
import SelectCategory from "@/components/Lists/SelectCategory";
import SelectClientSource from "@/components/Lists/SelectClientSource";
import { SelectClientTags } from "@/components/Lists/SelectClientTags";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { ClientSource } from "@/types/client";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import NewClientSource from "./NewClientSource";

export default function EditClient() {
  const [open, setOpen] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [clientSource, setClientSource] = useState<ClientSource | null>(null);
  const [openClientSource, setOpenClientSource] = useState(false);
  const [tagOpenDropdown, setTagOpenDropdown] = useState(false);
  const [tags, setTags] = useState(null);
  const [clientSources, setClientSources] = useState<any>([
    {
      id: 1,
      source: "Facebook",
    },
    {
      id: 2,
      source: "X",
    },
    {
      id: 3,
      source: "YouTube",
    },
  ]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-md p-2 px-5 text-[#6571FF]">
            <FaEdit />
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          // form
        >
          <div className="mt-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Client</h1>
            <button
              onClick={() => {
                profilePicRef.current?.click();
              }}
              className="flex items-center justify-center gap-x-2 rounded-full border border-slate-400 pl-2"
            >
              <span>Upload a profile picture</span> <RxAvatar size={48} />
            </button>
            <input
              ref={profilePicRef}
              type="file"
              name="profilePicture"
              hidden
              accept="image/*"
            />
          </div>

          <FormError />

          <div className="space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between">
              <SlimInput name="firstName" />
              <SlimInput name="lastName" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput name="email" />
              <SlimInput name="mobileNumber" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput rootClassName="flex-1" name="address" />
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <SlimInput name="city" />
              <SlimInput name="state" />
              <SlimInput name="zip" />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <SlimInput name="companyName" />
              <div className="w-full">
                <p className="mb-1 font-medium">Client Source</p>
                <SelectClientSource
                  clickabled={false}
                  label={(clientSrc) =>
                    clientSource ? clientSource.source : "Client Source"
                  }
                  newButton={
                    <NewClientSource
                      clientSources={clientSources}
                      setClientSources={setClientSources}
                    />
                  }
                  items={clientSources}
                  displayList={(clientSource: ClientSource) => (
                    <div className="flex">
                      <button
                        className="w-full text-left text-sm font-bold"
                        onClick={() => {
                          setClientSource(clientSource);
                          setOpenClientSource(false);
                        }}
                        type="button"
                      >
                        {clientSource.source}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setClientSources((prev: ClientSource[]) => {
                              return prev.filter(
                                (c) => c.id !== clientSource.id,
                              );
                            });
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
                    return clientSources.filter((clientSource: ClientSource) =>
                      clientSource.source
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    );
                  }}
                  openState={[openClientSource, setOpenClientSource]}
                />
              </div>
            </div>
            <div className="">
              <p className="mb-1 font-medium">Tag</p>
              <SelectClientTags
                value={tags}
                open={tagOpenDropdown}
                setOpen={setTagOpenDropdown}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
              Cancel
            </DialogClose>
            <button className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white">
              Update
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
