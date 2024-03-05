import { auth } from "@/auth";
import { Card } from "@/components/dashboard/card";
import { ProfileModel } from "@/components/dashboard/profile-model";
import { Button, Grid } from "@mui/material";

async function getPatientData(nic: string) {
  const res = await fetch(
    `http://localhost:3000/api/search-patient?nic=${nic}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
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
  const res = await fetch(
    `http://localhost:3000/api/search-patient?nic=${nic}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  const data = await res.json();

  console.log(data, "data");
  const column = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 150 },
  ];

  const row = [
    { id: 1, date: "2021-10-01", doctor: "Dr. John Doe" },
    { id: 2, date: "2021-10-02", doctor: "Dr. Jane Doe" },
    { id: 3, date: "2021-10-03", doctor: "Dr. John Doe" },
    { id: 4, date: "2021-10-04", doctor: "Dr. Jane Doe" },
    { id: 5, date: "2021-10-05", doctor: "Dr. John Doe" },
    { id: 6, date: "2021-10-06", doctor: "Dr. Jane Doe" },
    { id: 7, date: "2021-10-07", doctor: "Dr. John Doe" },
    { id: 8, date: "2021-10-08", doctor: "Dr. Jane Doe" },
  ];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          href="/files/dummy.pdf"
          target="_blank"
          sx={{ m: 1 }}
        >
          View lab reports
        </Button>
        {session?.user?.type === "doctor" && (
          <ProfileModel name={session?.user?.name} />
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          title="Prescribed Medications"
          row={row}
          column={column}
          href={"/dashboard/prescribe-medication"}
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
          row={row}
          column={column}
          href={"/dashboard/surgical-history"}
        />
      </Grid>
    </Grid>
  );
}
