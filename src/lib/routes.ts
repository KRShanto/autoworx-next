import { EmployeeType } from "@prisma/client";

const ROLES = {
  ADMIN: EmployeeType.Admin,
  MANAGER: EmployeeType.Manager,
  SALES: EmployeeType.Sales,
  TECHNICIAN: EmployeeType.Technician,
  OTHER: EmployeeType.Other,
};

export const NO_ACCESS_ROUTES = {
  //* communication page
  "/communication/client": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/communication/collaboration": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  //* payment page
  "/payments": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  //* inventory page
  "/inventory?view=products": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/inventory?view=supplies": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/inventory?view=procurement": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  //* shop pipeline page
  "/pipeline/shop": {
    notAccess: [ROLES.SALES, ROLES.OTHER],
  },
  "/pipeline/shop?view=workOrders": {
    notAccess: [ROLES.SALES, ROLES.OTHER],
  },
  "/pipeline/shop?view=pipelines": {
    notAccess: [ROLES.SALES, ROLES.OTHER],
  },
  //* sales pipeline page
  "/pipeline/sales": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/pipeline/sales?view=pipelines": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/pipeline/sales?view=workOrders": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  // * client page

  "/client": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  //* employee page
  "/employee": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  // * estimate and invoice
  "/estimate": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/estimate/create": {
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
};

export const NO_ACCESS_FOR_DYNAMIC_ROUTES = [
  {
    path: "/estimate/view/:id",
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
  {
    path: "/estimate/edit/:id",
    notAccess: [ROLES.TECHNICIAN, ROLES.OTHER],
  },
];

export const NO_ACCESS_FOR_SETTINGS_ROUTES = {
  "/settings/business": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/networks": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/billing": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/team-management": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/payments": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/calendar": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/estimates": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/communications": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
  "/settings/security": {
    notAccess: [ROLES.SALES, ROLES.TECHNICIAN, ROLES.OTHER],
  },
};
