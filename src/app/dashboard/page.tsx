import { Welcome } from "@/components/dashboard/welcome";
import { auth } from "../../auth";
import PatientRecords from "@/components/dashboard/patient-records";
import AdminCard from "@/components/dashboard/AdminCard";

export default async function Home() {
  const session = await auth();
  const type = session?.user?.type!;
  let data;

  if (type === "pharmacist") {
    const res = await fetch(
      new URL(
        `/api/pharmacist/dashboard?userId=${session?.user?.id}`,
        process.env.NEXT_PUBLIC_API_URL as string
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    data = await res.json();
  } else if (type === "doctor") {
    const res = await fetch(
      new URL(
        `/api/doctor/dashboard?userId=${session?.user?.id}`,
        process.env.NEXT_PUBLIC_API_URL as string
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    data = await res.json();
  } else if (type === "admin") {
    const res = await fetch(
      new URL(`/api/admin`, process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    data = await res.json();
  }

  return (
    <main>
      {(type === "doctor" || type === "pharmacist") &&
        data.data &&
        data.data.length > 0 && (
          <Welcome name={session?.user?.name!} data={data.data} type={type} />
        )}
      {type === "laboratory" && (
        <Welcome name={session?.user?.name!} type={type} />
      )}
      {type === "patient" && <PatientRecords />}
      {type === "admin" && (
        <AdminCard
          patients={data.data.totalPatientCount}
          doctors={data.data.totalDoctorCount}
          labs={data.data.totalLaboratoryCount}
          pharmacies={data.data.totalPharmacistCount}
        />
      )}
    </main>
  );
}
