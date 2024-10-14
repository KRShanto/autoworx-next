import NextAuth, { NextAuthConfig } from "next-auth";
import { authConfig } from "./app/auth.config";
import { NextAuthRequest } from "node_modules/next-auth/lib";
import {
  NO_ACCESS_FOR_DYNAMIC_ROUTES,
  NO_ACCESS_FOR_SETTINGS_ROUTES,
  NO_ACCESS_ROUTES,
} from "./lib/routes";

import { NextResponse, URLPattern } from "next/server";

let cache = new Map();

const { auth } = NextAuth(authConfig as NextAuthConfig);

// This function can be marked `async` if using `await` inside
export default auth(async (request: NextAuthRequest) => {
  const { nextUrl } = request;
  const auth = request.auth;
  const origin = request.nextUrl.origin;

  const cachedUser = cache.get(auth?.user?.email);

  const actualUrl = nextUrl.href.replace(origin, "");

  //@ts-ignore
  const notAccessRoute = NO_ACCESS_ROUTES[actualUrl];

  const noAccessForDynamicRoute = NO_ACCESS_FOR_DYNAMIC_ROUTES.find((route) => {
    const pattern = new URLPattern(route.path, origin);
    const result = pattern.exec(nextUrl.pathname, origin);
    return result;
  });

  //@ts-ignore
  const notAccessForSettings = NO_ACCESS_FOR_SETTINGS_ROUTES[actualUrl];
  const notFoundUrl = new URL("/404", request.url);

  if (cachedUser && cachedUser.expires > Date.now()) {
    if (
      notAccessRoute?.notAccess?.includes(cachedUser.employeeType) ||
      noAccessForDynamicRoute?.notAccess?.includes(cachedUser.employeeType) ||
      notAccessForSettings?.notAccess.includes(cachedUser.employeeType)
    ) {
      return NextResponse.rewrite(notFoundUrl, { status: 404 });
    } else {
      return NextResponse.next();
    }
  }

  if (auth?.user?.email) {
    cache.delete(auth?.user?.email);
    const url = `${origin}/api/auth/user/${auth?.user?.email}`;
    const response = await fetch(url);
    const user = await response.json();
    if (user.status === 200) {
      cache.set(auth?.user?.email, {
        ...user.data,
        expires: Date.now() + 60 * 1000,
      });

      if (
        notAccessRoute?.notAccess?.includes(user.data.employeeType) ||
        noAccessForDynamicRoute?.notAccess?.includes(user.data.employeeType) ||
        notAccessForSettings?.notAccess?.includes(user.data.employeeType)
      ) {
        return NextResponse.rewrite(notFoundUrl, { status: 404 });
      } else {
        return NextResponse.next();
      }
    }
  }
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
