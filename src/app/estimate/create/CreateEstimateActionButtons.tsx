"use client";

import { cn } from "@/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import DeleteEstimateButton from "./DeleteEstimateButton";

const btnCN = cn(
  "flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 hover:bg-slate-200",
);

export function CreateEstimateActionsButtons() {
  const clientId = useSearchParams().get("clientId");
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <button
        onClick={() => {
          if (clientId) {
            router.push(`/communication/client?clientId=${clientId}`);
          }
        }}
        className={btnCN}
      >
        <HiChatBubbleOvalLeftEllipsis />
        Message
      </button>
      <DeleteEstimateButton />
    </div>
  );
}
