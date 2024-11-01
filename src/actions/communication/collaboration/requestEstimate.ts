"use server";

import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";
import { customAlphabet } from "nanoid";

type TEstimateData = {
  model: string;
  year: number;
  make: string;
  serviceRequest: string;
  dueDate: string;
  notes: string;
  photoPaths: string[];
  receiverId: number;
  receiverCompanyId: number;
  senderId: number;
  senderCompanyId: number;
  messageText?: string;
};

export const requestEstimate = async (requestEstimateData: TEstimateData) => {
  try {
    // const isAlreadyExistsEstimate = await db.invoice.findFirst({
    //   where: {
    //     companyId: requestEstimateData.receiverCompanyId,
    //     type: InvoiceType.Estimate,
    //   },
    // });

    // if (!!isAlreadyExistsEstimate) {
    //   throw new Error("Estimate for this client already exists");
    // }

    await db.$transaction(async () => {
      const receiverCompanyDataFormDB = await db.company.findUnique({
        where: {
          id: requestEstimateData.receiverCompanyId,
        },
        select: {
          name: true,
        },
      });

      const clientInfo = {
        companyId: requestEstimateData.receiverCompanyId,
        firstName: receiverCompanyDataFormDB?.name!,
        lastName: "",
        fromRequest: true,
        fromRequestedCompanyId: requestEstimateData.senderCompanyId,
      };

      // create client in the db
      const client = await db.client.create({
        data: clientInfo,
      });

      const vehicleInfo = {
        model: requestEstimateData.model,
        make: requestEstimateData.make,
        year: requestEstimateData.year,
        companyId: requestEstimateData.receiverId,
        clientId: client.id,
        fromRequest: true,
        fromRequestedCompanyId: requestEstimateData.senderCompanyId,
      };

      // create vehicle in the db
      const vehicle = await db.vehicle.create({
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
      const estimate = await db.invoice.create({ data: estimateInfo });

      // create a service for estimate
      const service = await db.service.create({
        data: {
          name: requestEstimateData.serviceRequest,
          companyId: requestEstimateData.receiverCompanyId,
          fromRequest: true,
          fromRequestedCompanyId: requestEstimateData.senderCompanyId,
        },
      });

      // create invoice in db or set service id or invoice id
      await db.invoiceItem.create({
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
      const requestEstimate = await db.requestEstimate.create({
        data: requestedEstimateInfo,
      });

      await db.invoice.update({
        where: {
          id: estimate.id,
        },
        data: {
          requestEstimateId: requestEstimate.id,
        },
      });
      // create message
      const message = await db.message.create({
        data: {
          requestEstimateId: requestEstimate.id,
          from: requestEstimateData.senderId,
          to: requestEstimateData.receiverId,
          message: requestEstimateData.messageText
            ? requestEstimateData.messageText
            : "",
        },
      });

      for await (const photoPath of requestEstimateData.photoPaths) {
        await db.invoicePhoto.create({
          data: {
            invoiceId: estimate?.id,
            photo: photoPath,
          },
        });
      }
      console.log(requestEstimate, message);
    });
  } catch (err: any) {
    console.error(err);
    throw new Error(`Error: ${err.message}`);
  }
};
