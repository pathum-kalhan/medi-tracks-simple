import { Register } from "@/components/auth/register";
import { NavBar } from "@/components/dashboard/navbar";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Register />
    </main>
  );
}
