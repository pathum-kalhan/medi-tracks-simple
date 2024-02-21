"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const handleDoctorNotes = (params: any) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpenNotes(true);
        }}
      >
        View
      </Button>
    );
  };
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "surgeon",
      headerName: "Surgeon",
      width: 200,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 200,
    },
    {
      field: "action",
      headerName: "Doctor Notes",
      renderCell: handleDoctorNotes,
      width: 200,
    },
  ];

  const rows = [
    {
      id: 1,
      date: "2021-08-01",
      surgeon: "Dr. John Doe",
      hospital: "General Hospital",
    },
  ];

  const addMedication = () => {
    setOpen(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={12}>
        <Grid container justifyContent="space-between">
          <Grid item xs={6} sm={6} md={6}>
            <Typography variant="h4" align="center">
              Surgical History
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant="contained" color="primary" onClick={addMedication}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid rows={rows} columns={columns} />
      </Grid>
      <Prescribe
        open={open}
        setOpen={setOpen}
        name="XXX"
        title={"Surgery"}
        date="2024.1.1"
        type="surgery"
      />
      <Notes
        open={openNotes}
        setOpen={setOpenNotes}
        date="2024.1.1"
        doctorName="Herath"
        title="Doctor Notes"
        validTill="2024.5.1"
        notes={
          "Take medicine 3 times a day after meals. Drink water after taking medicine. Do not take medicine on an empty stomach. Take medicine for 3 days. If the condition worsens, consult a doctor."
        }
      />
    </Grid>
  );
}