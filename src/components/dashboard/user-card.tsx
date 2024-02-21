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
import React from "react";
import Link from "next/link";
import MessageIcon from "@mui/icons-material/Message";

type Props = {
  setOpen: (value: boolean) => void;
  results: {
    name: string;
    gender: string;
    age: number;
  };
};

export function User({ setOpen, results }: Props) {
  const [applicationStatus, setApplicationStatus] = React.useState("");

  const handleChangeApplicationStatus = (event: SelectChangeEvent) => {
    setApplicationStatus(event.target.value as string);
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
                  <b>Name :</b> {results.name}
                </Typography>
                <Typography sx={{ textAlign: "left" }}>
                  <b>Gender :</b> {results.gender}
                </Typography>
                <Typography sx={{ textAlign: "left" }}>
                  <b>Age :</b> {results.age}
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
              <Button
                size="large"
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                View
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}