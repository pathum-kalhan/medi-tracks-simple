import { auth } from "@/auth";
import { Prescription } from "@/models/doctor";

export const PUT = auth(async (req) => {
  try {
    const body = await req.json();
    const { id, prescription } = body;
    console.log(id, prescription, "id and prescription");
    const p = await Prescription.findById(id);
    if (!p) {
      return Response.json({
        status: "error",
        message: "Prescription not found",
      });
    }
    p.medicine = prescription;
    await p.save();
    return Response.json({
      status: "success",
      message: "Prescription updated",
    });
  } catch (error) {
    return Response.json({ status: "error", message: "Something went wrong" });
  }
});
