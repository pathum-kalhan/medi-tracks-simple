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
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        //return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;