"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { CalendarSettings } from "@prisma/client";

const getDataForNewAppointment = async (
  clientId: number,
  vehicleId: number,
) => {
  // return await (() => {
  const user = await getUser();
  // Get all the users for the company
  const employees = await db.user.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  const settings = (await db.calendarSettings.findFirst({
    where: {
      companyId: user.companyId,
    },
  })) as CalendarSettings;

  const templates = await db.emailTemplate.findMany({
    where: {
      companyId: user.companyId,
    },
  });
  const customers = await db.client.findMany({
    where: { companyId: user.companyId },
  });

  const client = await db.client.findFirst({
    where: {
      id: clientId,
    },
  });
  const vehicle = await db.vehicle.findFirst({
    where: {
      id: vehicleId,
    },
  });
  const vehicles = await db.vehicle.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  const estimates = await db.invoice.findMany({
    where: {
      type: "Estimate",
    },
  });

  return {
    client,
    vehicle,
    vehicles,
    customers,
    estimates,
    employees,
    settings,
    templates,
  };
  // })();
};

export default getDataForNewAppointment;
