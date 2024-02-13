import { NavBar } from "@/components/dashboard/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <NavBar>{children}</NavBar>
    </body>
  );
}
