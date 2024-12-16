"use server";

import { db } from "@/lib/db";
import { sendType } from "@/types/Chat";
import { InvoiceType, Prisma } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { headers } from "next/headers";

type TEstimateData = {
  model: string;
  year: number;
  make: string;
  serviceRequest: string;
  dueDate: string;
  notes: string;
  receiverId: number;
  receiverCompanyId: number;
  senderId: number;
  senderCompanyId: number;
  messageText?: string;
};

export const requestEstimate = async (
  formDataForPhoto: FormData,
  requestEstimateData: TEstimateData,
) => {
  try {
    // const isAlreadyExistsEstimate = await db.client.findFirst({
    //   where: {
    //     companyId: requestEstimateData.receiverCompanyId,
    //   },
    // });

    // if (!!isAlreadyExistsEstimate) {
    //   throw new Error("Estimate for this client already exists");
    // }

    const { requestEstimateFromDB } = await db.$transaction(async (prisma) => {
      const origin = headers().get("origin");

      const receiverCompanyDataFormDB = await prisma.company.findUnique({
        where: {
          id: requestEstimateData.receiverCompanyId,
        },
        select: {
          name: true,
        },
      });

      const senderCompanyDataFormDB = await prisma.company.findUnique({
        where: {
          id: requestEstimateData.senderCompanyId,
        },
        select: {
          name: true,
        },
      });

      const clientInfo = {
        companyId: requestEstimateData.receiverCompanyId,
        firstName: senderCompanyDataFormDB?.name!,
        lastName: "",
        fromRequest: true,
        fromRequestedCompanyId: requestEstimateData.senderCompanyId,
      };

      // if the client already exist
      let client = await prisma.client.findFirst({
        where: {
          fromRequestedCompanyId: requestEstimateData.senderCompanyId,
        },
      });
      if (!client) {
        // create client in the db
        client = await prisma.client.create({
          data: clientInfo,
        });
      }

      // console.log("Company id: ", requestEstimateData.receiverCompanyId);

      const vehicleInfo = {
        model: requestEstimateData.model,
        make: requestEstimateData.make,
        year: requestEstimateData.year,
        companyId: requestEstimateData.receiverCompanyId,
        clientId: client?.id,
        fromRequest: true,
        fromRequestedCompanyId: requestEstimateData.senderCompanyId,
      };

      console.log("Vehicle info: ", vehicleInfo);

      // create vehicle in the db
      const vehicle = await prisma.vehicle.create({
        data: vehicleInfo,
      });

      const estimateInfo = {
        id: customAlphabet("1234567890", 10)(),
        vehicleId: vehicle.id,
        userId: requestEstimateData.receiverId,
        companyId: requestEstimateData.receiverCompanyId,
        internalNotes: requestEstimateData.notes,
        type: InvoiceType.Estimate,
        fromRequest: true,
        fromRequestedCompanyId: requestEstimateData.senderCompanyId,
        clientId: client?.id,
      };

      // create a invoice estimate in db
      const estimate = await prisma.invoice.create({ data: estimateInfo });

      // create a service for estimate
      const service = await prisma.service.create({
        data: {
          name: requestEstimateData.serviceRequest,
          companyId: requestEstimateData.receiverCompanyId,
          fromRequest: true,
          fromRequestedCompanyId: requestEstimateData.senderCompanyId,
        },
      });

      // create invoice in db or set service id or invoice id
      await prisma.invoiceItem.create({
        data: {
          invoiceId: estimate.id,
          serviceId: service?.id,
        },
      });

      const requestedEstimateInfo = {
        invoiceId: estimate.id,
        senderId: requestEstimateData.senderId,
        senderCompanyId: requestEstimateData.senderCompanyId,
        receiverId: requestEstimateData.receiverId,
        receiverCompanyId: requestEstimateData.receiverCompanyId,
        serviceId: service.id,
        vehicleId: vehicle.id,
      };
      // create a new request for estimate
      const requestEstimateFromDB = await prisma.requestEstimate.create({
        data: requestedEstimateInfo,
      });

      // update invoice with request estimate id
      await prisma.invoice.update({
        where: {
          id: estimate.id,
        },
        data: {
          requestEstimateId: requestEstimateFromDB.id,
        },
      });

      //  upload image
      const photoPaths = [];
      const res = await fetch(`${origin}/api/upload`, {
        method: "POST",
        body: formDataForPhoto,
      });

      if (!res.ok) {
        console.error("Failed to upload photos");
        throw new Error("Failed to upload photos");
      }

      const json = await res.json();
      const data = json.data;

      photoPaths.push(...data);

      await Promise.all(
        photoPaths.map((photoPath) =>
          prisma.invoicePhoto.create({
            data: {
              invoiceId: estimate?.id,
              photo: photoPath,
            },
          }),
        ),
      );

      return { requestEstimateFromDB };
    });

    return { status: 200, data: { requestEstimateFromDB } };
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientUnknownRequestError ||
      err instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.log(err);
      throw new Error("something went wrong from db");
    }
    console.error(err);
    throw new Error(`Error: ${err.message}`);
  } finally {
    await db.$disconnect();
  }
};
