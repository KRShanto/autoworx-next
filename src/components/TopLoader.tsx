"use client";

import { usePathname, useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { useEffect } from "react";
import NextTopLoader from "nextjs-toploader";

// NOTE: Currently, nextjs-toploader doesn't work as expected in next.js 14.0.3
// Thats why we use nprogress here
export default function TopLoader() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname, router]);

  return <NextTopLoader color="cyan" height={4} showSpinner={false} />;
}
