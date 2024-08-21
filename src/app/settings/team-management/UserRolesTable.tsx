"use client";
import React from "react";
import { Switch,Checkbox } from "antd";

interface AccessModules {
  [key: string]: string[];
}
export default function UserRolesTable() {
  const modules = [
    "Dashboard",
    "Communications Hub: Internal",
    "Communications Hub: Clients",
    "Communications Hub: Collaboration",
    "Estimates & Invoices",
    "Calendar & Task",
    "Payments",
    "Workforce Management",
    "Reporting & Analytics",
    "Inventory",
    "Integrations",
    "Sales Pipeline",
    "Settings",
  ];

  const roles = ["Manager", "Sales", "Technician"];
  const accessModules: AccessModules = {
    "Dashboard": ["Manager", "Sales", "Technician"],
    "Communications Hub: Internal": ["Manager", "Sales", "Technician"],
    "Communications Hub: Clients": ["Manager", "Sales", "Technician"],
    "Communications Hub: Collaboration": ["Manager", "Sales", "Technician"],
    "Estimates & Invoices": ["Manager", "Sales", "Technician"],
    "Calendar & Task": ["Manager", "Sales", "Technician"],
    "Payments": ["Manager", "Sales"],
    "Workforce Management": ["Manager"],
    "Reporting & Analytics": ["Manager", "Sales", "Technician"],
    "Inventory": ["Manager", "Technician"],
    "Integrations": ["Manager"],
    "Sales Pipeline": ["Manager", "Sales"],
    "Settings": ["Manager", "Sales", "Technician"],
  };
  const viewOnly: AccessModules = {
    
    "Reporting & Analytics": ["Sales", "Technician"],
    "Inventory": ["Technician"],
    
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 mt-2">
        <h2 className="text-xl font-semibold pl-2">User Roles (Default)</h2>
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
            {modules.map((module) => (
              <tr key={module}>
                <td className="py-2 text-left">{module}</td>
                {roles.map((role) => (
                  <td key={role} className="px-12 py-3 text-center">
                    {accessModules[module] && accessModules[module].includes(role) ? (
                      <div className="flex items-center justify-center ">
                        <Switch defaultChecked={false} className="absolute shadow-md max-w-2" />
                        {viewOnly[module]&& viewOnly[module].includes(role) ? (
                          <>
                          <div className="group "> 

                          <Checkbox className="relative left-12" />
                          <div className="z-50 fixed text-white text-sm -translate-y-14 p-1 border rounded-lg bg-[#66738C] hidden group-hover:block  ">View Only</div>
                          </div>
                          </>
                        ) : null}
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
