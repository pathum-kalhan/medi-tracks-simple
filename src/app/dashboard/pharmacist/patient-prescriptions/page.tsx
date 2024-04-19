"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SearchPatientButton } from "../../patient-records/Search";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState({
    _id: "",
    date: "",
    doctorName: "",
    validTill: "",
    medicine: "",
    isIssued: false,
    issuedRange: 0,
    type: "",
  });

  const nic = searchParams.nic!;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL(
          `/api/pharmacist/search?nic=${nic}`,
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
      setName(data.name);
      setRows(data.data);
    };
    fetchData();
  }, [nic, openNotes]);

  const handleDoctorNotes = (row: any) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpenNotes(true);
          setNotes({
            _id: row._id,
            date: row.date,
            doctorName: row.doctor,
            validTill: row.valid,
            medicine: row.medicine,
            isIssued: row.isIssued,
            issuedRange: row.issuedRange,
            type: row.type,
          });
        }}
      >
        View
      </Button>
    );
  };
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ID",
      width: 50,
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 200,
    },
    {
      field: "disease",
      headerName: "Disease / Surgery",
      width: 200,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 200,
    },
    {
      field: "action",
      headerName: "Medicine",
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
        <Typography textAlign={"center"} variant="h5">
          Patient Name: {name}
        </Typography>
        <Grid container justifyContent="space-between">
          <Grid item xs={6} sm={6} md={6}>
            <Typography variant="h4" align="center">
              <Button onClick={() => router.back()}>
                <ArrowBackIcon />
              </Button>{" "}
              Prescribe Medication
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <SearchPatientButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </Grid>
      <Notes
        id={notes._id}
        open={openNotes}
        setOpen={setOpenNotes}
        title="Medicine Details"
        date={notes.date}
        doctorName={notes.doctorName}
        validTill={notes.validTill}
        notes={notes.medicine}
        isIssued={notes?.isIssued}
        issuedRange={notes?.issuedRange}
        type={notes.type}
      />
    </Grid>
  );
}
