"use client";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Link as MUILink } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  gender?: string;
  age?: number;
  phone: number;
};

type Profile = {
  name: string;
  phone: string;
  avatar: string;
};

export const Profile = () => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL("api/profile", process.env.NEXT_PUBLIC_API_URL as string),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setProfile(data.data);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 135,
            }}
          >
            <Avatar
              alt={profile?.name}
              src={profile?.avatar}
              sx={{ width: 100, height: 100 }}
            />
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Name: {profile?.name}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Mobile: {profile?.phone}
            </Typography>
          </Box>
        </Grid>
        {pathname === "/dashboard/settings" && (
          <>
            <Grid item xs={12}>
              <MUILink
                href={"/dashboard/settings/update-profile"}
                component={Link}
              >
                Update Profile Information
              </MUILink>
            </Grid>
            <Grid item xs={12}>
              <MUILink
                href={"/dashboard/settings/profile-picture"}
                component={Link}
              >
                Upload Profile Picture
              </MUILink>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
