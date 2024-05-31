"use server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { EmployeeDepartment, EmployeeType } from "@prisma/client";
import { auth } from "../auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EmployeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  employeeType: z.nativeEnum(EmployeeType),
  employeeDepartment: z.nativeEnum(EmployeeDepartment),
});

export async function addEmployee(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employeeType: EmployeeType;
  employeeDepartment: EmployeeDepartment;
}) {
  try {
    EmployeeSchema.parse(data);

    const password = await bcrypt.hash(data.password, 10);
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    await db.user.create({
      data: {
        ...data,
        password,
        role: "employee",
        companyId,
      },
    });

    revalidatePath("/employee");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else if (error.code === "P2002") {
      return {
        message: "Email already exists",
        field: "email",
      };
    }
  }
}
