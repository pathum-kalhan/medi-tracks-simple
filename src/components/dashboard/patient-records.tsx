import { auth } from "@/auth";
import { Card } from "@/components/dashboard/card";
import { ProfileModel } from "@/components/dashboard/profile-model";
import { Patient } from "@/models/patient";
import { Button, Grid } from "@mui/material";

async function getPrescriptions(nic: string) {
  const res = await fetch(
    new URL(
      `/api/search-prescriptions?nic=${nic}&place=dashboard`,
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

async function getSurgery(nic: string) {
  const res = await fetch(
    new URL(
      `/api/search-surgery?nic=${nic}&place=dashboard`,
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

export default async function PatientRecords() {
  const session = await auth();
  const patient = await Patient.findOne({ user: session?.user?.id });
  const prescriptions = await getPrescriptions(patient.nic);
  const surgery = await getSurgery(patient.nic);
  const column = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 150 },
  ];

  const row = [
    { _id: "1", date: "2021-10-10", doctor: "Dr. John Doe" },
    { _id: "2", date: "2021-10-10", doctor: "Dr. John Doe" },
    { _id: "3", date: "2021-10-10", doctor: "Dr. John Doe" },
  ];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          href={`/dashboard/lab-report?nic=${patient.nic}`}
          sx={{ m: 1 }}
        >
          View lab reports
        </Button>
        {session?.user?.type === "doctor" && (
          <ProfileModel name={session?.user?.name} nic={patient.nic} />
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Prescribed Medications"
          row={prescriptions.data}
          column={column}
          href={`/dashboard/prescribe-medication?nic=${patient.nic}&name=${session?.user?.name}`}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          title="Consulting History"
          row={row}
          column={column}
          href={"/dashboard/consulting-history"}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Surgical History"
          row={surgery.data}
          column={column}
          href={`/dashboard/surgical-history?nic=${patient.nic}&name=${session?.user?.name}`}
        />
      </Grid>
    </Grid>
  );
}
