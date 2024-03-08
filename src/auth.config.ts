import CredentialsProvider from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnApiRoute = nextUrl.pathname.startsWith("/api");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        if (isOnApiRoute) return true;
        return Response.redirect(
          new URL("/dashboard", process.env.NEXT_PUBLIC_API_URL as string)
        );
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
