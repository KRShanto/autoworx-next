"use server";

import { auth } from "@/app/auth";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import {
  currentMonthEnd,
  currentMonthStart,
  growthRate,
  previousMonthEnd,
  previousMonthStart,
} from "./lib";

/**
 * Get technician information including performance, monthly payout, and current projects.
 *
 * @returns An object containing various technician information metrics.
 */
export async function getTechnicianInfo() {
  const performance = await getPerformance();
  const monthlyPayout = await getMonthlyPayout();
  const currentProjects = await getCurrentProjects();

  return {
    performance,
    monthlyPayout,
    currentProjects,
  };
}

/**
 * Get current projects for the technician.
 *
 * @returns An array of current projects with details.
 */
export interface CurrentProject {
  id: string;
  services: {
    name: string | undefined;
    due: Date | null;
  }[];
  yearMakeModel: string;
  totalPayout: number;
}

async function getCurrentProjects() {
  const { companyId, userId } = await getEssentials();

  // Get all invoices where the technician is the current user and the status is "In Progress"
  const invoices = await db.invoice.findMany({
    where: {
      companyId,
      technician: {
        some: {
          userId,
          status: "In Progress",
        },
      },
    },
    include: {
      technician: {
        include: {
          service: true,
        },
      },
      vehicle: true,
    },
  });

  // Map invoices to projects where the technician is the current user
  const projects = invoices.map((invoice) => {
    const technicians = invoice.technician.filter(
      (technician) => technician.userId === userId,
    );

    const totalPayout = technicians.reduce(
      (acc, technician) => acc + Number(technician.amount),
      0,
    );

    return {
      id: invoice.id,
      services: technicians.map((technician) => ({
        name: technician.service?.name,
        due: technician.due,
      })),
      yearMakeModel: `${invoice.vehicle?.year} ${invoice.vehicle?.make} ${invoice.vehicle?.model}`,
      totalPayout,
    };
  });

  return projects;
}

/**
 * Get performance metrics for the technician.
 *
 * @returns An object containing performance metrics such as total jobs, on-time completion rate, and redo jobs.
 */
async function getPerformance() {
  const { userId } = await getEssentials();

  // Get all jobs for the current month
  const currentMonthJobs = await db.technician.findMany({
    where: {
      userId,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Calculate on-time completion rate for the current month
  const onTimeJobs = currentMonthJobs.filter(
    (job) => job.status === "Completed" && job.dateClosed! <= job.due!,
  );
  const onTimeCompletionRate = onTimeJobs.length / currentMonthJobs.length;

  // Get all jobs for the previous month
  const previousMonthJobs = await db.technician.findMany({
    where: {
      userId,
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  // Calculate on-time completion rate for the previous month
  const previousOnTimeJobs = previousMonthJobs.filter(
    (job) => job.status === "Completed" && job.dateClosed! <= job.due!,
  );
  const previousOnTimeCompletionRate =
    previousOnTimeJobs.length / previousMonthJobs.length;

  // Get redo jobs for the current and previous months
  const currentMonthRedoJobs = await db.invoiceRedo.count({
    where: {
      technicianId: userId,
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  const previousMonthRedoJobs = await db.invoiceRedo.count({
    where: {
      technicianId: userId,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  return {
    totalJobs: {
      count: currentMonthJobs.length,
      growth: growthRate(currentMonthJobs.length, previousMonthJobs.length),
    },
    onTimeCompletionRate: {
      rate: onTimeCompletionRate,
      growth: growthRate(onTimeCompletionRate, previousOnTimeCompletionRate),
    },
    redoJobs: {
      count: currentMonthRedoJobs,
      growth: growthRate(currentMonthRedoJobs, previousMonthRedoJobs),
    },
  };
}

/**
 * Get monthly payout for the technician.
 *
 * @returns An object containing the total payout, pending payout, and growth rate.
 */
async function getMonthlyPayout() {
  const { userId } = await getEssentials();

  // Get completed jobs for the current month
  const completedJobs = await db.technician.findMany({
    where: {
      userId,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
      status: "Complete",
    },
  });

  const totalPayout = completedJobs.reduce(
    (acc, job) => acc + Number(job.amount),
    0,
  );

  // Get pending jobs for the current month
  const pendingJobs = await db.technician.findMany({
    where: {
      userId,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
      status: {
        notIn: ["Complete", "Cancel"],
      },
    },
  });

  const pendingPayout = pendingJobs.reduce(
    (acc, job) => acc + Number(job.amount),
    0,
  );

  // Get completed jobs for the previous month
  const previousMonthCompletedJobs = await db.technician.findMany({
    where: {
      userId,
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
      status: "Complete",
    },
  });

  const previousTotalPayout = previousMonthCompletedJobs.reduce(
    (acc, job) => acc + Number(job.amount),
    0,
  );

  return {
    totalPayout,
    pendingPayout,
    growth: growthRate(totalPayout, previousTotalPayout),
  };
}

/**
 * Get essential information including companyId and userId.
 *
 * @returns An object containing the companyId and userId.
 */
async function getEssentials() {
  const companyId = await getCompanyId();
  const session = await auth();
  const userId = Number(session?.user?.id as string);

  return {
    companyId,
    userId,
  };
}
