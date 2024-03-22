"use client";
import Paper from "@mui/material/Paper";
import { TextInput } from "./MessageInput";
import { MessageLeft, MessageRight } from "./Message";
import { use, useEffect, useState } from "react";
import { ChatMediator } from "@/app/api/forum/chatClass";
import { Typography } from "@mui/material";

const paperStyles = {
  width: "100vw",
  height: "85vh",
  maxWidth: "1000px",
  maxHeight: "700px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
  padding: "10px",
};

const containerStyles = {
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
  userId: string;
  senderRole: string;
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
  photoURL: string;
}[];

const mediator = new ChatMediator();

export const Forum = ({
  forum,
  role,
  id,
  name,
  photoURL,
}: {
  forum: string;
  role: string;
  id: string;
  name: string;
  photoURL: string;
}) => {
  const [messages, setMessages] = useState<Messages>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/forum?forum=${forum.toLowerCase()}`);
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [forum]);

  useEffect(() => {
    const messageCallback = (message: Messages[0]) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    mediator.subscribe(forum, messageCallback);

    return () => {
      mediator.unsubscribe(forum, messageCallback);
    };
  }, [forum]);

  const addMessage = (message: Messages[0]) => {
    mediator.sendMessage(forum, message);
  };

  return (
    <div style={containerStyles}>
      <Paper sx={paperStyles} elevation={2}>
        <Typography variant="h5" component="h2">
          {forum} Forum
        </Typography>
        <Paper sx={messagesBodyStyles}>
          {messages.map((message, index) => {
            if (message.userId === id) {
              return (
                <MessageRight
                  key={index}
                  message={message.message}
                  timestamp={message.timestamp}
                  displayName={message.displayName}
                  avatarDisp={message.avatarDisp}
                  photoURL={message.photoURL}
                />
              );
            } else {
              return (
                <MessageLeft
                  key={index}
                  message={message.message}
                  timestamp={message.timestamp}
                  displayName={message.displayName}
                  avatarDisp={message.avatarDisp}
                  photoURL={message.photoURL}
                />
              );
            }
          })}
        </Paper>
        <TextInput
          addMessage={addMessage}
          userId={id}
          senderRole={role}
          userName={name}
          photoURL={photoURL}
          forum={forum.toLowerCase()}
        />
      </Paper>
    </div>
  );
};
