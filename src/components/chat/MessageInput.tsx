"use client";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";

const WrapForm = styled("form")({
  display: "flex",
  justifyContent: "center",
  width: "95%",
  margin: "0 auto",
});

const WrapText = styled("div")({
  width: "100%",
});

type Message = {
  userId: string;
  senderRole: string;
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
  photoURL: string;
  forum: string;
};

type Props = {
  addMessage: (message: Message) => void;
  userId: string;
  senderRole: string;
  userName: string;
  photoURL: string;
  forum: string;
};

export const TextInput = ({
  addMessage,
  userId,
  senderRole,
  userName,
  forum,
  photoURL,
}: Props) => {
  const [textValue, setTextValue] = useState("");

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textValue.trim()) return;
    const message: Message = {
      userId,
      senderRole,
      message: textValue,
      timestamp: new Date().toLocaleString(),
      displayName: userName,
      avatarDisp: true,
      photoURL,
      forum,
    };

    addMessage(message);
    setTextValue("");
  };

  return (
    <>
      <WrapForm noValidate autoComplete="off" onSubmit={sendMessage}>
        <WrapText>
          <TextField
            id="standard-text"
            label="Test"
            fullWidth
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
        </WrapText>
        <Button variant="contained" color="primary" type="submit">
          <SendIcon />
        </Button>
      </WrapForm>
    </>
  );
};
