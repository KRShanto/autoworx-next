"use client";

import {
  HiChatBubbleOvalLeftEllipsis,
  HiMiniArrowUpTray,
  HiPrinter,
  HiTrash,
} from "react-icons/hi2";
import { cn } from "@/lib/cn";

const btnCN = cn(
  "flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 hover:bg-slate-200",
);

export function CreateEstimateActionsButtons() {
  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <button className={btnCN}>
        <HiChatBubbleOvalLeftEllipsis />
        Message
      </button>
      <button className={btnCN}>
        <HiPrinter />
        Print
      </button>
      <button className={btnCN}>
        <HiMiniArrowUpTray /> Share
      </button>
      <button
        className={cn(btnCN, "bg-red-400 text-white hover:bg-red-500")}
        aria-label="Delete"
      >
        <HiTrash />
      </button>
    </div>
  );
}
