"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const router = useRouter();

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
          `/api/search-surgery?nic=${nic}&place=surgical-history`,
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

  const handleDoctorNotes = (params: any) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpenNotes(true);
          setNotes({
            date: params.date,
            doctorName: params.doctor,
            validTill: params.valid,
            notes: params.notes,
          });
        }}
      >
        View
      </Button>
    );
  };
  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 200 },
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "doctor",
      headerName: "Surgeon",
      width: 100,
    },
    {
      field: "medicine",
      headerName: "Medicine",
      width: 100,
    },
    {
      field: "valid",
      headerName: "Valid Till",
      width: 100,
    },
    {
      field: "hospital",
      headerName: "Hospital",
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={12}>
        <Grid container justifyContent="space-between">
          <Grid item xs={6} sm={6} md={6}>
            <Typography variant="h4" align="center">
              <Button onClick={() => router.back()}>
                <ArrowBack />
              </Button>{" "}
              Surgical History
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            {session?.user?.type === "doctor" && (
              <Button
                variant="contained"
                color="primary"
                onClick={addMedication}
              >
                Add
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </Grid>
      <Prescribe
        open={open}
        setOpen={setOpen}
        name={name}
        title={"Surgery"}
        date={new Date().toDateString()}
        type="surgery"
        nic={nic}
      />
      <Notes
        open={openNotes}
        setOpen={setOpenNotes}
        notes={notes.notes}
        title="Doctor Notes"
        date={notes.date}
        doctorName={notes.doctorName}
        validTill={notes.validTill}
      />
    </Grid>
  );
}
