"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { notFound } from "next/navigation";

export default function ProtectedRouteForViewInvoice({
  children,
  hasInvoice,
}: {
  children: React.ReactNode;
  hasInvoice: boolean;
}) {
  const pathname = usePathname();
  const isViewPage = pathname.includes("/estimate/view");
  if (isViewPage && !hasInvoice) {
    return notFound();
  }
  return children;
}
