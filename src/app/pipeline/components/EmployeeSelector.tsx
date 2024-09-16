import { Dispatch, SetStateAction } from "react";
import PipelineSelector from "./PipelineSelector";
import { SelectProps } from "@/components/Lists/select-props";
import { User } from "@prisma/client";

interface Employee {
  id: number;
  firstName: string;
  lastName: string|null;
}



export function EmployeeSelector({
  name = "employeeId",
  value = null,
  setValue,
  openDropdown,
  setOpenDropdown,
  companyUsers
}: SelectProps<Employee | null> & { companyUsers: User[] }) {
  const handleSearch = (search: string) =>
    companyUsers.filter((employee) =>
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
        items={companyUsers}
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
