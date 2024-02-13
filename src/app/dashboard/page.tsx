import { Welcome } from "@/components/dashboard/welcome";

export default function Home() {
  const data = [
    {
      left: "Department",
      right: "Cardiology",
    },
    { left: "Hospital", right: "Apollo Hospital" },
    { left: "Doctor ID No.", right: "123456" },
  ];
  return (
    <main>
      <Welcome name={"Dr. hrhr"} data={data} />
    </main>
  );
}
