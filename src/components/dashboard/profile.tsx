"use client";
import { Avatar, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Link as MUILink } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/app/store/AvatarContext";

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
  const [loading, setLoading] = useState(false);

  const { state, updateState } = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(
        new URL("api/profile", process.env.NEXT_PUBLIC_API_URL as string),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          next: { tags: ["picture"] },
        }
      );

      const data = await res.json();
      setProfile(data.data);
      updateState(data.data.avatar);
      setLoading(false);
    };
    fetchData();
  }, [updateState]);

  console.log(state, "string");

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
            {loading ? (
              <CircularProgress />
            ) : (
              <Avatar
                alt={profile?.name}
                src={(state as string) || "/files/placeholder.jpg"}
                sx={{ width: 100, height: 100 }}
              />
            )}
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
