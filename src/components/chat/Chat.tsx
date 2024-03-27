"use client";
import Paper from "@mui/material/Paper";
import { TextInput } from "./ChatMessageInput";
import { MessageLeft, MessageRight } from "./Message";
import { use, useEffect, useState } from "react";
import { ChatMediator } from "@/app/api/chat/chatClass";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSession } from "next-auth/react";

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
  height: "calc(100% - 20px)",
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
  name,
  photoURL,
  patients,
}: {
  senderId: string;
  name: string;
  photoURL: string;
  patients: { id: string; name: string }[];
}) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Messages>([]);
  const [loading, setLoading] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedPatient(event.target.value);
  };

  const handleNewMessage = (message: Messages[0]) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    mediator.subscribe(handleNewMessage);
    return () => mediator.unsubscribe(handleNewMessage);
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/chat?senderId=${senderId}&receiverId=${selectedPatient}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const messages = await response.json();
    setMessages(messages);
    setLoading(false);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `/api/chat?senderId=${senderId}&receiverId=${selectedPatient}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const messages = await response.json();
      setMessages(messages);
    };
    fetchMessages();
  }, [senderId, selectedPatient]);

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

        <FormControl fullWidth>
          <InputLabel id="patient">
            {session?.user?.type === "doctor"
              ? "Select Patient"
              : "Select Doctor"}
          </InputLabel>
          <Select
            labelId={session?.user?.type}
            id={session?.user?.type}
            value={selectedPatient}
            label={
              session?.user?.type === "doctor"
                ? "Select Patient"
                : "Select Doctor"
            }
            onChange={handleChange}
          >
            {patients &&
              patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <LoadingButton
          variant="contained"
          onClick={() => fetchMessages()}
          loading={loading}
          sx={{ marginLeft: "70px", marginTop: "10px" }}
        >
          Refetch
        </LoadingButton>

        <TextInput
          addMessage={addMessage}
          senderId={senderId}
          receiverId={selectedPatient}
          userName={name}
          photoURL={photoURL}
        />
      </Paper>
    </div>
  );
};
