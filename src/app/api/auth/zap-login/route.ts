import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// const user = { username: "admin", password: "admin123" };

export async function POST(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const password = request.nextUrl.searchParams.get("password");

    // check if email and password is provided
    if (!email || !password) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // check if the email is present in the database
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // match the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // return success response
    return NextResponse.json({
      type: "success",
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  } catch (error: any) {
    // check if this is json parse error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
  }
}
