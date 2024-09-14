import Selector from "@/components/Selector";
import { cn } from "@/lib/cn";
import { EmployeeType } from "@prisma/client";
import { useEffect, useState } from "react";

const employeeTypes: EmployeeType[] = [
  "Sales",
  "Technician",
  "Manager",
  "Other",
];

export default function SelectEmployeeType({
  labelPosition = "top",
  employeeTypeOpen,
  setEmployeeTypeOpen,
  defaultType,
}: {
  labelPosition?: "top" | "left" | "none";
  employeeTypeOpen: boolean;
  setEmployeeTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultType?: EmployeeType;
}) {
  const [employeeType, setEmployeeType] = useState<EmployeeType | null>(
    defaultType || null,
  );

  return (
    <div className={cn("w-1/2")}>
      <input type="hidden" name="type" value={employeeType || ""} />

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
        label={() => (employeeType ? employeeType : "Type")}
        newButton={<div className="flex gap-2"></div>}
        items={employeeTypes}
        displayList={(employeeType: EmployeeType) => <p>{employeeType}</p>}
        onSearch={(search: string) =>
          employeeTypes.filter((type) =>
            type.toLowerCase().includes(search.toLowerCase()),
          )
        }
        openState={[employeeTypeOpen as boolean, setEmployeeTypeOpen]}
        selectedItem={employeeType}
        setSelectedItem={setEmployeeType}
      />
    </div>
  );
}
