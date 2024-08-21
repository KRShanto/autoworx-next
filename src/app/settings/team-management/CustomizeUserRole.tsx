import React, { useState } from "react";
import Image from "next/image";
import { Switch, Checkbox } from "antd";

interface Module {
  name: string;
  access: boolean;
}

interface CustomizeUserRolesProps {
  user: {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
  };
  onBack: () => void;
}

const CustomizeUserRole = ({ user, onBack }: CustomizeUserRolesProps) => {
  const [modules, setModules] = useState<Module[]>([
    { name: "Dashboard", access: false },
    { name: "Communications Hub: Internal", access: false },
    { name: "Communications Hub: Clients", access: false },
    { name: "Communications Hub: Collaboration", access: false },
    { name: "Estimates & Invoices", access: false },
    { name: "Calendar & Task", access: false },
    { name: "Reporting & Analytics", access: true },
    { name: "Inventory", access: true },
    { name: "Settings", access: false },
  ]);

  const handleToggleAccess = (index: number) => {
    setModules((prevModules) => {
      const newModules = [...prevModules];
      newModules[index].access = !newModules[index].access;
      return newModules;
    });
  };

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
            src={user.avatarUrl}
            alt={user.name}
            width={40}
            height={40}
            className="object-cover"
            ml-4
            mr-4
          />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
      <table className="ml-1 mr-4 w-[98%] border border-t-0 border-black p-8 mb-2">
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
                <Switch defaultChecked={false} className="shadow-md" />{module.access?<Checkbox className="relative ml-2" />:null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomizeUserRole;
