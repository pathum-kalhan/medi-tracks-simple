"use client";
import Paper from "@mui/material/Paper";
import { TextInput } from "./ChatMessageInput";
import { MessageLeft, MessageRight } from "./Message";
import { use, useEffect, useState } from "react";
import { ChatMediator } from "@/app/api/chat/chatClass";
import { Typography } from "@mui/material";

const paperStyles = {
  width: "100vw",
  height: "80vh",
  maxWidth: "1000px",
  maxHeight: "700px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
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
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
  photoURL: string;
}[];

const mediator = new ChatMediator();

export const Chat = ({
  senderId,
  receiverId,
  name,
  photoURL,
}: {
  senderId: string;
  receiverId: string;
  name: string;
  photoURL: string;
}) => {
  const [messages, setMessages] = useState<Messages>([]);

  const handleNewMessage = (message: Messages[0]) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    mediator.subscribe(handleNewMessage);
    return () => mediator.unsubscribe(handleNewMessage);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `/api/chat?senderId=${senderId}&receiverId=${receiverId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const messages = await response.json();
      setMessages(messages);
    };

    fetchMessages();
  }, [receiverId, senderId]);

  const addMessage = (message: Messages[0]): void => {
    mediator.sendMessage(message);
  };

  return (
    <div style={containerStyles}>
      <Paper sx={paperStyles} elevation={2}>
        <Typography variant="h5" component="h2">
          Chat
        </Typography>
        <Paper sx={messagesBodyStyles}>
          {messages.map((message, index) => {
            if (message.senderId === senderId) {
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
          senderId={senderId}
          receiverId={receiverId}
          userName={name}
          photoURL={photoURL}
        />
      </Paper>
    </div>
  );
};
