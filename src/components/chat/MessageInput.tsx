"use client";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";

const currentUser = "Sasiru";

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
  type: "left" | "right";
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
};

type Props = {
  addMessage: (message: Message) => void;
};

export const TextInput = ({ addMessage }: Props) => {
  const [textValue, setTextValue] = useState("");

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textValue.trim()) return;
    const message: Message = {
      type: "right",
      message: textValue,
      timestamp: new Date().toLocaleString(),
      displayName: currentUser,
      avatarDisp: true,
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
