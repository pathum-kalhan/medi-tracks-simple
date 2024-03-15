import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Pharmacist } from "@/models/pharmacist";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ data: [], error: "User id is required" });
  }

  const pharmacist = await Pharmacist.findOne({ user: userId });

  const data = [
    { left: "Pharmacy Location", right: pharmacist?.location },
    { left: "Pharmacy ID", right: pharmacist?.regNo },
  ];

  return Response.json({ data });
});
