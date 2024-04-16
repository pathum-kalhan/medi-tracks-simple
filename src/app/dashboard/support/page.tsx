import { Forum } from "@/components/chat/Forum";
import { auth } from "@/auth";
import { Button, Grid, Select, Typography } from "@mui/material";
import { SelectPatient } from "./Select";
import { AdminInquiry } from "./AdminInquiry";
import { AdminChat } from "./AdminChat";

async function getAvatarURL(id: string) {
  const res = await fetch(
    new URL(`/api/avatar?id=${id}`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  const data = await res.json();

  return data.data;
}

async function getPatients() {
  const res = await fetch(
    new URL(`/api/patient/all`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  const data = await res.json();

  return data.data;
}

async function getDoctors() {
  const res = await fetch(
    new URL(`/api/doctor/all`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  const data = await res.json();

  return data.data;
}

async function getAllUsers() {
  const res = await fetch(
    new URL(`/api/chat/admin/all`, process.env.NEXT_PUBLIC_API_URL as string),
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

export default async function Home() {
  const session = await auth();
  const userType = session?.user.type!!;
  const userId = session?.user.id!;
  const userName = session?.user.name!;

  const avatarURL = await getAvatarURL(userId);

  if (userType === "doctor") {
    const patients = await getPatients();

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SelectPatient
            patients={patients}
            senderId={userId}
            name={userName}
            photoURL={avatarURL}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AdminInquiry
            senderId={userId}
            name={userName}
            photoURL={avatarURL}
          />
        </Grid>
      </Grid>
    );
  } else if (userType === "patient") {
    const doctors = await getDoctors();
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SelectPatient
            patients={doctors}
            senderId={userId}
            name={userName}
            photoURL={avatarURL}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AdminInquiry
            senderId={userId}
            name={userName}
            photoURL={avatarURL}
          />
        </Grid>
      </Grid>
    );
  } else if (userType === "admin") {
    const users = await getAllUsers();
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <AdminChat name={userName} photoURL={avatarURL} users={users} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AdminInquiry
            senderId={userId}
            name={userName}
            photoURL={avatarURL}
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
          <Typography variant="h4">For Technical Support</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5">Hospital: 0117456456</Typography>
          <Typography variant="h5">Fax: 0117355355</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5">
            Information: info@meditrackspro.lk
          </Typography>
          <Typography variant="h5">
            Support: support@meditrackspro.lk
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
