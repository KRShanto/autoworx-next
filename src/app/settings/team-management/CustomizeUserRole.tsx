import React, { useState } from "react";
import Image from "next/image";
import { Switch, Checkbox } from "antd";
import {Role,EmployeeType} from "@prisma/client"

interface Module {
  name: string;
 
}

interface CustomizeUserRolesProps {
  user: {
    id: number;
    firstName: string;
    lastName: string | null;
    role: Role;
    image: string;
    employeeType: EmployeeType;
  };
  onBack: () => void;
}

const CustomizeUserRole = ({ user, onBack }: CustomizeUserRolesProps) => {
 

  const [modules, setModules] = useState<Module[]>([
    { name: "Dashboard", },
    { name: "Communications Hub: Internal" },
    { name: "Communications Hub: Clients" },
    { name: "Communications Hub: Collaboration" },
    { name: "Estimates & Invoices",  },
    { name: "Calendar & Task"},
    { name: "Reporting & Analytics" },
    { name: "Inventory" },
    { name: "Settings"},
  ]);

 
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <div className="">
      <div className="mb-4 flex items-center">
        <button onClick={onBack} className="mr-2 font-bold">
          {"<"} Customize User Roles
        </button>
      </div>
      <div className="ml-1 mr-4 flex h-[100px] w-[98%] items-center border-l border-r border-t border-black pl-2">
        <div className="w- overflow-hidden rounded-full">
          <Image
            src={user.image}
            alt={name}
            width={40}
            height={40}
            className="object-cover"
            ml-4
            mr-4
          />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{user.employeeType}</p>
        </div>
      </div>
      <table className="mb-2 ml-1 mr-4 w-[98%] border border-t-0 border-black p-8">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="px-4 text-left">Modules</th>
            <th className="px-4 text-left">Access</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module, index) => (
            <tr key={index} className="p-4">
              <td className="px-4 py-2">{module.name}</td>
              <td className="px-4 py-2.5 text-left">
                <Switch defaultChecked={false} className="shadow-md" />
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomizeUserRole;
