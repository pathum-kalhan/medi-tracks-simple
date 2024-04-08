import { auth } from "@/auth";
import { Card } from "@/components/dashboard/card";
import { ProfileModel } from "@/components/dashboard/profile-model";
import { Button, Grid, Typography } from "@mui/material";
import { SearchPatientButton } from "./Search";

async function getPrescriptions(nic: string, doctorId: string, type: string) {
  const res = await fetch(
    new URL(
      `/api/search-prescriptions?nic=${nic}&place=dashboard&doctorId=${doctorId}&type=${type}`,
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

async function getPatientDashboard(nic: string, doctorId: string) {
  const res = await fetch(
    new URL(
      `/api/doctor/patient-records?nic=${nic}&place=dashboard&doctorId=${doctorId}`,
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
  const prescribeColumn = [
    { field: "index", headerName: "ID", width: 150 },
    { field: "createdAt", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 150 },
    { field: "medicine", headerName: "Medicine", width: 150 },
  ];
  if (userType === "pharmacist") {
    const prescriptions = await getPrescriptions(
      nic,
      session?.user?.id! as string,
      userType
    );

    return (
      <Grid item xs={12}>
        <Card
          title="Prescribed Medications"
          row={prescriptions.data}
          column={prescribeColumn}
          href={`/dashboard/pharmacist/patient-prescriptions?nic=${nic}`}
        />
      </Grid>
    );
  }
  const prescriptions = await getPrescriptions(
    nic,
    session?.user?.id! as string,
    userType
  );
  const surgery = await getSurgery(nic, session?.user?.id!);

  const patientData = await getPatientDashboard(nic, session?.user?.id!);
  const { consulting, disease, name } = patientData.data;

  const column = [
    { field: "index", headerName: "ID", width: 150 },
    { field: "createdAt", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 150 },
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
    <Grid container spacing={2} sx={{ bgcolor: "action.hover", p: 2 }}>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Typography variant="h5">Patient Name: {name}</Typography>
        <SearchPatientButton />
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
            column={prescribeColumn}
            href={`/dashboard/prescribe-medication?nic=${nic}&name=${session?.user?.name}`}
          />
        </Grid>
      )}
      {userType === "pharmacist" && (
        <Grid item xs={12}>
          <Card
            title="Prescribed Medications"
            row={prescriptions.data}
            column={prescribeColumn}
            href={`/dashboard/pharmacist/patient-prescriptions?nic=${nic}`}
          />
        </Grid>
      )}
      {userType === "doctor" && (
        <>
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
              row={surgery.data}
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
        </>
      )}
    </Grid>
  );
}
