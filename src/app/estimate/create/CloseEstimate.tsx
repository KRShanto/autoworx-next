"use client";
import { useEstimatePopupStore } from "@/stores/estimate-popup";

export default function Close() {
  const { close } = useEstimatePopupStore();

  return (
    <button
      className="w-fit rounded-md border-2 border-slate-400 p-1 px-5"
      onClick={close}
    >
      Cancel
    </button>
  );
}
