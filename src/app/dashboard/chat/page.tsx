import { Chat } from "@/components/chat/Chat";
import { auth } from "@/auth";
import { Grid } from "@mui/material";

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

export default async function Home() {
  const session = await auth();
  const userType = session?.user.type!!;
  const userId = session?.user.id!;
  const userName = session?.user.name!;

  const avatarURL = await getAvatarURL(userId);

  if (userType === "doctor") {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Chat
            forum="Doctor"
            role="doctor"
            id={userId}
            photoURL={avatarURL}
            name={userName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Chat
            forum="Patient"
            role="doctor"
            id={userId}
            photoURL={avatarURL}
            name={userName}
          />
        </Grid>
      </Grid>
    );
  } else if (userType === "patient") {
    return (
      <>
        <Chat
          forum="Patient"
          role="patient"
          id={userId}
          photoURL={avatarURL}
          name={userName}
        />
      </>
    );
  }
}
