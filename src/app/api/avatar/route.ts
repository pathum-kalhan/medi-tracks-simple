import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { revalidateTag } from "next/cache";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const userId = searchParams.get("id");
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  return Response.json({ data: user.avatar });
}) as any; // TODO: Fix `auth()` return typ
