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
 * Get admin information including total jobs, ongoing jobs, completed jobs, revenue, expected revenue, and inventory.
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
 */
async function getTotalJobs() {
  const companyId = await getCompanyId();

  const currentMonthJobs = await db.technician.count({
    where: {
      companyId,
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

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
 */
async function getOngoingJobs() {
  const companyId = await getCompanyId();

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
 */
async function getCompletedJobs() {
  const companyId = await getCompanyId();

  const currentMonthCompletedJobs = await db.technician.count({
    where: {
      companyId,
      status: "Completed",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  const previousMonthCompletedJobs = await db.technician.count({
    where: {
      companyId,
      status: "Completed",
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
 */
async function getRevenue() {
  const companyId = await getCompanyId();

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

  const currentMonthRevenue = currentMonthInvoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

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

  const previousMonthRevenue = previousMonthInvoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  return {
    revenue: currentMonthRevenue,
    growth: growthRate(currentMonthRevenue, previousMonthRevenue),
  };
}

/**
 * Get expected revenue for the current and previous months.
 */
async function getExpectedRevenue() {
  const companyId = await getCompanyId();

  const currentMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  const currentMonthExpectedRevenue = currentMonthInvoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  const previousMonthInvoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  const previousMonthExpectedRevenue = previousMonthInvoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
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
 */
async function getInventory() {
  const companyId = await getCompanyId();

  const inventoryProducts = await db.inventoryProduct.findMany({
    where: {
      type: "Product",
      companyId,
    },
  });

  const totalInventoryValue = inventoryProducts.reduce(
    (acc, product) => acc + Number(product.price),
    0,
  );

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

  const currentMonthInventoryCost = currentMonthInventoryHistory.reduce(
    (acc, history) => acc + Number(history.price),
    0,
  );

  const previousMonthInventoryCost = previousMonthInventoryHistory.reduce(
    (acc, history) => acc + Number(history.price),
    0,
  );

  return {
    totalValue: totalInventoryValue,
    currentMonthTotal: currentMonthInventoryCost,
    growth: growthRate(currentMonthInventoryCost, previousMonthInventoryCost),
  };
}

async function getEmployeePayout() {
  const companyId = await getCompanyId();

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

  const currentMonthPayoutTotal = currentMonthPayout.reduce(
    (acc, technician) => acc + Number(technician.amount),
    0,
  );

  const previousMonthPayoutTotal = previousMonthPayout.reduce(
    (acc, technician) => acc + Number(technician.amount),
    0,
  );

  return {
    currentMonthTotal: currentMonthPayoutTotal,
    growth: growthRate(currentMonthPayoutTotal, previousMonthPayoutTotal),
  };
}
