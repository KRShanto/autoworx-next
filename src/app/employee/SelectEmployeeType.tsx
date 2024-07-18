// CategorySelector.tsx
import newCategory from "@/app/estimate/create/actions/newCategory";
import Selector from "@/components/Selector";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { IEmployeeType } from "@/types/employee";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
const employeeTypes: IEmployeeType[] = [
  { id: 1, name: "Sales" },
  { id: 2, name: "Technician" },
];
export default function SelectEmployeeType({
  labelPosition = "top",
  employeeTypeOpen,
  setEmployeeTypeOpen,
}: {
  labelPosition?: "top" | "left" | "none";
  employeeTypeOpen: boolean;
  setEmployeeTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [employeeType, setEmployeeType] = useState<IEmployeeType | null>(null);

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
        items={employeeTypes}
        displayList={(employeeType: IEmployeeType) => (
          <p>{employeeType.name}</p>
        )}
        onSearch={(search: string) =>
          employeeTypes.filter((type) =>
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
