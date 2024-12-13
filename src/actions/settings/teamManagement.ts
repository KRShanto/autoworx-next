"use server";

/**
 * Fetches the list of users for team management.
 *
 * @returns A list of users with their basic information.
 * @throws Will throw an error if the fetch operation fails.
 */
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { create } from "zustand";
import {
  Role,
  EmployeeType,
  Prisma,
  PermissionForManager,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

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

/**
 * Fetches the permissions for different roles.
 *
 * @returns An object containing permissions for different roles.
 * @throws Will throw an error if the fetch operation fails.
 */
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
  isViewOnly?: boolean;
}

/**
 * Updates the permission for a specific role.
 *
 * @param role - The role for which the permission is to be updated.
 * @param moduleKey - The module key for the permission.
 * @param value - The value of the permission.
 * @param isViewOnly - Optional flag to indicate if the permission is view-only.
 * @throws Will throw an error if the update operation fails.
 */
export const updatePermissionForRole = async ({
  role,
  moduleKey,
  value,
  isViewOnly,
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
        const technicianPermission = await db.permissionForTechnician.findFirst(
          {
            where: { companyId },
          },
        );
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

//customization of users
interface PrismaClientWithIndex {
  [key: string]: any;
}
interface PermissionModelMap {
  Manager: string;
  Sales: string;
  Technician: string;
  Other: string;
}

const permissionModelMap: PermissionModelMap = {
  Manager: "permissionForManager",
  Sales: "permissionForSales",
  Technician: "permissionForTechnician",
  Other: "permissionForOther",
};

const getRoleModel = (role: string): string => {
  const roleModel = permissionModelMap[role as keyof PermissionModelMap];
  if (!roleModel) {
    throw new Error(`Unknown role: ${role}`);
  }
  return roleModel;
};

/**
 * Fetches the permissions for a specific user.
 *
 * @param userId - The ID of the user.
 * @param role - The role of the user.
 * @returns An object containing the merged permissions for the user.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getUserPermissions = async (userId: number, role: string) => {
  const roleModel = getRoleModel(role);

  try {
    const companyId = await getCompanyId();

    const rolePermission = await (prisma as PrismaClientWithIndex)[
      roleModel
    ].findFirst({
      where: { companyId },
    });

    if (!rolePermission) {
      console.error(`No role permissions found for companyId: ${companyId}`);
      return {};
    }

    const userPermissions = await prisma.permission.findFirst({
      where: { userId, companyId },
    });

    const mergedPermissions = { ...rolePermission, ...(userPermissions || {}) };

    return mergedPermissions;
  } catch (error) {
    console.error(
      `Error fetching permissions for userId: ${userId} and role: ${role}`,
      error,
    );
    return {};
  }
};

/**
 * Saves the permissions for a specific user.
 *
 * @param userId - The ID of the user.
 * @param newPermissions - The new permissions to be saved.
 * @throws Will throw an error if the save operation fails.
 */
export const savePermissions = async (
  userId: number,
  newPermissions: object,
) => {
  try {
    const companyId = await getCompanyId();

    await prisma.permission.upsert({
      where: {
        userId_companyId: { userId, companyId },
      },
      create: { userId, companyId, ...newPermissions },
      update: { ...newPermissions },
    });
  } catch (error) {
    console.error("Error saving permissions:", error);
  }
};
