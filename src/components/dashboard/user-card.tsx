"use client";
import {
  Button,
  Card,
  Grid,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import MessageIcon from "@mui/icons-material/Message";
import PermissionModal from "./PermissionModal";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

type Props = {
  results: {
    nic: string;
    name: string;
    gender?: string;
    age?: number;
    phone?: string;
  };
  role?: string;
};

function generateToken() {
  const randomNum = Math.random() * 9000;
  return Math.floor(100000 + randomNum).toString();
}

export function User({ results, role }: Props) {
  const [open, setOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeApplicationStatus = (event: SelectChangeEvent) => {
    setApplicationStatus(event.target.value as string);
  };

  const handlePermission = async () => {
    try {
      setIsLoading(true);
      const DoctorPermission = generateToken();
      sessionStorage.setItem("DoctorPermission", DoctorPermission);
      const response = await fetch("/api/doctor/permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nic: results.nic,
          otp: DoctorPermission,
        }),
      });
      setIsLoading(false);
      toast.success("An OTP has been sent to the patient's email address");
      setOpen(true);
    } catch (error) {
      console.error("An unexpected error happened:", error);
      toast.error("An unexpected error happened");
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ backgroundColor: "" }}>
      <Grid
        container
        alignItems="center"
        justifyContent={{ md: "space-between", sm: "center", xs: "center" }}
        p={3}
        gap={{ lg: 0, md: 0, xs: 2, sm: 2 }}
      >
        <Grid
          container
          item
          md="auto"
          gap={{ md: 10, xs: 1 }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            container
            item
            md="auto"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item md={12}>
              <Stack direction="column">
                <Typography sx={{ textAlign: "left" }}>
                  <b>NIC :</b> {results.nic}
                </Typography>
                <Typography sx={{ textAlign: "left" }}>
                  <b>Name :</b> {results.name ?? "N/A"}
                </Typography>
                {/* <Typography sx={{ textAlign: "left" }}>
                  <b>Gender :</b> {results.gender}
                </Typography>
                <Typography sx={{ textAlign: "left" }}>
                  <b>Age :</b> {results.age}
                </Typography> */}
                <Typography sx={{ textAlign: "left" }}>
                  <b>Phone :</b> {results.phone ?? "N/A"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          item
          md="auto"
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            container
            item
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
          >
            <Grid item>
              {role === "pharmacist" ? (
                <Link
                  href={`/dashboard/pharmacist/patient-prescriptions?nic=${results.nic}`}
                >
                  <Button
                    size="large"
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                  >
                    View
                  </Button>
                </Link>
              ) : (
                <LoadingButton
                  size="large"
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handlePermission}
                  loading={isLoading}
                >
                  Request Permission
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PermissionModal nic={results.nic} open={open} onClose={setOpen} />
    </Card>
  );
}
