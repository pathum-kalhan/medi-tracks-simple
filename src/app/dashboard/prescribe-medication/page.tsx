"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

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
    isIssued: false,
    issuedRange: 0,
    type: "",
  });

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    disease: "",
  });

  const nic = searchParams.nic!;
  const name = searchParams.name!;
  const { data: session } = useSession();

  const [filterLoading, setFilterLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL(
          `/api/search-prescriptions?nic=${nic}&place=prescribe-medication`,
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

  console.log(rows, "rows");

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

  const viewMedicine = (row: any) => {
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
            notes: row.medicine,
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
      width: 100,
    },
    {
      field: "disease",
      headerName: "Disease/Surgery",
      width: 150,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 150,
    },
    {
      field: "medicine",
      headerName: "Medicine",
      renderCell: (params) => viewMedicine(params.row),
      width: 100,
    },
    {
      field: "valid",
      headerName: "Valid Till",
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

  const handleSubmit = async (event: any) => {
    setFilterLoading(true);
    event.preventDefault();
    try {
      const res = await fetch(
        new URL(
          `/api/search-prescriptions?nic=${nic}&place=prescribe-medication&startDate=${formData.startDate}&endDate=${formData.endDate}&disease=${formData.disease}`,
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
      setFilterLoading(false);
    } catch (error) {
      setFilterLoading(false);
      console.error("Failed to fetch patient data");
    }
  };

  const handleInputChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = async () => {
    setResetLoading(true);
    try {
      const res = await fetch(
        new URL(
          `/api/search-prescriptions?nic=${nic}&place=prescribe-medication`,
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
      setResetLoading(false);
    } catch (error) {
      setResetLoading(false);
      console.error("Failed to fetch patient data");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "background.paper" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={12}>
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
              {session?.user?.type === "doctor" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addMedication}
                >
                  Add Prescription
                </Button>
              )}
            </Grid>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <TextField
                    name="startDate"
                    type="date"
                    size="small"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="endDate"
                    type="date"
                    size="small"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="disease"
                    label="Disease"
                    type="text"
                    size="small"
                    required
                    fullWidth
                    value={formData.disease}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <LoadingButton
                    loading={filterLoading}
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mr: 2 }}
                  >
                    Filter
                  </LoadingButton>
                  <LoadingButton
                    loading={resetLoading}
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
        </Grid>
        <Prescribe
          open={open}
          setOpen={setOpen}
          name={name}
          title="Prescribe Medication"
          date={new Date().toDateString()}
          type="prescribe"
          nic={nic}
        />
        <Notes
          open={openNotes}
          setOpen={setOpenNotes}
          title="Doctor Notes"
          date={notes.date}
          doctorName={notes.doctorName}
          validTill={notes.validTill}
          notes={notes.notes}
          isIssued={notes?.isIssued}
          issuedRange={notes?.issuedRange}
          type={notes.type}
        />
      </Grid>
    </Box>
  );
}
