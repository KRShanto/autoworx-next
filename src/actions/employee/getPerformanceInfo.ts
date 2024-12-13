"use server";

import { db } from "@/lib/db";
import { getCompany } from "../settings/getCompany";
import moment from "moment";

/**
 * Get performance information for a technician.
 *
 * @param id - The ID of the technician.
 * @returns An object containing various performance metrics.
 */
export async function getPerformanceInfo(id: number) {
  // Fetch company information
  const company = await getCompany();

  // Fetch user information along with related data
  const user = await db.user.findUnique({
    where: { id },
    include: {
      Technician: {
        include: {
          invoice: {
            include: {
              client: true,
              vehicle: true,
              invoiceItems: {
                include: {
                  service: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
          InvoiceRedo: true,
        },
      },
      ClockInOut: {
        include: {
          ClockBreak: true,
        },
      },
      LeaveRequest: true,
    },
  });

  // Throw an error if user is not found
  if (!user) throw new Error("User not found");

  // Calculate the average time to complete a job
  const totalJobs = user.Technician.filter(
    (job) => job.status === "Complete",
  ).length;
  const totalJobTime = user.Technician.filter(
    (job) => job.status === "Complete",
  ).reduce((acc, job) => {
    const date = moment(job.date, moment.ISO_8601);
    const dateClosed = moment(job.dateClosed, moment.ISO_8601);
    const duration = moment.duration(dateClosed.diff(date));
    return acc + duration.asHours();
  }, 0);
  const averageJobTime = totalJobs > 0 ? totalJobTime / totalJobs : 0;

  // Calculate the average time to complete a job (for previous month)
  const totalJobsPreviousMonth = user.Technician.filter(
    (job) =>
      job.status === "Complete" &&
      moment(job.date).isSame(moment().subtract(1, "month"), "month"),
  ).length;
  const totalJobTimePreviousMonth = user.Technician.filter(
    (job) =>
      job.status === "Complete" &&
      moment(job.date).isSame(moment().subtract(1, "month"), "month"),
  ).reduce((acc, job) => {
    const date = moment(job.date, moment.ISO_8601);
    const dateClosed = moment(job.dateClosed, moment.ISO_8601);
    const duration = moment.duration(dateClosed.diff(date));
    return acc + duration.asHours();
  }, 0);
  const averageJobTimePreviousMonth =
    totalJobsPreviousMonth > 0
      ? totalJobTimePreviousMonth / totalJobsPreviousMonth
      : 0;

  // Calculate the growth rate of the average time to complete a job
  const averageJobTimeGrowthRate =
    averageJobTimePreviousMonth > 0
      ? ((averageJobTime - averageJobTimePreviousMonth) /
          averageJobTimePreviousMonth) *
        100
      : averageJobTime > 0
        ? 100
        : 0;

  // Get the total number of completed jobs (for this month)
  const totalCompletedJobs = user.Technician.filter(
    (job) =>
      job.status === "Complete" && moment(job.date).isSame(moment(), "month"),
  ).length;
  // Calculate the total redo work  (for this month)
  const totalRedoWork = user.Technician.reduce((acc, job) => {
    return (
      acc +
      job.InvoiceRedo.filter((redo) =>
        moment(redo.createdAt).isSame(moment(), "month"),
      ).length
    );
  }, 0);

  const returnWorkRate = (totalRedoWork / totalCompletedJobs) * 100;

  // Get the total number of completed jobs (for previous month)
  const totalCompletedJobsPreviousMonth = user.Technician.filter(
    (job) =>
      job.status === "Complete" &&
      moment(job.date).isSame(moment().subtract(1, "month"), "month"),
  ).length;
  // Calculate the total redo work (for previous month)
  const totalRedoWorkPreviousMonth = user.Technician.reduce((acc, job) => {
    return (
      acc +
      job.InvoiceRedo.filter((redo) =>
        moment(redo.createdAt).isSame(moment().subtract(1, "month"), "month"),
      ).length
    );
  }, 0);

  // Calculate the return work rate for the previous month
  const returnWorkRatePreviousMonth =
    totalCompletedJobsPreviousMonth > 0
      ? (totalRedoWorkPreviousMonth / totalCompletedJobsPreviousMonth) * 100
      : 0;

  // Calculate the growth rate of the return work rate
  const returnWorkRateGrowthRate =
    returnWorkRatePreviousMonth > 0
      ? ((returnWorkRate - returnWorkRatePreviousMonth) /
          returnWorkRatePreviousMonth) *
        100
      : returnWorkRate > 0
        ? 100
        : 0;

  // Calculate the total number of jobs assigned based on the category
  const totalJobsByCategory = Object.entries(
    user.Technician.reduce((acc: { [key: string]: number }, job) => {
      job.invoice?.invoiceItems.forEach((item) => {
        const categoryName = item.service?.category?.name || "Uncategorized";
        acc[categoryName] = (acc[categoryName] || 0) + 1;
      });
      return acc;
    }, {}),
  ).map(([categoryName, count]) => ({ categoryName, count }));

  // Total number of jobs completed on time by category
  const totalJobsCompletedOnTimeByCategory = Object.entries(
    user.Technician.reduce((acc: { [key: string]: number }, job) => {
      job.invoice?.invoiceItems.forEach((item) => {
        const categoryName = item.service?.category?.name || "Uncategorized";
        const dateClosed = moment(job.dateClosed);
        const due = moment(job.due);
        if (dateClosed.isSameOrBefore(due)) {
          acc[categoryName] = (acc[categoryName] || 0) + 1;
        }
      });
      return acc;
    }, {}),
  ).map(([categoryName, count]) => ({ categoryName, count }));

  // Total number of jobs completed late by category
  const totalJobsCompletedLateByCategory = Object.entries(
    user.Technician.reduce((acc: { [key: string]: number }, job) => {
      job.invoice?.invoiceItems.forEach((item) => {
        const categoryName = item.service?.category?.name || "Uncategorized";
        const dateClosed = moment(job.dateClosed);
        const due = moment(job.due);
        if (dateClosed.isAfter(due)) {
          acc[categoryName] = (acc[categoryName] || 0) + 1;
        }
      });
      return acc;
    }, {}),
  ).map(([categoryName, count]) => ({ categoryName, count }));

  // Return the calculated performance metrics
  return {
    averageJobTime,
    averageJobTimeGrowthRate,
    returnWorkRate,
    returnWorkRateGrowthRate,
    totalJobs: totalJobsByCategory,
    totalJobsCompletedOnTime: totalJobsCompletedOnTimeByCategory,
    totalJobsCompletedLate: totalJobsCompletedLateByCategory,
  };
}
