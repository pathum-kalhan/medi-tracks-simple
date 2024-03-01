"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "../auth.config";
import { z } from "zod";
import { compare } from "bcryptjs";
import { connect } from "@/lib/db";
import clientPromise from "@/lib/adapter";
import { User } from "@/models/user";
import { Doctor } from "@/models/doctor";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

async function getUser(id: string, role: string): Promise<any> {
  try {
    const client = await clientPromise;
    const db = client.db("medicareDB");
    switch (role) {
      case "doctor":
        const doctor = await db
          .collection("doctors")
          .aggregate([
            {
              $match: { slmcNo: id },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ])
          .toArray();

        const user = {
          _id: doctor[0]._id,
          name: doctor[0].user.name,
          userType: "doctor",
          password: doctor[0].user.password,
        };
        return user;
      case "patient":
        const patient = await db
          .collection("patients")
          .aggregate([
            {
              $match: { nic: id },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ])
          .toArray();

        const userPatient = {
          _id: patient[0]._id,
          name: patient[0].user.name,
          userType: "patient",
          password: patient[0].user.password,
        };
        return userPatient;
      case "laboratory":
        const laboratory = await db
          .collection("laboratories")
          .aggregate([
            {
              $match: { email: id },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ])
          .toArray();

        const userLaboratory = {
          _id: laboratory[0]._id,
          name: laboratory[0].user.name,
          userType: "laboratory",
          password: laboratory[0].user.password,
        };
        return userLaboratory;
      case "pharmacist":
        const pharmacist = await db
          .collection("pharmacists")
          .aggregate([
            {
              $match: { email: id },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ])
          .toArray();

        const userPharmacist = {
          _id: pharmacist[0]._id,
          name: pharmacist[0].user.name,
          userType: "pharmacist",
          password: pharmacist[0].user.password,
        };
        return userPharmacist;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
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
            console.log(user, "user");
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
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          // @ts-ignore
          id: user._id,
          // @ts-ignore
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
