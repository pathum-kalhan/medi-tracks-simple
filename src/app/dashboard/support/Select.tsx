"use client";

import { Chat } from "@/components/chat/Chat";
import { Button, Select, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type Patient = {
  id: string;
  name: string;
};

export const SelectPatient = ({
  patients,
  senderId,
  photoURL,
  name,
}: {
  patients: Patient[];
  senderId: string;
  photoURL: string;
  name: string;
}) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedPatient(event.target.value);
  };
  console.log(selectedPatient);

  return (
    <>
      <Select onChange={handleChange} fullWidth>
        {patients &&
          patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
      </Select>
      <Chat
        senderId={senderId}
        receiverId={selectedPatient}
        name={name}
        photoURL={photoURL}
      />
    </>
  );
};
