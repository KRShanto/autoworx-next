export const defaultSalesColumn = [
  {
    title: "New Leads",
    type: "sales",
    order: 0,
    bgColor: "#E3F2FD", // Light Blue Background
    textColor: "#0D47A1", // Dark Blue Text
  },
  {
    title: "Leads Generated",
    type: "sales",
    order: 1,
    bgColor: "#BBDEFB", // Blue Background
    textColor: "#1976D2", // Medium Blue Text
  },
  {
    title: "Follow-up",
    type: "sales",
    order: 2,
    bgColor: "#C8E6C9", // Light Green Background
    textColor: "#2E7D32", // Dark Green Text
  },
  {
    title: "Estimates Created",
    type: "sales",
    order: 3,
    bgColor: "#FFECB3", // Light Amber Background
    textColor: "#FFA000", // Amber Text
  },
  {
    title: "Archived",
    type: "sales",
    order: 4,
    bgColor: "#CFD8DC", // Light Grey Background
    textColor: "#37474F", // Dark Grey Text
  },
  {
    title: "Converted",
    type: "sales",
    order: 5,
    bgColor: "#D1C4E9", // Light Purple Background
    textColor: "#512DA8", // Purple Text
  },
];

export const defaultShopColumn = [
  {
    title: "Pending",
    type: "shop",
    order: 0,
    bgColor: "#FFF9C4", // Light Yellow Background
    textColor: "#F57F17", // Dark Yellow Text
  },
  {
    title: "In Progress",
    type: "shop",
    order: 1,
    bgColor: "#BBDEFB", // Light Blue Background
    textColor: "#1565C0", // Blue Text
  },
  {
    title: "Completed",
    type: "shop",
    order: 2,
    bgColor: "#C8E6C9", // Light Green Background
    textColor: "#2E7D32", // Dark Green Text
  },

  {
    title: "Re-Dos",
    type: "shop",
    order: 3,
    bgColor: "#FFE0B2", // Light Orange Background
    textColor: "#EF6C00", // Orange Text
  },
  {
    title: "Cancelled",
    type: "shop",
    order: 4,
    bgColor: "#FFCDD2", // Light Red Background
    textColor: "#C62828", // Red Text
  },
];
function createColumnWithColor() {
  return [...defaultSalesColumn, ...defaultShopColumn];
}

export const defaultColumnWithColor = createColumnWithColor();
