"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import * as EmailValidator from "email-validator";
import { FormErrorType } from "@/types/form-errror";
import { MIN_PASSWORD_LENGTH } from "@/lib/consts";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
}

interface Response {
  success?: boolean;
  error?: FormErrorType;
}

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

  // check if the user already created
  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      // error: "User already exist!",
      error: { message: "User already exist!", field: "email" },
    };
  }

  // check if the email is valid
  if (!EmailValidator.validate(email)) {
    return {
      error: { message: "Invalid email address", field: "email" },
    };
  }

  // check if the password is long enough
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: {
        message: "Password must be at least 6 characters long",
        field: "password",
      },
    };
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the company
    const newCompany = await db.company.create({
      data: {
        name: company,
      },
    });
  



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
   //creating default permissions for the company users
   await Promise.all([
    //creating default permission for manager
    db.permissionForManager.create({
      data:{companyId:newCompany.id},
    }),

    db.permissionForSales.create({

      data:{companyId:newCompany.id},
    }),
    db.permissionForTechnician.create({

      data:{companyId:newCompany.id},
    }),
    db.permissionForOther.create({

      data:{companyId:newCompany.id},
    }),
   

  ])
     

    return { success: true };
  } catch (error: any) {
    console.error("Error found while creating new user");
    console.error("The error: ", error);

    return {
      // error: "A server side error occured",
      error: { message: "A server side error occured", field: "all" },
    };
  }
}
