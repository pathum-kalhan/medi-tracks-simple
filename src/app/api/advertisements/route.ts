import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Ad } from "@/models/advertisement";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const data = await connect();

  const advertisement = await Ad.find();
  return Response.json({ data: advertisement });
}) as any; // TODO: Fix `auth()` return typ
