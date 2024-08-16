"use client";

import { CheckCircleOutlined } from "@ant-design/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  FaChevronCircleDown,
  FaChevronDown,
  FaHamburger,
} from "react-icons/fa";
import { PiDotFill } from "react-icons/pi";
import Select from "./Select";

const DropdownMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

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
                {
                  id: 1,
                  value: "Status 1",
                },
                {
                  id: 2,
                  value: "delivered",
                },
                {
                  id: 3,
                  value: "paid",
                },
              ]}
            />
            <Select
              label="Services"
              items={[
                {
                  id: 1,
                  value: "pending",
                },
                {
                  id: 2,
                  value: "delivered",
                },
                {
                  id: 3,
                  value: "paid",
                },
              ]}
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
