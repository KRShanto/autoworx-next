import {
  NO_ACCESS_FOR_DYNAMIC_ROUTES,
  NO_ACCESS_FOR_SETTINGS_ROUTES,
  NO_ACCESS_ROUTES,
} from "@/lib/routes";
import { Session } from "next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { parse } from "regexparam";

type TProps = {
  children: React.ReactNode;
  session: (Session & { user: { employeeType: string } }) | null;
};

export default function PrivateRoute({ children, session }: TProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authUser = session?.user;
  const router = useRouter();

  const params = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const actualUrl = `${pathname}${params}`;

  //   @ts-ignore
  const notAccessRoute = NO_ACCESS_ROUTES[actualUrl];
  console.log({ notAccessRoute });

  const noAccessForDynamicRoute = NO_ACCESS_FOR_DYNAMIC_ROUTES.find((route) => {
    //   @ts-ignore
    const result = parse(route.path);
    const match = result.pattern.test(pathname);
    return match;
  });
  console.log({ noAccessForDynamicRoute });
  //   @ts-ignore
  const notAccessForSettings = NO_ACCESS_FOR_SETTINGS_ROUTES[actualUrl];
  console.log({ notAccessForSettings });

  if (
    notAccessRoute?.notAccess?.includes(authUser?.employeeType) ||
    // @ts-ignore
    noAccessForDynamicRoute?.notAccess?.includes(authUser?.employeeType) ||
    notAccessForSettings?.notAccess.includes(authUser?.employeeType)
  ) {
    router.push("/404");
    return null;
  } else {
    return children;
  }
}
