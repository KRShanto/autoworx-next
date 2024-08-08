"use server";

import { db } from "@/lib/db";
import { EmployeeType } from "@prisma/client";
import * as EmailValidator from "email-validator";
import { revalidatePath } from "next/cache";

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
}

export async function updateEmployee({
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
}: EmployeeData) {
  // Check if any field is missing
  if (!firstName || !email) {
    return {
      type: "error",
      message: "You need to fill all the fields",
    };
  }

  // Check if the email valid
  if (!EmailValidator.validate(email)) {
    return {
      type: "error",
      message: "Invalid email address",
    };
  }

  // update the employee
  await db.user.update({
    where: { email },
    data: {
      firstName,
      lastName,
      email,
      phone: mobileNumber,
      address,
      city,
      state,
      zip,
      companyName,
      commission,
      joinDate: new Date(date || Date.now()),
      employeeType: type,
      image: profilePicture,
    },
  });

  revalidatePath("/employee");

  return {
    type: "success",
    message: "Employee updated successfully",
  };
}
