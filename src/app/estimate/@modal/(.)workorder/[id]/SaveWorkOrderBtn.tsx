"use client";

import { useRouter } from "next/navigation";

export default function SaveWorkOrderBtn() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white"
    >
      Save Work Order
    </button>
  );
}
