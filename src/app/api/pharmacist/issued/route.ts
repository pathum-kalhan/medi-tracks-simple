import { Prescription, Surgery } from "@/models/doctor";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { id, isIssued, issuedRange, type } = body;
  try {
    if (type === "prescription") {
      const prescription = await Prescription.findById(id);
      prescription.isIssued = isIssued;
      prescription.issuedRange = issuedRange;
      await prescription.save();
      return Response.json({
        status: "success",
        message: "Updated successfully",
      });
    }
    if (type === "surgery") {
      const surgery = await Surgery.findById(id);
      surgery.isIssued = isIssued;
      surgery.issuedRange = issuedRange;
      await surgery.save();
      return Response.json({
        status: "success",
        message: "Updated successfully",
      });
    }
  } catch (error) {
    return Response.json({ status: "error", message: "Failed to update data" });
  }
};
