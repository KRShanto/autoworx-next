
"use server";

import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { create } from "zustand";
import {
  Role,
  EmployeeType,
  Prisma,
  PermissionForManager,
} from "@prisma/client";

export const teamManagementUser = async (): Promise<
  {
    id: number;
    firstName: string;
    lastName: string | null;
    role: Role;
    image: string;
    employeeType: EmployeeType;
  }[]
> => {
  try {
    const companyId = await getCompanyId();

    // Fetch users from the database with the companyId filter
    const returnedUsers = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        image: true,
        employeeType: true,
      },
    });

    return returnedUsers;
  } catch (error: any) {
    console.log("Error selecting data from user", error);
    throw error;
  }
};

export const getPermissionsForRole = async () => {
  try {
    const companyId = await getCompanyId();
    const [
      managerPermissions,
      salesPermissions,
      technicianPermissions,
      otherPermissions,
    ] = await Promise.all([
      db.permissionForManager.findFirst({ where: { companyId } }),
      db.permissionForSales.findFirst({ where: { companyId } }),
      db.permissionForTechnician.findFirst({ where: { companyId } }),
      db.permissionForOther.findFirst({ where: { companyId } }),
    ]);

    return {
      managerPermissions,
      salesPermissions,
      technicianPermissions,
      otherPermissions,
    };
  } catch (error) {
    console.log("Error fetching permissions", error);
    throw error;
  }
};

interface userRolePermission {
  role: string;
  moduleKey: string;
  value: boolean;
  isViewOnly?:boolean;
  
}

export const updatePermissionForRole = async ({
  role,
  moduleKey,
  value,
  isViewOnly
}: userRolePermission) => {
  if (!role || !moduleKey || typeof value !== "boolean")
    throw new Error("Invalid arguments for permission update");

  try {
    const companyId = await getCompanyId();
    const moduleField = isViewOnly ? `${moduleKey}ViewOnly` : moduleKey;

    switch (role) {
      case "Manager":
        const managerPermission = await db.permissionForManager.findFirst({
          where: { companyId },
        });
        if (managerPermission) {
          await db.permissionForManager.update({
            where: { id: managerPermission.id },
            data: { [moduleField]: value },
          });
        } else {
          throw new Error("Can't update the permission for this role");
        }
        break;

      case "Sales":
        const salesPermission = await db.permissionForSales.findFirst({
          where: { companyId },
        });
        if (salesPermission) {
          await db.permissionForSales.update({
            where: { id: salesPermission.id },
            data: { [moduleField]: value },
          });
        } else {
          throw new Error("Can't update the permission for this role");
        }
        break;

      case "Technician":
        const technicianPermission = await db.permissionForTechnician.findFirst({
          where: { companyId },
        });
        if (technicianPermission) {
          await db.permissionForTechnician.update({
            where: { id: technicianPermission.id },
            data: { [moduleField]: value },
          });
        } else {
          throw new Error("Can't update the permission for this role");
        }
        break;

      case "Other":
        const otherPermission = await db.permissionForOther.findFirst({
          where: { companyId },
        });
        if (otherPermission) {
          await db.permissionForOther.update({
            where: { id: otherPermission.id },
            data: { [moduleField]: value },
          });
        } else {
          throw new Error("Can't update the permission for this role");
        }
        break;

      default:
        throw new Error("Role not found: " + role);
    }
  } catch (error) {
    console.error("Error updating permission:", error);
    throw new Error("Error updating permission");
  }
};


