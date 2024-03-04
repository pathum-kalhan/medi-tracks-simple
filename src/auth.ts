import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import clientPromise from "./lib/db";

import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    _id: string;
    userType: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      type: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.

      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const response = await fetch(
          new URL("/api/public", "http://localhost:3000"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );

        const user = await response.json();

        if (!user.user) {
          return null;
        }

        return user.user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,

          id: user._id,

          userType: user.userType,
        };
      }
      return token;
    },
    // @ts-ignore
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          type: token.userType,
        },
      };
    },
  },
});
