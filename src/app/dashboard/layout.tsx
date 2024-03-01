import { NavBar } from "@/components/dashboard/navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavBar>{children}</NavBar>;
}
