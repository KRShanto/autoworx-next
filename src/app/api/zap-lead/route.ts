import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("X-TOKEN");

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

    // take data from the body
    const body = await request.json();

    console.log("Body: ", body);

    const clientFirstName = body.first_name;
    const clientLastName = body.last_name;
    const clientEmail = body.email;
    const clientPhone = body.phone;
    const customerCountry = body.customer_country;
    const oppurtunity = body.oppurtunity_source;

    // now extract the source, services and vehicle info from opportunity
    // the format is this: (source) vehicle | service
    const source = oppurtunity.split(")")[0].replace("(", "").trim();
    const vehicleInfo = oppurtunity.split(")")[1].split("|")[0].trim();
    const services = oppurtunity.split(")")[1].split("|")[1].trim();

    console.log("clientName", clientFirstName + " " + clientLastName);
    console.log("clientEmail", clientEmail);
    console.log("clientPhone", clientPhone);
    console.log("vehicleInfo", vehicleInfo);
    console.log("services", services);
    console.log("source", source);
    console.log("oppurtunity", oppurtunity);

    // check if the required fields are provided
    if (!clientFirstName || !vehicleInfo || !services || !source) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Save the leads
    const newLead = await db.lead.create({
      data: {
        clientName: clientFirstName + " " + clientLastName,
        clientEmail,
        clientPhone,        
        vehicleInfo,
        services,
        source,
        companyId: company.id,
      },
    });

    // return success response
    return Response.json(
      {
        id: newLead.id,
        first_name: clientFirstName,
        last_name: clientLastName,
        email: clientEmail,
        phone: clientPhone,
        customer_country: customerCountry,
        oppurtunity_source: oppurtunity,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.log("Server Error: ", error);

    // check if this is json parse error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    } else {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}
