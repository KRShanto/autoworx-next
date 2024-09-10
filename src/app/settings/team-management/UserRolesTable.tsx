"use client";
import React, { useEffect, useState } from "react";
import { Switch, Checkbox } from "antd";
import {
  teamManagementUser,
  getPermissionsForRole,
  updatePermissionForRole
} from "@/actions/settings/teamManagement";
import {
  PermissionForManager,
  PermissionForSales,
  PermissionForTechnician,
  PermissionForOther,
} from "@prisma/client";

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

  const modules = [
    { label: "Communications Hub: Internal", key: "communicationHubInternal" },
    { label: "Communications Hub: Clients", key: "communicationHubClients" },
    {
      label: "Communications Hub: Collaboration",
      key: "communicationHubCollaboration",
    },
    { label: "Estimates & Invoices", key: "estimatesInvoices" },
    { label: "Calendar & Task", key: "calendarTask" },
    { label: "Payments", key: "payments" },
    { label: "Workforce Management", key: "workforceManagement" },
    { label: "Reporting & Analytics", key: "reporting" },
    { label: "Inventory", key: "inventory" },
    { label: "Integrations", key: "integrations" },
    { label: "Sales Pipeline", key: "salesPipeline" },
    { label: "Shop Pipeline", key: "shopPipeline" },
    { label: "Business Settings", key: "businessSettings" },
  ];

  const roles = ["Manager", "Sales", "Technician", "Other"];

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = (await getPermissionsForRole()) as Permissions;

        if (data) {
          setPermissions(data);
        }
      } catch (error) {
        console.log("Error fetching permissions", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleToggle = async (
    role: string,
    moduleKey: string,
    value: boolean,
  ) => {
    if (!permissions) return;

    try {
      const updatedPermissions = { ...permissions };

      const roleKey =
        `${role.toLowerCase()}Permissions` as keyof typeof permissions;

      if (updatedPermissions[roleKey]) {
        updatedPermissions[roleKey]![moduleKey] = value;
        setPermissions(updatedPermissions);
        await updatePermissionForRole({role, moduleKey, value})
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
        return permissions.managerPermissions?.[moduleKey] ?? false;

      case "Sales":
        return permissions.salesPermissions?.[moduleKey] ?? false;
      case "Technician":
        return permissions.technicianPermissions?.[moduleKey] ?? false;
      case "Other":
        return permissions.otherPermissions?.[moduleKey] ?? false;
      default:
        return null;
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
            {modules.map((module, index) => (
              <tr key={index}>
                <td className="py-2 text-left">{module.label}</td>
                {roles.map((role) => (
                  <td key={role} className="px-12 py-3 text-center">
                    {getPermissionForRole(role, module.key) !== null ? (
                      <div className="flex items-center justify-center">
                        <Switch
                          checked={
                            getPermissionForRole(role, module.key) ?? false
                          }
                          className="max-w-2 shadow-md"
                          onChange={(checked) =>
                            handleToggle(role, module.key, checked)
                          }
                        />
                        {/* Assuming viewOnly needs to be handled differently */}
                        {true && (
                          <div className="group">
                            <Checkbox className="relative left-12" />
                            <div className="fixed z-50 hidden -translate-y-14 rounded-lg border bg-[#66738C] p-1 text-sm text-white group-hover:block">
                              View Only
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
