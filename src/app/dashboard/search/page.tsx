"use client";
import DataTable from "@/components/dashboard/table";
import { ViewPatient } from "@/components/dashboard/view";
import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export default function Home() {
  const ViewButton = () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" size="small" onClick={() => setOpen(true)}>
          Open
        </Button>
        <ViewPatient open={open} setOpen={setOpen} />
      </>
    );
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "Name", headerName: "Name", width: 200 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: ViewButton,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "right",
      align: "right",
      width: 150,
    },
  ];

  const rows = [
    { id: 1, Name: "Jon", age: 35 },
    { id: 2, Name: "Cersei", age: 42 },
    { id: 3, Name: "Jaime", age: 45 },
    { id: 4, Name: "Arya", age: 16 },
    { id: 5, Name: "Daenerys", age: 25 },
    { id: 6, Name: "Tyrion", age: 35 },
    { id: 7, Name: "Sansa", age: 21 },
    { id: 8, Name: "Robb", age: 25 },
    { id: 9, Name: "Bran", age: 15 },
    { id: 10, Name: "Hodor", age: 45 },
    { id: 11, Name: "Jorah", age: 50 },
    { id: 12, Name: "Margaery", age: 25 },
    { id: 13, Name: "Tommen", age: 16 },
    { id: 14, Name: "Stannis", age: 35 },
    { id: 15, Name: "Renly", age: 25 },
    { id: 16, Name: "Joffrey", age: 16 },
    { id: 17, Name: "Sandor", age: 45 },
    { id: 18, Name: "Petyr", age: 35 },
    { id: 19, Name: "Lysa", age: 25 },
    { id: 20, Name: "Oberyn", age: 45 },
    { id: 21, Name: "Gregor", age: 35 },
    { id: 22, Name: "Khal", age: 25 },
    { id: 23, Name: "Ramsay", age: 16 },
    { id: 24, Name: "Robert", age: 45 },
    { id: 25, Name: "Theon", age: 35 },
    { id: 26, Name: "Roose", age: 25 },
    { id: 27, Name: "Euron", age: 45 },
  ];

  return (
    <main>
      <DataTable columns={columns} rows={rows} />
    </main>
  );
}
