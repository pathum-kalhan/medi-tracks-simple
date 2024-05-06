import Form from "./Form";
import { auth } from "@/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await auth();
  return (
    <div>
      <Form nic={searchParams.nic!} userType={session?.user?.type!} />
    </div>
  );
}
