import { auth } from "@/auth";
import { Card } from "@/components/dashboard/card";
import { ProfileModel } from "@/components/dashboard/profile-model";
import { Patient } from "@/models/patient";
import { Button, Grid } from "@mui/material";

async function getPatientDashboard(id: string) {
  const res = await fetch(
    new URL(
      `/api/patient-dashboard?id=${id}&place=dashboard`,
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

  const data = await getPatientDashboard(session?.user?.id!);
  const { prescriptions, surgeries, consulting, disease, nic } = data.data;
  const column = [
    { field: "index", headerName: "ID", width: 100 },
    { field: "createdAt", headerName: "Date", width: 200 },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 150,
    },
  ];

  const consultingColumn = [
    { field: "index", headerName: "ID", width: 100 },
    { field: "createdAt", headerName: "Date", width: 200 },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 150,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 150,
    },
  ];

  const diseaseColumn = [
    {
      field: "index",
      headerName: "ID",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
    },
    {
      field: "disease",
      headerName: "Disease",
      width: 150,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          href={`/dashboard/patient/lab-reports?nic=${nic}`}
          sx={{ m: 1 }}
        >
          View lab reports
        </Button>
        {session?.user?.type === "doctor" && (
          <ProfileModel name={session?.user?.name} nic={nic} />
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Prescribed Medications"
          row={prescriptions}
          column={column}
          href={`/dashboard/prescribe-medication?nic=${nic}&name=${session?.user?.name}`}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Consulting History"
          row={consulting}
          column={consultingColumn}
          href={`/dashboard/consulting-history?nic=${nic}&name=${session?.user?.name}`}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Surgical History"
          row={surgeries}
          column={column}
          href={`/dashboard/surgical-history?nic=${nic}&name=${session?.user?.name}`}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          title="Disease History"
          row={disease}
          column={diseaseColumn}
          href={`/dashboard/disease-history?nic=${nic}&name=${session?.user?.name}`}
        />
      </Grid>
    </Grid>
  );
}
