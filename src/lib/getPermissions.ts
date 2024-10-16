import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import {
  Permission,
  PermissionForManager,
  PermissionForOther,
  PermissionForSales,
  PermissionForTechnician,
  User,
} from "@prisma/client";
import { db } from "./db";

type PermissionsResult =
  | {
      role: "Admin";
      companyPermissions: null | undefined;
      userPermissions: Permission | null | undefined;
    }
  | {
      role: "Manager";
      companyPermissions: PermissionForManager | null;
      userPermissions: Permission | null;
    }
  | {
      role: "Sales";
      companyPermissions: PermissionForSales | null;
      userPermissions: Permission | null;
    }
  | {
      role: "Technician";
      companyPermissions: PermissionForTechnician | null;
      userPermissions: Permission | null;
    }
  | {
      role: "Other";
      companyPermissions: PermissionForOther | null;
      userPermissions: Permission | null;
    };

export default async function getPermissions(): Promise<PermissionsResult | null> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const user = await db.user.findFirst({
    where: { id: +session.user.id },
  });

  if (!user) return null;

  let companyPermissions = null;
  let userPermissions = await db.permission.findFirst({
    where: { userId: +user.id, companyId },
  });

  switch (user.employeeType) {
    case "Manager":
      companyPermissions = await db.permissionForManager.findFirst({
        where: { companyId },
      });
      return {
        role: "Manager",
        companyPermissions,
        userPermissions: userPermissions || null,
      } as const;

    case "Sales":
      companyPermissions = await db.permissionForSales.findFirst({
        where: { companyId },
      });
      return {
        role: "Sales",
        companyPermissions,
        userPermissions: userPermissions || null,
      } as const;

    case "Technician":
      companyPermissions = await db.permissionForTechnician.findFirst({
        where: { companyId },
      });
      return {
        role: "Technician",
        companyPermissions,
        userPermissions: userPermissions || null,
      } as const;

    case "Other":
      companyPermissions = await db.permissionForOther.findFirst({
        where: { companyId },
      });
      return {
        role: "Other",
        companyPermissions,
        userPermissions: userPermissions || null,
      } as const;

    case "Admin":
      return {
        role: "Admin",
        companyPermissions: null,
        userPermissions: null,
      } as const;

    default:
      throw new Error(`Unknown role: ${user.employeeType}`);
  }
}
