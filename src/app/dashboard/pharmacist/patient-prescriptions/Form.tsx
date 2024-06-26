"use client";
import { Notes } from "@/components/dashboard/notes";
import { Prescribe } from "@/components/dashboard/precribe";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SearchPatientButton } from "../../patient-records/Search";
import DateRangePicker from "@mui/lab/DateRangePicker";
import { LoadingButton } from "@mui/lab";

export default function Page({
  nic,
  userType,
}: {
  nic: string;
  userType: string;
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

  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    disease: "",
  });
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  const handleSubmit = async (event: any) => {
    setFilterLoading(true);
    event.preventDefault();
    try {
      const res = await fetch(
        new URL(
          `/api/pharmacist/search?nic=${nic}&place=prescribe-medication&startDate=${formData.startDate}&endDate=${formData.endDate}&disease=${formData.disease}`,
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
          `/api/pharmacist/search?nic=${nic}&place=prescribe-medication`,
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
        userType={userType}
      />
    </Grid>
  );
}
