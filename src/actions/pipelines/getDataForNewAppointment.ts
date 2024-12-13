"use server";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { CalendarSettings } from "@prisma/client";

/**
 * Fetch data required for creating a new appointment.
 * @param clientId - The ID of the client.
 * @param vehicleId - The ID of the vehicle.
 * @returns An object containing client, vehicle, employees, settings, templates, and other related data.
 */
const getDataForNewAppointment = async (
  clientId: number,
  vehicleId: number,
) => {
  const user = await getUser();

  // Get all the users for the company
  const employees = await db.user.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  // Get calendar settings for the company
  const settings = (await db.calendarSettings.findFirst({
    where: {
      companyId: user.companyId,
    },
  })) as CalendarSettings;

  // Get email templates for the company
  const templates = await db.emailTemplate.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  // Get all customers for the company
  const customers = await db.client.findMany({
    where: { companyId: user.companyId },
  });

  // Get the specific client
  const client = await db.client.findFirst({
    where: {
      id: clientId,
    },
  });

  // Get the specific vehicle
  const vehicle = await db.vehicle.findFirst({
    where: {
      id: vehicleId,
    },
  });

  // Get all vehicles for the company
  const vehicles = await db.vehicle.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  // Get all estimates
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
};

export default getDataForNewAppointment;
