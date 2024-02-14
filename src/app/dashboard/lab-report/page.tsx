"use client";
import DataTable from "@/components/dashboard/table";
import { Box, Button, Divider, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export default function Home() {
  const ViewButton = () => {
    return (
      <>
        <Button variant="contained" size="small">
          Open
        </Button>
      </>
    );
  };

  const DownloadButton = () => {
    return (
      <>
        <Button variant="contained" size="small">
          Open
        </Button>
      </>
    );
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Report Name", width: 200 },
    {
      field: "laboratory",
      headerName: "Laboratory",
      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "view",
      headerName: "View",
      renderCell: ViewButton,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "right",
      align: "right",
      width: 150,
    },
    {
      field: "download",
      headerName: "Download",
      renderCell: DownloadButton,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "right",
      align: "right",
      width: 150,
    },
  ];

  const rows = [
    { id: 1, name: "Blood Report", laboratory: "Asiri", date: "2022-10-10" },
    { id: 2, name: "Urine Report", laboratory: "Asiri", date: "2022-10-10" },
    { id: 3, name: "X-Ray", laboratory: "Asiri", date: "2022-10-10" },
  ];

  return (
    <main>
      <Box>
        <Typography variant="h4" align="center">
          Patients Lab Reports
        </Typography>
        <Divider />
        <DataTable columns={columns} rows={rows} />
      </Box>
    </main>
  );
}
