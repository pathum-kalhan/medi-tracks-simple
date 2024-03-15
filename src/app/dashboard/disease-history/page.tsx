"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [open, setOpen] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [rows, setRows] = useState([]);
  const [notes, setNotes] = useState({
    date: "",
    doctorName: "",
    validTill: "",
    notes: "",
  });

  const nic = searchParams.nic!;
  const name = searchParams.name!;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL(
          `/api/search-consulting?nic=${nic}&place=prescribe-medication`,
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

      setRows(data.data);
    };
    fetchData();
  }, [nic]);

  const handleDoctorNotes = (row: any) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpenNotes(true);
          setNotes({
            date: row.date,
            doctorName: row.doctor,
            validTill: row.valid,
            notes: row.notes,
          });
        }}
      >
        View
      </Button>
    );
  };
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "createdAt", headerName: "Date", width: 250 },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 200,
    },
    {
      field: "disease",
      headerName: "Diseases",
      width: 200,
    },
    {
      field: "action",
      headerName: "Doctor Notes",
      renderCell: (params) => handleDoctorNotes(params.row),
      width: 200,
    },
  ];

  const addMedication = () => {
    setOpen(true);
  };

  console.log(rows);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={12}>
        <Grid container justifyContent="space-between">
          <Grid item xs={6} sm={6} md={6}>
            <Typography variant="h4" align="center">
              Disease History
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </Grid>
      <Notes
        open={openNotes}
        setOpen={setOpenNotes}
        title="Doctor Notes"
        date={notes.date}
        doctorName={notes.doctorName}
        validTill={notes.validTill}
        notes={notes.notes}
      />
    </Grid>
  );
}
