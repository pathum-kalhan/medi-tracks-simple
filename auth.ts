"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { compare } from "bcryptjs";
import { clientPromise } from "@/lib/db";

async function getUser(id: string, role: string): Promise<any> {
  try {
    const client = await clientPromise;
    const db = client.db("medicareDB");
    switch (role) {
      case "doctor":
        const doctor = await db.collection("doctors").findOne({ slmcNo: id });
        console.log("Doctor:", doctor);
        return doctor;
      case "patient":
        const patient = await db.collection("patients").findOne({ nic: id });
        return patient;
      case "laboratory":
        const laboratory = await db
          .collection("laboratories")
          .findOne({ email: id });
        return laboratory;
      case "pharmacist":
        const pharmacist = await db
          .collection("pharmacists")
          .findOne({ email: id });
        return pharmacist;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials, role) {
        if (role.url.includes("doctor")) {
          const parsedCredentials = z
            .object({ slmc: z.string(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { slmc, password } = parsedCredentials.data;
            const user = await getUser(slmc, "doctor");
            if (!user) return null;
            const passwordsMatch = await compare(password, user.password);

            if (!passwordsMatch) return null;
            return user;
          }

          console.log("Invalid Doctor credentials");
          return null;
        } else if (role.url.includes("patient")) {
          const parsedCredentials = z
            .object({ nic: z.string(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { nic, password } = parsedCredentials.data;
            const user = await getUser(nic, "patient");
            if (!user) return null;
            const passwordsMatch = await compare(password, user.password);

            if (!passwordsMatch) return null;
            return user;
          }

          console.log("Invalid Patient credentials");
          return null;
        } else if (role.url.includes("laboratory")) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email, "laboratory");
            if (!user) return null;
            const passwordsMatch = await compare(password, user.password);

            if (!passwordsMatch) return null;
            return user;
          }

          console.log("Invalid Laboratory credentials");
          return null;
        } else if (role.url.includes("pharmacist")) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email, "pharmacist");
            if (!user) return null;
            const passwordsMatch = await compare(password, user.password);

            if (!passwordsMatch) return null;
            return user;
          }

          console.log("Invalid Pharmacist credentials");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user._id,
          slmcNo: user.slmcNo,
          phone: user.phone,
        };
      }
      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          slmcNo: token.slmcNo,
          phone: token.phone,
        },
      };
    },
  },
});
