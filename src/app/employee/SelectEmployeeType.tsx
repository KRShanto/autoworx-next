// CategorySelector.tsx
import newCategory from "@/app/estimate/create/actions/newCategory";
import Selector from "@/components/Selector";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export default function SelectEmployeeType({
  labelPosition = "top",
  employeeTypeOpen,
  setEmployeeTypeOpen,
}) {
  const [employeeType, setEmployeeType] = useState(null);

  return (
    <div className={cn("w-1/2")}>
      {labelPosition !== "none" && (
        <label
          className={cn("text-semibold", {
            "w-28 text-end text-sm": labelPosition === "left",
          })}
        >
          Type
        </label>
      )}

      <Selector
        label={() => (employeeType ? employeeType.name : "Type")}
        newButton={<div className="flex gap-2"></div>}
        items={[
          // @ts-ignore
          { id: 1, name: "Sales" },
          // @ts-ignore
          { id: 2, name: "Technician" },
        ]}
        displayList={(category: Category) => <p>{category.name}</p>}
        onSearch={(search: string) =>
          [
            // @ts-ignore
            { id: 1, name: "Sales" },
            // @ts-ignore
            { id: 2, name: "Technician" },
          ].filter((type) =>
            type.name.toLowerCase().includes(search.toLowerCase()),
          )
        }
        openState={[employeeTypeOpen as boolean, setEmployeeTypeOpen]}
        selectedItem={employeeType}
        setSelectedItem={setEmployeeType}
      />
    </div>
  );
}
