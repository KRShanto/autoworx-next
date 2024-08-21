"use client";

import {
  HiChatBubbleOvalLeftEllipsis,
  HiMiniArrowUpTray,
  HiPrinter,
} from "react-icons/hi2";
import { cn } from "@/lib/cn";
import DeleteEstimateButton from "./DeleteEstimateButton";

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
      <DeleteEstimateButton />
    </div>
  );
}
