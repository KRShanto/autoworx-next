"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { CalendarSettings } from "@prisma/client";

const getDataForNewAppointment = async (clientId: number) => {
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

  const client = await db.client.findFirst({
    where: {
      id: clientId,
    },
  });
  // const vehicle = await db.vehicle.findFirst({
  //   where: {
  //     id: vehicleId,
  //   },
  // });

  return { client, employees, settings, templates };
  // })();
};

export default getDataForNewAppointment;
