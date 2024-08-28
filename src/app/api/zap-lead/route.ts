import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const password = request.nextUrl.searchParams.get("password");
    const clientName = request.nextUrl.searchParams.get("client_name") || "";
    const clientEmail = request.nextUrl.searchParams.get("client_email") || "";
    const clientPhone = request.nextUrl.searchParams.get("client_phone") || "";
    const vehicleInfo = request.nextUrl.searchParams.get("vehicle_info") || "";
    const services = request.nextUrl.searchParams.get("services") || "";
    const source = request.nextUrl.searchParams.get("source") || "";
    const comments = request.nextUrl.searchParams.get("comments") || "";

    console.log("email", email);
    console.log("password", password);
    console.log("clientName", clientName);
    console.log("clientEmail", clientEmail);
    console.log("clientPhone", clientPhone);
    console.log("vehicleInfo", vehicleInfo);
    console.log("services", services);
    console.log("source", source);
    console.log("comments", comments);

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

    // check if the required fields are provided
    if (!clientName || !vehicleInfo || !services || !source) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Save the leads
    const newLead = await db.lead.create({
      data: {
        clientName,
        vehicleInfo,
        services,
        source,
        comments,
        userId: user.id,
        companyId: user.companyId,
      },
    });

    // return success response
    return Response.json(
      [
        {
          id: newLead.id,
          clientName: newLead.clientName,
          vehicleInfo: newLead.vehicleInfo,
          services: newLead.services,
          source: newLead.source,
          comments: newLead.comments,
        },
      ],
      { status: 201 },
    );
  } catch (error: any) {
    // check if this is json parse error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
  }
}
