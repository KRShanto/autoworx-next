import { Dispatch, SetStateAction } from "react";
import PipelineSelector from "./PipelineSelector";
import { SelectProps } from "@/components/Lists/select-props";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const demoEmployees: Employee[] = [
  { id: 1, firstName: "Shanto", lastName: "x" },
  { id: 2, firstName: "Noman", lastName: "y" },
  { id: 3, firstName: "Satyajit", lastName: "z" },
];

export function EmployeeSelector({
  name = "employeeId",
  value = null,
  setValue,
  openDropdown,
  setOpenDropdown,
}: SelectProps<Employee | null>) {
  const handleSearch = (search: string) =>
    demoEmployees.filter((employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <>
      <input type="hidden" name={name} value={value?.id ?? ""} />

      <PipelineSelector
        label={(employee: Employee | null) =>
          employee ? `${employee.firstName} ${employee.lastName}` : "Employee"
        }
        // newButton=""
        displayList={(employee: Employee) => (
          <div className="flex gap-3">
            <div>
              <h3 className="font-bold">{`${employee.firstName} ${employee.lastName}`}</h3>
            </div>
          </div>
        )}
        items={demoEmployees}
        onSearch={handleSearch}
        openState={[
          openDropdown ?? false,
          setOpenDropdown as Dispatch<SetStateAction<boolean>>,
        ]}
        selectedItem={value}
        setSelectedItem={setValue as Dispatch<SetStateAction<Employee | null>>}
       
      />
    </>
  );
}
