"use server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { EmployeeDepartment, EmployeeType } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EmployeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  employeeType: z.nativeEnum(EmployeeType),
  employeeDepartment: z.nativeEnum(EmployeeDepartment),
});

export async function editEmployee(data: {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employeeType: EmployeeType;
  employeeDepartment: EmployeeDepartment;
  oldPassword?: string;
  newPassword?: string;
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return {
        message: "User not found",
        field: "all",
      };
    }

    EmployeeSchema.parse(data);

    if (data.newPassword) {
      if (!data.oldPassword) {
        return {
          message: "Old password is required",
          field: "oldPassword",
        };
      }

      const valid = await bcrypt.compare(data.oldPassword, user.password);

      if (!valid) {
        return {
          message: "Old password is incorrect",
          field: "oldPassword",
        };
      }
    }

    const password = data.newPassword
      ? await bcrypt.hash(data.newPassword, 10)
      : user.password;

    await db.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        employeeType: data.employeeType,
        employeeDepartment: data.employeeDepartment,
        password,
      },
    });

    revalidatePath("/employee");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    }
  }
}
