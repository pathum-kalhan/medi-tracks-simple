import Image from "next/image";

import { NavBar } from "@/components/dashboard/navbar";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../logo.png";
import { signOut, auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userType = session?.user?.type!;
  const routes = [
    { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
    // {
    //   path: "/dashboard/patient-records",
    //   name: "Patient Records",
    //   icon: <ArticleIcon />,
    // },
    // {
    //   path: "/dashboard/lab-report",
    //   name: "Lab Reports",
    //   icon: <AssessmentIcon />,
    // },
    { path: "/help", name: "Help & Support", icon: <HelpCenterIcon /> },
    {
      path: "/dashboard/settings",
      name: "Account Settings",
      icon: <SettingsIcon />,
    },
  ];
  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          height: 135,
        }}
      >
        <Image src={Logo} alt="MediTracks Pro" width={160} height={100} />
      </Box>

      <List>
        {routes.map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton href={route.path}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          height: 135,
        }}
      >
        <Typography variant="caption" align="center">
          AD
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit">
              <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
              <ListItemText primary="Logout" />
            </Button>
          </form>
        </ListItem>
      </List>
    </div>
  );

  return (
    <NavBar drawer={drawer}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </NavBar>
  );
}
