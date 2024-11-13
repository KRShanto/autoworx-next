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

export async function getAdminInfo() {
  const totalJobs = await getTotalJobs();
  const ongoingJobs = await getOngoingJobs();
  const completedJobs = await getCompletedJobs();
  const revenue = await getRevenue();
  const expectedRevenue = await getExpectedRevenue();
  const inventory = await getInventory();

  return {
    totalJobs,
    ongoingJobs,
    completedJobs,
    revenue,
    expectedRevenue,
    inventory,
  };
}

async function getTotalJobs() {
  const companyId = await getCompanyId();

  const techniciansCount = await db.technician.count({
    where: {
      companyId,
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  const techniciansPrevMonth = await db.technician.count({
    where: {
      companyId,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  return {
    jobs: techniciansCount,
    growth: growthRate(techniciansCount, techniciansPrevMonth),
  };
}

async function getOngoingJobs() {
  const companyId = await getCompanyId();
  const ongoingJobs = await db.technician.count({
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
    ongoingJobs,
  };
}

async function getCompletedJobs() {
  const companyId = await getCompanyId();

  const completedJobs = await db.technician.count({
    where: {
      companyId,
      status: "Completed",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });
  const completedJobsPrevMonth = await db.technician.count({
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
    completedJobs,
    growth: growthRate(completedJobs, completedJobsPrevMonth),
  };
}

async function getRevenue() {
  const companyId = await getCompanyId();

  const invoices = await db.invoice.findMany({
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

  const revenue = invoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  const invoicesPrevMonth = await db.invoice.findMany({
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

  const revenuePrevMonth = invoicesPrevMonth.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  return {
    revenue,
    growth: growthRate(revenue, revenuePrevMonth),
  };
}

async function getExpectedRevenue() {
  const companyId = await getCompanyId();

  const invoices = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  const revenue = invoices.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  const invoicesPrevMonth = await db.invoice.findMany({
    where: {
      companyId,
      type: "Invoice",
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  const revenuePrevMonth = invoicesPrevMonth.reduce(
    (acc, invoice) => acc + (invoice.profit || 0),
    0,
  );

  return {
    revenue,
    growth: growthRate(revenue, revenuePrevMonth),
  };
}

async function getInventory() {
  const companyId = await getCompanyId();

  const inventory = await db.inventoryProduct.findMany({
    where: {
      type: "Product",
      companyId,
    },
  });

  const totalValue = inventory.reduce(
    (acc, product) => acc + Number(product.price),
    0,
  );

  const inventoryHistoryCurrentMonth =
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

  const inventoryHistoryPrevMonth = await db.inventoryProductHistory.findMany({
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

  const inventoryCostCurrentMonth = inventoryHistoryCurrentMonth.reduce(
    (acc, history) => acc + Number(history.price),
    0,
  );
  const inventoryCostPrevMonth = inventoryHistoryPrevMonth.reduce(
    (acc, history) => acc + Number(history.price),
    0,
  );

  return {
    totalValue,
    currentMonthTotal: inventoryCostCurrentMonth,
    growth: growthRate(inventoryCostCurrentMonth, inventoryCostPrevMonth),
  };
}
