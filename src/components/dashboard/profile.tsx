"use client";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Link as MUILink } from "@mui/material";
import Link from "next/link";

type Props = {
  name: string;
  gender: string;
  age: number;
  mobile: number;
};

export const Profile = ({ name = "Name", gender, age, mobile }: Props) => {
  const pathname = usePathname();

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
            <Avatar alt={name} sx={{ width: 100, height: 100 }}>
              {name.charAt(0)}
            </Avatar>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Name: {name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Gender: {gender}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Age: {age}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Mobile: {mobile}
            </Typography>
          </Box>
        </Grid>
        {pathname === "/dashboard/settings" && (
          <>
            <Grid item xs={12}>
              <MUILink href={"#"} component={Link}>
                Update Profile Information
              </MUILink>
            </Grid>
            <Grid item xs={12}>
              <MUILink href={"#"} component={Link}>
                Upload Profile Picture
              </MUILink>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
