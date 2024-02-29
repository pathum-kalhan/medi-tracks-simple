import { Welcome } from "@/components/dashboard/welcome";
import { auth } from "../../../auth";

export default async function Home() {
  const data = [
    {
      left: "Department",
      right: "Cardiology",
    },
    { left: "Hospital", right: "Apollo Hospital" },
    { left: "Doctor ID No.", right: "123456" },
  ];
  const session = await auth();
  console.log(session, "session");
  return (
    <main>
      {JSON.stringify(session)}
      <Welcome name={"Dr. hrhr"} data={data} />
    </main>
  );
}
