import { auth } from "@/auth";
import { Doctor } from "@/models/doctor";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ data: [], error: "User id is required" });
  }

  const doctor = await Doctor.findOne({ user: userId });

  const data = [{ left: "SLMC Number", right: doctor?.slmcNo }];

  return Response.json({ data });
});
