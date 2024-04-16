"use client";

import { Chat } from "@/components/chat/Chat";
import { Button, Select, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type Patient = {
  id: string;
  name: string;
  unread: number;
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

  return (
    <>
      <Chat
        patients={patients}
        senderId={senderId}
        name={name}
        photoURL={photoURL}
      />
    </>
  );
};
