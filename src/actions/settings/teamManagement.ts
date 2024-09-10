
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
}

export const updatePermissionForRole = async ({
  role,
  moduleKey,
  value,
}: userRolePermission) => {
  if (!role || !moduleKey || typeof value != "boolean")
    throw new Error("Invalid arguments for permission update");

  try {
    const companyId = await getCompanyId();
    switch (role) {
      case "Manager":
        const managerPermission = await db.permissionForManager.findFirst({
          where: { companyId },
        });
        if (managerPermission) {
          await db.permissionForManager.update({
            where: { id: managerPermission.id },
            data: { [moduleKey]: value },
          });
        } else {
          await db.permissionForManager.create({
            data: {
              companyId,
            },
          });
        }
        break;

      default:
        console.log("Role not found: " + role);
    }
  } catch (error) {
    throw new Error("Error for permission update");
  }
};
