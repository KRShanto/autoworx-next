"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { EmployeeType } from "@prisma/client";
import * as EmailValidator from "email-validator";
import { getCompanyId } from "@/lib/companyId";
import { MIN_PASSWORD_LENGTH } from "@/lib/consts";
import { revalidatePath } from "next/cache";
import { TErrorHandler } from "@/types/globalError";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { createEmployeeValidationSchema } from "@/validations/schemas/employee/employee.validation";
import { Decimal } from "@prisma/client/runtime/library";

interface EmployeeData {
  firstName: string;
  lastName?: string;
  email: string;
  mobileNumber: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  companyName?: string;
  commission?: number;
  date?: string;
  type?: EmployeeType;
  profilePicture?: string;
  password: string;
  confirmPassword: string;
}

export async function addEmployee({
  firstName,
  lastName,
  email,
  mobileNumber,
  address,
  city,
  state,
  zip,
  companyName,
  commission,
  date,
  type,
  profilePicture,
  password,
  confirmPassword,
}: EmployeeData): Promise<ServerAction | TErrorHandler> {
  try {
    const companyId = await getCompanyId();

    const employeeInfo = await createEmployeeValidationSchema.parseAsync({
      firstName,
      lastName,
      email,
      phone: mobileNumber,
      address,
      city,
      state,
      zip,
      companyName,
      commission: new Decimal(commission || 0),
      joinDate: new Date(date || Date.now()),
      employeeType: type,
      image: profilePicture ? profilePicture : undefined,
      password,
    });

    // Check if any field is missing
    // if (!firstName || !email || !password || !confirmPassword) {
    //   throw new Error("You need to fill all the fields");
    // }

    // check if the user already created
    const user = await db.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new Error("User already exist!");
    }

    // check if the email is valid
    // if (!EmailValidator.validate(email)) {
    //   return {
    //     type: "error",
    //     message: "Invalid email address",
    //   };
    // }

    // check if the password is long enough
    // if (password.length < MIN_PASSWORD_LENGTH) {
    //   return {
    //     type: "error",
    //     message: "Password must be at least 6 characters long",
    //   };
    // }

    // check if the password and confirm password match
    if (password !== confirmPassword) {
      return {
        type: "error",
        message: "Password and confirm password do not match",
      };
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the employee
    const newEmployee = await db.user.create({
      data: {
        ...employeeInfo,
        password: hashedPassword,
        companyId,
        role: "employee",
      },
    });

    revalidatePath("/employee");

    return {
      type: "success",
      message: "Employee added successfully",
      data: newEmployee,
    };
  } catch (err) {
    console.log({ err });
    return errorHandler(err);
  }
}
