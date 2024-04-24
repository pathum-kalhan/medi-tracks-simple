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
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import BlockIcon from "@mui/icons-material/Block";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "../../../logo.png";
import { signOut, auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import "@uploadthing/react/styles.css";

async function getPatientDashboard(id: string) {
  const res = await fetch(
    new URL(
      `/api/patient-dashboard?id=${id}&place=dashboard`,
      process.env.NEXT_PUBLIC_API_URL as string
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch patient data");
  }
  const data = await res.json();
  return data;
}

async function fetchAdvertisements() {
  const res = await fetch(
    new URL(`/api/advertisements`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch advertisements");
  }
  const data = await res.json();
  return data;
}

async function getUnreadMsgCount(id: string) {
  const res = await fetch(
    new URL(
      `/api/chat/unread-messages?id=${id}`,
      process.env.NEXT_PUBLIC_API_URL as string
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch unread messages");
  }

  const data = await res.json();
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userType = session?.user?.type!;
  const data = await getPatientDashboard(session?.user?.id!);
  const { nic } = data.data;

  const advertisements = await fetchAdvertisements();
  const AdLogo = advertisements.data[advertisements.data.length - 1]
    .URL as string;

  const unreadMsgCount = await getUnreadMsgCount(session?.user?.id!);

  const routes = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
      userType: ["doctor", "patient", "laboratory", "pharmacist", "admin"],
    },
    {
      path: "/dashboard/pharmacist/all-prescriptions",
      name: "Prescriptions",
      icon: <ArticleIcon />,
      userType: ["pharmacist"],
    },
    {
      path: "/dashboard/patient-records",
      name: "Patient Records",
      icon: <ArticleIcon />,
      userType: [""],
    },
    {
      path: `/dashboard/prescribe-medication?nic=${nic}`,
      name: "Prescriptions",
      icon: <ArticleIcon />,
      userType: ["patient"],
    },
    // {
    //   path: '/dashboard/patients',
    //   name: "Patients",
    //   icon: <AccountCircleIcon />,
    //   userType: ["doctor"],
    // },
    {
      path: `/dashboard/surgical-history?nic=${nic}`,
      name: "Surgeries",
      icon: <ArticleIcon />,
      userType: ["patient"],
    },
    {
      path: "/dashboard/lab-report",
      name: "Lab Reports",
      icon: <AssessmentIcon />,
      userType: ["laboratory"],
    },
    {
      path: "/dashboard/support",
      name: "Help & Support",
      icon: (
        <Badge badgeContent={unreadMsgCount?.data} color="primary">
          <MailIcon />
        </Badge>
      ),
      userType: ["doctor", "patient", "laboratory", "pharmacist", "admin"],
    },
    {
      path: "/dashboard/settings",
      name: "Account Settings",
      icon: <SettingsIcon />,
      userType: ["doctor", "patient", "laboratory", "pharmacist", "admin"],
    },
    {
      path: "/dashboard/advertisements",
      name: "Advertisements",
      icon: <SettingsIcon />,
      userType: ["admin"],
    },
    {
      path: "/dashboard/block",
      name: "Ban Users",
      icon: <BlockIcon />,
      userType: ["admin"],
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
          bgcolor: "action.hover",
        }}
      >
        <Image src={Logo} alt="MediTracks Pro" width={160} height={100} />
      </Box>

      <List>
        {routes.map((route, index) => {
          if (route.userType?.includes(userType)) {
            return (
              <ListItemButton key={index} component="a" href={route.path}>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            );
          }
        })}
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
        <Image src={AdLogo} alt="MediTracks Pro" width={160} height={100} />
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
