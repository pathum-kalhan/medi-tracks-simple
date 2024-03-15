import { auth } from "@/auth";
import { Card } from "@/components/dashboard/card";
import { ProfileModel } from "@/components/dashboard/profile-model";
import { Button, Grid } from "@mui/material";

async function getPrescriptions(nic: string, doctorId: string) {
  const res = await fetch(
    new URL(
      `/api/search-prescriptions?nic=${nic}&place=dashboard&doctorId=${doctorId}&type=doctor`,
      process.env.NEXT_PUBLIC_API_URL as string
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch patient data");
  }
  const data = await res.json();
  return data;
}

async function getSurgery(nic: string, doctorId: string) {
  const res = await fetch(
    new URL(
      `/api/search-surgery?nic=${nic}&place=dashboard&doctorId=${doctorId}&type=doctor`,
      process.env.NEXT_PUBLIC_API_URL as string
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch patient data");
  }
  const data = await res.json();
  return data;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await auth();
  const nic = searchParams.nic!;
  const userType = session?.user?.type!;
  const prescriptions = await getPrescriptions(nic, session?.user?.id!);
  const surgery = await getSurgery(nic, session?.user?.id!);

  console.log(prescriptions, "prescriptions");

  const column = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 150 },
  ];

  const row = [{ _id: 1, date: "2021-10-01", doctor: "Dr. John Doe" }];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        {(userType === "doctor" || userType === "patient") && (
          <Button
            variant="contained"
            color="primary"
            href={`/dashboard/lab-report?nic=${nic}`}
            sx={{ m: 1 }}
          >
            View lab reports
          </Button>
        )}
        {session?.user?.type === "doctor" && (
          <ProfileModel name={session?.user?.name} nic={nic} />
        )}
      </Grid>

      {userType === "doctor" && (
        <Grid item xs={12} md={6}>
          <Card
            title="Prescribed Medications"
            row={prescriptions.data}
            column={column}
            href={`/dashboard/prescribe-medication?nic=${nic}&name=${session?.user?.name}`}
          />
        </Grid>
      )}
      {userType === "pharmacist" && (
        <Grid item xs={6}>
          <Card
            title="Prescribed Medications"
            row={prescriptions.data}
            column={column}
            href={`/dashboard/pharmacist/patient-prescriptions?nic=${nic}`}
          />
        </Grid>
      )}
      {userType === "doctor" && (
        <Grid item xs={12} md={6}>
          <Card
            title="Surgical History"
            row={surgery.data}
            column={column}
            href={`/dashboard/surgical-history?nic=${nic}&name=${session?.user?.name}`}
          />
        </Grid>
      )}
    </Grid>
  );
}
