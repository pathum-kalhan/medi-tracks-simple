import { Welcome } from "@/components/dashboard/welcome";
import { auth } from "../../auth";
import PatientRecords from "@/components/dashboard/patient-records";

export default async function Home() {
  const data = [
    {
      left: "Department",
      right: "Cardiology",
    },
    { left: "Hospital", right: "Apollo Hospital" },
    { left: "Doctor ID No.", right: "123456" },
  ];

  const session = await auth();
  const type = session?.user?.type!;
  return (
    <main>
      {(type === "doctor" || type === "pharmacist") && (
        <Welcome name={session?.user?.name!} data={data} type={type} />
      )}
      {type === "laboratory" && (
        <Welcome name={session?.user?.name!} type={type} />
      )}
      {type === "patient" && <PatientRecords />}
    </main>
  );
}
