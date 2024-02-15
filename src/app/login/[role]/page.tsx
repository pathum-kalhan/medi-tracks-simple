import { Login } from "@/components/auth/login";

type role = "patient" | "doctor" | "laboratory" | "pharmacist";

export default function Page({ params }: { params: { role: role } }) {
  return (
    <main>
      <Login role={params.role} />
    </main>
  );
}
