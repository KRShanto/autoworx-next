"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import {
  growthRate,
  previousMonthEnd,
  previousMonthStart,
  currentMonthEnd,
  currentMonthStart,
} from "./lib";

/**
 * Get admin information including total jobs, ongoing jobs, completed jobs, revenue, expected revenue, inventory, and employee payout.
 *
 * @returns An object containing various admin information metrics.
 */
export async function getAdminInfo() {
  const totalJobs = await getTotalJobs();
  const ongoingJobs = await getOngoingJobs();
  const completedJobs = await getCompletedJobs();
  const revenue = await getRevenue();
  const expectedRevenue = await getExpectedRevenue();
  const inventory = await getInventory();
  const employeePayout = await getEmployeePayout();

  return {
    totalJobs,
    ongoingJobs,
    completedJobs,
    revenue,
    expectedRevenue,
    inventory,
    employeePayout,
  };
}

/**
 * Get total jobs for the current and previous months.
 *
 * @returns An object containing the number of jobs and the growth rate.
 */
async function getTotalJobs() {
  const companyId = await getCompanyId();

  // Count jobs created in the current month
  const currentMonthJobs = await db.technician.count({
    where: {
      companyId,
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Count jobs created in the previous month
  const previousMonthJobs = await db.technician.count({
    where: {
      companyId,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  return {
    jobs: currentMonthJobs,
    growth: growthRate(currentMonthJobs, previousMonthJobs),
  };
}

/**
 * Get ongoing jobs for the current month.
 *
 * @returns An object containing the number of ongoing jobs.
 */
async function getOngoingJobs() {
  const companyId = await getCompanyId();

  // Count jobs that are in progress in the current month
  const ongoingJobsCount = await db.technician.count({
    where: {
      companyId,
      status: "In Progress",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  return {
    ongoingJobs: ongoingJobsCount,
  };
}

/**
 * Get completed jobs for the current and previous months.
 *
 * @returns An object containing the number of completed jobs and the growth rate.
 */
async function getCompletedJobs() {
  const companyId = await getCompanyId();

  // Count jobs completed in the current month
  const currentMonthCompletedJobs = await db.technician.count({
    where: {
      companyId,
      status: "Complete",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Count jobs completed in the previous month
  const previousMonthCompletedJobs = await db.technician.count({
    where: {
      companyId,
      status: "Complete",
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  return {
    completedJobs: currentMonthCompletedJobs,
    growth: growthRate(currentMonthCompletedJobs, previousMonthCompletedJobs),
  };
}

/**
 * Get revenue for the current and previous months.
 *
 * @returns An object containing the revenue and the growth rate.
 */
async function getRevenue() {
  const companyId = await getCompanyId();

  // Find invoices delivered in the current month
  const currentMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      column: {
        title: "Delivered",
      },
      type: "Invoice",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Calculate total revenue for the current month
  const currentMonthRevenue = currentMonthInvoices.reduce(
    (acc, invoice) => acc + Number(invoice.grandTotal || 0),
    0,
  );

  // Find invoices delivered in the previous month
  const previousMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      column: {
        title: "Delivered",
      },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  // Calculate total revenue for the previous month
  const previousMonthRevenue = previousMonthInvoices.reduce(
    (acc, invoice) => acc + (Number(invoice.grandTotal) || 0),
    0,
  );

  return {
    revenue: currentMonthRevenue,
    growth: growthRate(currentMonthRevenue, previousMonthRevenue),
  };
}

/**
 * Get expected revenue for the current and previous months.
 *
 * @returns An object containing the expected revenue and the growth rate.
 */
async function getExpectedRevenue() {
  const companyId = await getCompanyId();

  // Find invoices not delivered in the current month
  const currentMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      column: {
        title: {
          not: "Delivered",
        },
      },
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Calculate expected revenue for the current month
  const currentMonthExpectedRevenue = currentMonthInvoices.reduce(
    (acc, invoice) => acc + (Number(invoice.grandTotal) || 0),
    0,
  );

  // Find invoices not delivered in the previous month
  const previousMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      column: {
        title: {
          not: "Delivered",
        },
      },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  // Calculate expected revenue for the previous month
  const previousMonthExpectedRevenue = previousMonthInvoices.reduce(
    (acc, invoice) => acc + (Number(invoice.grandTotal) || 0),
    0,
  );

  return {
    revenue: currentMonthExpectedRevenue,
    growth: growthRate(
      currentMonthExpectedRevenue,
      previousMonthExpectedRevenue,
    ),
  };
}

/**
 * Get inventory information including total value, current month total, and growth rate.
 *
 * @returns An object containing the total inventory value, current month total, and growth rate.
 */
async function getInventory() {
  const companyId = await getCompanyId();

  // Find all inventory products
  const inventoryProducts = await db.inventoryProduct.findMany({
    where: {
      type: "Product",
      companyId,
    },
  });

  // Calculate total inventory value
  const totalInventoryValue = inventoryProducts.reduce(
    (acc, product) => acc + Number(product.price) * (product.quantity || 0),
    0,
  );

  // Find inventory purchases in the current month
  const currentMonthInventoryHistory =
    await db.inventoryProductHistory.findMany({
      where: {
        companyId,
        type: "Purchase",
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        product: {
          type: "Product",
        },
      },
    });

  // Find inventory purchases in the previous month
  const previousMonthInventoryHistory =
    await db.inventoryProductHistory.findMany({
      where: {
        companyId,
        type: "Purchase",
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
        product: {
          type: "Product",
        },
      },
    });

  // Calculate total inventory cost for the current month
  const currentMonthInventoryCost = currentMonthInventoryHistory.reduce(
    (acc, history) => acc + Number(history.price || 0) * history.quantity,
    0,
  );

  // Calculate total inventory cost for the previous month
  const previousMonthInventoryCost = previousMonthInventoryHistory.reduce(
    (acc, history) => acc + Number(history.price) * history.quantity,
    0,
  );

  return {
    totalValue: totalInventoryValue,
    currentMonthTotal: currentMonthInventoryCost,
    growth: growthRate(currentMonthInventoryCost, previousMonthInventoryCost),
  };
}

/**
 * Get employee payout information for the current and previous months.
 *
 * @returns An object containing the current month total payout and the growth rate.
 */
async function getEmployeePayout() {
  const companyId = await getCompanyId();

  // Find completed jobs for the current month
  const currentMonthPayout = await db.technician.findMany({
    where: {
      companyId,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
      status: "Complete",
    },
  });

  // Find completed jobs for the previous month
  const previousMonthPayout = await db.technician.findMany({
    where: {
      companyId,
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
      status: "Complete",
    },
  });

  // Calculate total payout for the current month
  const currentMonthPayoutTotal = currentMonthPayout.reduce(
    (acc, technician) => acc + Number(technician.amount),
    0,
  );

  // Calculate total payout for the previous month
  const previousMonthPayoutTotal = previousMonthPayout.reduce(
    (acc, technician) => acc + Number(technician.amount),
    0,
  );

  return {
    currentMonthTotal: currentMonthPayoutTotal,
    growth: growthRate(currentMonthPayoutTotal, previousMonthPayoutTotal),
  };
}
