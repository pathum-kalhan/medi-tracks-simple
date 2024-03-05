"use client";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import FormDialog from "./search";
import { Fragment, useState } from "react";
import { LabReportUpload } from "./view";

type Props = {
  name: string;
  type: string;
  data?: { left: string; right: string }[];
};

export const Welcome = ({ name, data, type }: Props) => {
  const [open, setOpen] = useState(false);
  const [openLabReport, setOpenLabReport] = useState(false);

  const handlePatientClick = () => {
    setOpen(true);
  };

  const handleLabReportClick = () => {
    setOpenLabReport(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h3" align="center">
          Welcome
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h5" align="center" sx={{ mt: 1 }}>
          {name}
        </Typography>
      </Grid>
      {(type === "doctor" || type === "pharmacist") && (
        <>
          <Grid container item xs={12} sm={12} md={12}>
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>

            {data &&
              data.map((item, index) => (
                <Fragment key={index}>
                  <Grid item xs={6} sm={6} md={6} textAlign={"center"}>
                    <Typography>{item.left}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Typography>: {item.right}</Typography>
                  </Grid>
                </Fragment>
              ))}
          </Grid>

          <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
            <Button variant="contained" onClick={handlePatientClick}>
              Search Patient
            </Button>
          </Grid>
          <FormDialog open={open} setOpen={setOpen} />
        </>
      )}

      {type === "laboratory" && (
        <>
          <Grid container item xs={12} sm={12} md={12}>
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
            <Button variant="contained" onClick={handleLabReportClick}>
              Upload Lab Report
            </Button>
          </Grid>
          <LabReportUpload open={openLabReport} setOpen={setOpenLabReport} />
        </>
      )}
    </Grid>
  );
};
