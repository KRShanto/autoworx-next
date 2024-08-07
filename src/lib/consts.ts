export const MIN_PASSWORD_LENGTH = 6;

export const TASK_COLOR = {
  Low: "#6571FF",
  Medium: "#25AADD",
  High: "#006D77",
};

export const INVOICE_TAGS = [
  {
    title: "Order Material",
    name: "order",
  },
  {
    title: "Get Deposit",
    name: "deposit",
  },
  {
    title: "Send Invoice",
    name: "send",
  },
  {
    title: "Part Procurement",
    name: "procurement",
  },
  {
    title: "Schedule for Followup",
    name: "schedule",
  },
];

export const INVOICE_COLORS: { textColor: string; bgColor: string }[] = [
  { textColor: "#EB9D0B", bgColor: "#FFE7BA" },
  { textColor: "#38D3CF", bgColor: "#CBFFFD" },
  { textColor: "#C13232", bgColor: "#FFACAC" },
  { textColor: "#5860BA", bgColor: "#DADDFF" },
  { textColor: "#59B24A", bgColor: "#CAEBC5" },
  { textColor: "#C77B35", bgColor: "#FFD1A6" },
  { textColor: "#B156C0", bgColor: "#FAD9FF" },
  { textColor: "#9B446E", bgColor: "#FFDAEC" },
];

export const WORK_ORDER_STATUS_COLOR: { [key: string]: string } = {
  "In Progress": "#007BFF",
  Pending: "#FFC107",
  Complete: "#28A745",
  Cancel: "#DC3545",
};
