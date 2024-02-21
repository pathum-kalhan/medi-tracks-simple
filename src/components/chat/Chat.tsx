"use client";
import Paper from "@mui/material/Paper";
import { TextInput } from "./MessageInput";
import { MessageLeft, MessageRight } from "./Message";
import { use, useEffect, useState } from "react";

const paperStyles = {
  width: "80vw",
  height: "80vh",
  maxWidth: "500px",
  maxHeight: "700px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
};

const containerStyles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const messagesBodyStyles = {
  width: "calc(100% - 20px)",
  margin: 10,
  overflowY: "scroll",
  height: "calc(100% - 80px)",
};

type Messages = {
  type: "left" | "right";
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
}[];

const chatMessages: Messages = [
  {
    type: "left",
    message: "Hi",
    timestamp: "MM/DD 00:00",
    displayName: "Sasiru",
    avatarDisp: true,
  },
];

export const Chat = () => {
  const [messages, setMessages] = useState<Messages>(chatMessages);

  const addMessage = (message: Messages[0]) => {
    setMessages([...messages, message]);
  };

  return (
    <div style={containerStyles}>
      <Paper sx={paperStyles} elevation={2}>
        <Paper sx={messagesBodyStyles}>
          {messages.map((message, index) => {
            if (message.type === "left") {
              return (
                <MessageLeft
                  key={index}
                  message={message.message}
                  timestamp={message.timestamp}
                  displayName={message.displayName}
                  avatarDisp={message.avatarDisp}
                />
              );
            } else {
              return (
                <MessageRight
                  key={index}
                  message={message.message}
                  timestamp={message.timestamp}
                  displayName={message.displayName}
                  avatarDisp={message.avatarDisp}
                />
              );
            }
          })}
        </Paper>
        <TextInput addMessage={addMessage} />
      </Paper>
    </div>
  );
};
