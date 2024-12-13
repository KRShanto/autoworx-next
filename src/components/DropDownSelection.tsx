"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

import { IoMdArrowDropdown } from "react-icons/io";

type TProps = {
  changesValue?: string;
  dropDownValues: string[];
  menuLabel?: string;
  defaultValue?: string;
  value?: string;
  onValueChange: (value: string) => void;
  contentClassName?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
};

export function DropdownSelection({
  changesValue,
  menuLabel,
  dropDownValues,
  defaultValue,
  onValueChange,
  contentClassName,
  buttonClassName,
  children,
}: TProps) {
  //   const [position, setPosition] = React.useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            className={cn(
              "flex items-center justify-center gap-x-2",
              buttonClassName,
            )}
          >
            {changesValue || defaultValue}
            <IoMdArrowDropdown />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-56", contentClassName)}>
        {menuLabel && (
          <>
            <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuRadioGroup
          value={changesValue}
          onValueChange={onValueChange}
        >
          {dropDownValues.length > 0 ? (
            dropDownValues.map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {value}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <DropdownMenuRadioItem
              key={defaultValue}
              value={defaultValue || ""}
            >
              {defaultValue}
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
