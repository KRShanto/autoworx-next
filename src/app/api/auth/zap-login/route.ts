import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json("Invalid token", { status: 401 });
    }

    // Check if there any company with the token
    const company = await db.company.findFirst({
      where: {
        zapierToken: token,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // return success response
    return NextResponse.json({
      type: "success",
      name: company.name,
    });
  } catch (error: any) {
    return NextResponse.json("Invalid token", { status: 401 });
  }
}
