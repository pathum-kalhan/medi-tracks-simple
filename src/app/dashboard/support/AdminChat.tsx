"use client";
import Paper from "@mui/material/Paper";
import { TextInput } from "@/components/chat/ChatMessageInput";
import { MessageLeft, MessageRight } from "@/components/chat/Message";
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

export const AdminChat = ({
  name,
  photoURL,
  users,
}: {
  name: string;
  photoURL: string;
  users: { id: string; name: string; unread: number }[];
}) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Messages>([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value);
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
    const response = await fetch(`/api/chat/admin?senderId=${selectedUser}`);
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const messages = await response.json();
    setMessages(messages);
    setLoading(false);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/chat/admin?senderId=${selectedUser}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const messages = await response.json();
      setMessages(messages);
    };
    fetchMessages();
  }, [selectedUser]);

  const addMessage = (message: Messages[0]): void => {
    mediator.sendMessage(message);
  };

  return (
    <div style={containerStyles}>
      <Paper sx={paperStyles} elevation={2}>
        <Typography variant="h5" component="h2">
          Inquiries
        </Typography>
        <Paper sx={messagesBodyStyles}>
          {messages.map((message, index) => {
            if (message.receiverId === "661ce5b035c0d73ab2dfa45c") {
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
          <InputLabel id="patient">Select user</InputLabel>
          <Select
            labelId={session?.user?.type}
            id={session?.user?.type}
            value={selectedUser}
            label={"Select user"}
            onChange={handleChange}
          >
            {users &&
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
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
      </Paper>
    </div>
  );
};
