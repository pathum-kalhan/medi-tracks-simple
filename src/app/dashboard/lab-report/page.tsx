"use client";
import DataTable from "@/components/dashboard/table";
import { Box, Button, Divider, Typography } from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

async function labReportData(nic: string) {
  const res = await fetch(
    new URL(`/api/all-labreport`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch lab report data");
  }
  const data = await res.json();
  return data;
}

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const router = useRouter();

  const [labReports, setLabReports] = useState([]);
  const nic = searchParams.nic!;

  useEffect(() => {
    const fetchData = async () => {
      const res = await labReportData(nic);
      setLabReports(res.data);
    };

    fetchData();
  }, [nic]);

  console.log(labReports);
  const ViewButton = (row: any) => {
    return (
      <>
        <Button variant="contained" size="small" href={row.url} target="_blank">
          View PDF
        </Button>
      </>
    );
  };

  const DownloadButton = (row: any) => {
    return (
      <>
        <Button
          variant="contained"
          size="small"
          href={row.url}
          target="_blank"
          download
        >
          Download PDF
        </Button>
      </>
    );
  };
  const columns: GridColDef[] = [
    { field: "testType", headerName: "Report Name", width: 200 },
    {
      field: "createdAt",
      // valueFormatter: (params) => {
      //   params.value.toString();
      // },
      headerName: "Date",
      width: 200,
    },
    {
      field: "view",
      headerName: "View",
      renderCell: (row) => ViewButton(row.row),
      sortable: false,
      disableColumnMenu: true,
      width: 200,
    },
    {
      field: "download",
      headerName: "Download",
      renderCell: (row) => DownloadButton(row.row),
      sortable: false,
      disableColumnMenu: true,
      width: 200,
    },
  ];

  return (
    <main>
      <Box>
        <Typography variant="h4" align="center">
          <Button onClick={() => router.back()}>
            <ArrowBackIcon />
          </Button>{" "}
          Patients Lab Reports
        </Typography>
        <Divider />
        <DataTable columns={columns} rows={labReports} pageSize={5} />
      </Box>
    </main>
  );
}
