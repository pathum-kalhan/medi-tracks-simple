import { Chat } from "@/components/chat/Chat";
import { auth } from "@/auth";

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
      <>
        <Chat forum="Doctor" id={userId} photoURL={avatarURL} name={userName} />
        <Chat forum="Patient" id={userId} photoURL="" name={userName} />
      </>
    );
  } else if (userType === "patient") {
    return (
      <>
        <Chat
          forum="Patient"
          id={userId}
          photoURL={avatarURL}
          name={userName}
        />
      </>
    );
  }
}
