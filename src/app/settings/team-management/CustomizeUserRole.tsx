import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from "antd";
import { Role, EmployeeType } from "@prisma/client";
import { permissionModule } from "@/lib/permissionModule";
import {
  getUserPermissions,
  savePermissions,
} from "@/actions/settings/teamManagement";

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

interface PermissionType {
  [key: string]: boolean;
}

const CustomizeUserRole = ({ user, onBack }: CustomizeUserRolesProps) => {
  const name = `${user.firstName} ${user.lastName}`;

  const [permissions, setPermissions] = useState<PermissionType>({});

  useEffect(() => {
    // Fetch default and user-specific permissions
    getUserPermissions(user.id, user.employeeType).then((data) => {
      setPermissions(data || {}); // Initialize with an empty object if no permissions
    });
  }, [user.id, user.employeeType]);

  const handlePermissionChange = async (key: string, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: checked }));

    try {
      await savePermissions(user.id, { [key]: checked });
      console.log(`Permission for ${key} updated to ${checked}`);
    } catch (error) {
      console.error("Failed to update permission:", error);
    }
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
            src={user.image}
            alt={name}
            width={40}
            height={40}
            className="object-cover"
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
          {permissionModule.map((module, index) => (
            <tr key={index} className="p-4">
              <td className="px-4 py-2">{module.label}</td>
              <td className="px-4 py-2.5 text-left">
                <Switch
                  checked={permissions[module.key] ?? false}
                  onChange={(checked) =>
                    handlePermissionChange(module.key, checked)
                  }
                  className="shadow-md"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomizeUserRole;
