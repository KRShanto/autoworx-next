"use server";

import { db } from "@/lib/db";
import { getCompany } from "../settings/getCompany";
import moment from "moment";

export async function getPerformanceInfo(id: number) {
  const company = await getCompany();

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

  if (!user) throw new Error("User not found");

  // Calculate the average time to complete a job
  const totalJobs = user.Technician.length;
  const totalJobTime = user.Technician.reduce((acc, job) => {
    const date = moment(job.date);
    const dateClosed = moment(job.dateClosed);
    const duration = moment.duration(dateClosed.diff(date));
    return acc + duration.asHours();
  }, 0);
  const averageJobTime = totalJobTime / totalJobs;

  // Calculate the total redo work
  const totalRedoWork = user.Technician.reduce((acc, job) => {
    return acc + job.InvoiceRedo.length;
  }, 0);

  const returnWorkRate = (totalRedoWork / totalJobs) * 100;

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

  console.log(
    "Total Jobs Completed On Time By Category: ",
    totalJobsCompletedOnTimeByCategory,
  );
  console.log(
    "Total Jobs Completed Late By Category: ",
    totalJobsCompletedLateByCategory,
  );

  return {
    averageJobTime,
    returnWorkRate,
    totalJobs: totalJobsByCategory,
    totalJobsCompletedOnTime: totalJobsCompletedOnTimeByCategory,
    totalJobsCompletedLate: totalJobsCompletedLateByCategory,
  };
}
