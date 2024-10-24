"use client";
import React, { useEffect, useState } from "react";
import { Switch, Checkbox } from "antd";
import { permissionModuleForAdminManager } from "@/lib/permissionModule";
import {
  getPermissionsForRole,
  updatePermissionForRole,
} from "@/actions/settings/teamManagement";

interface PermissionWithIndexSignature {
  [key: string]: boolean;
}

interface Permissions {
  managerPermissions: PermissionWithIndexSignature | null;
  salesPermissions: PermissionWithIndexSignature | null;
  technicianPermissions: PermissionWithIndexSignature | null;
  otherPermissions: PermissionWithIndexSignature | null;
}

export default function UserRolesTable() {
  const [permissions, setPermissions] = useState<Permissions | null>(null);

  const roles = ["Manager", "Sales", "Technician", "Other"];

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = (await getPermissionsForRole()) as Permissions;
        console.log("Fetched Permissions:", data); // Check the structure here

        if (data) {
          setPermissions(data);
        }
      } catch (error) {
        console.log("Error fetching permissions", error);
      }
    };

    fetchPermissions();
  }, []);

  // Handle toggle for both switch (permission) and checkbox (viewOnly)
  const handleToggle = async (
    role: string,
    moduleKey: string,
    value: boolean,
    isViewOnly = false,
  ) => {
    if (!permissions) return;

    try {
      const updatedPermissions = { ...permissions };
      const roleKey =
        `${role.toLowerCase()}Permissions` as keyof typeof permissions;
      const fieldKey = isViewOnly ? `${moduleKey}ViewOnly` : moduleKey;

      if (updatedPermissions[roleKey]) {
        updatedPermissions[roleKey]![fieldKey] = value; // Update locally
        setPermissions(updatedPermissions); 
        await updatePermissionForRole({ role, moduleKey, value, isViewOnly }); // Update the database
      }
    } catch (error) {
      console.log("Error updating permission:", error);
    }
  };

  const getPermissionForRole = (
    role: string,
    moduleKey: string,
  ): boolean | null => {
    if (!permissions) return null;

    switch (role) {
      case "Manager":
        return permissions.managerPermissions?.[moduleKey] ?? null;

      case "Sales":
        return permissions.salesPermissions?.[moduleKey] ?? null;
      case "Technician":
        return permissions.technicianPermissions?.[moduleKey] ?? null;
      case "Other":
        return permissions.otherPermissions?.[moduleKey] ?? null;
      default:
        return null;
    }
  };

  const isViewOnlyForRole = (role: string, moduleKey: string): boolean => {
    if (!permissions) return false;

    const viewOnlyKey = `${moduleKey}ViewOnly`;

    switch (role) {
      case "Manager":
        return permissions.managerPermissions?.[viewOnlyKey] ?? false;
      case "Sales":
        return permissions.salesPermissions?.[viewOnlyKey] ?? false;
      case "Technician":
        return permissions.technicianPermissions?.[viewOnlyKey] ?? false;
      case "Other":
        return permissions.otherPermissions?.[viewOnlyKey] ?? false;
      default:
        return false;
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 mt-2">
        <h2 className="pl-2 text-xl font-semibold">User Roles (Default)</h2>
      </div>
      <div className="m-2 overflow-x-auto rounded-lg bg-white p-4 shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-black py-2 text-left">
                Modules
              </th>
              {roles.map((role) => (
                <th
                  key={role}
                  className="border-b-2 border-black py-2 text-center"
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionModuleForAdminManager.map((module, index) => (
              <tr key={index+1}>
                <td className="py-2 text-left">{module.label}</td>
                {roles.map((role) => {
                  const permission = getPermissionForRole(role, module.key);
                  const isViewOnly = isViewOnlyForRole(role, module.key);
                  const canViewOnly =
                    (role === "Sales" &&
                      module.key === "workforceManagement") ||
                    (role === "Sales" && module.key === "reporting") ||
                    (role === "Sales" && module.key === "inventory") ||
                    (role === "Technician" &&
                      module.key === "workforceManagement") ||
                    (role === "Technician" && module.key === "reporting");

                  return (
                    <td key={role} className="px-12 py-3 text-center">
                      {permission !== null ? (
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={permission}
                            className="max-w-2 shadow-md"
                            onChange={(checked) =>
                              handleToggle(role, module.key, checked)
                            }
                          />
                        </div>
                      ) : null}

                      {canViewOnly && (
                          <div className="group">
                            <Checkbox
                              className="relative left-0"
                              checked={isViewOnly}
                              onChange={(e) =>
                                handleToggle(
                                  role,
                                  module.key,
                                  e.target.checked,
                                  true,
                                )
                              }
                            />
                            <div className="fixed z-50 hidden -translate-y-14 rounded-lg border bg-[#66738C] p-1 text-sm text-white group-hover:block">
                              View Only
                            </div>
                          </div>
                        )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
