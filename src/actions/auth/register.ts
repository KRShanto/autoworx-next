"use server";

import { MIN_PASSWORD_LENGTH } from "@/lib/consts";
import { db } from "@/lib/db";
import { defaultColumnWithColor } from "@/lib/defaultColumns";
import generateZapierToken from "@/lib/generateZapierToken";
import { FormErrorType } from "@/types/form-errror";
import bcrypt from "bcrypt";
import * as EmailValidator from "email-validator";

// Interface for the registration data
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
}

// Interface for the response
interface Response {
  success?: boolean;
  error?: FormErrorType;
}

// Function to insert default columns for a company
const insertDefaultColumns = async (columnId: number, type: string) => {
  const columnsFortypes = defaultColumnWithColor.filter(
    (column) => column.type === type,
  );

  const columnsWithCompany = columnsFortypes.map((column) => ({
    ...column,
    companyId: columnId,
  }));

  await db.column.createMany({
    data: columnsWithCompany,
    skipDuplicates: true,
  });
};

// Function to register a new user and create a company
export async function register({
  firstName,
  lastName,
  email,
  password,
  company,
}: RegisterData): Promise<Response> {
  // Check if any field is missing
  if (!firstName || !email || !password) {
    return {
      error: { message: "You need to fill all the fields", field: "all" },
    };
  }

  // Check if the user already exists
  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      error: { message: "User already exist!", field: "email" },
    };
  }

  // Check if the email is valid
  if (!EmailValidator.validate(email)) {
    return {
      error: { message: "Invalid email address", field: "email" },
    };
  }

  // Check if the password is long enough
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: {
        message: "Password must be at least 6 characters long",
        field: "password",
      },
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the company
    const newCompany = await db.company.create({
      data: {
        name: company,
        zapierToken: generateZapierToken(),
      },
    });

    // Create the user
    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // TODO: temporary solution
        companyId: newCompany.id,
      },
    });

    // Create default permissions for the company users
    await Promise.all([
      // Create default permission for manager
      db.permissionForManager.create({
        data: { companyId: newCompany.id },
      }),

      // Create default permission for sales
      db.permissionForSales.create({
        data: { companyId: newCompany.id },
      }),

      // Create default permission for technician
      db.permissionForTechnician.create({
        data: { companyId: newCompany.id },
      }),

      // Create default permission for other
      db.permissionForOther.create({
        data: { companyId: newCompany.id },
      }),
    ]);

    // Create default calendar settings
    await db.calendarSettings.create({
      data: {
        companyId: newCompany.id,
        weekStart: "Sunday",
        dayStart: "10:00",
        dayEnd: "18:00",
        weekend1: "Saturday",
        weekend2: "Sunday",
      },
    });

    // Create default columns
    await Promise.all([
      insertDefaultColumns(newCompany.id, "sales"),
      insertDefaultColumns(newCompany.id, "shop"),
    ]);

    // TODO: Create default email template

    return { success: true };
  } catch (error: any) {
    console.error("Error found while creating new user");
    console.error("The error: ", error);

    return {
      error: { message: "A server side error occured", field: "all" },
    };
  }
}
