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
  padding: "10px",
});

const WrapText = styled("div")({
  width: "100%",
});

type Message = {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
  photoURL: string;
};

type Props = {
  addMessage: (message: Message) => void;
  senderId: string;
  receiverId: string;
  userName: string;
  photoURL: string;
};

export const TextInput = ({
  addMessage,
  senderId,
  receiverId,
  userName,
  photoURL,
}: Props) => {
  const [textValue, setTextValue] = useState("");

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textValue.trim()) return;
    const message: Message = {
      senderId,
      receiverId,
      message: textValue,
      timestamp: new Date().toLocaleString(),
      displayName: userName,
      avatarDisp: true,
      photoURL,
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
            label="Send a message"
            fullWidth
            value={textValue}
            disabled={receiverId === "" ? true : false}
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
