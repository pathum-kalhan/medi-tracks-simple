"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

type User = {
  _id: string;
  name: string;
  email: string;
  status: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]); // Array to store the list of users
  const [selectedUser, setSelectedUser] = useState<User>(); // State to store the selected user
  const [open, setOpen] = useState(false); // State to control the dialog visibility

  // Function to fetch the list of users
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users"); // Replace with your API endpoint to fetch users
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Function to handle ban status change
  const handleBanStatusChange = async () => {
    try {
      // Make an API call to update the user's status to "ban"
      await fetch(`/api/users`, {
        method: "PUT",
        body: JSON.stringify({
          status: selectedUser?.status === "ban" ? "active" : "ban",
          id: selectedUser?._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpen(false);
      // Refresh the list of users
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Fetch the list of users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 &&
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.status === "active" ? "ACTIVE" : "BANNED"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUserSelect(user)}
                    >
                      {user.status === "active" ? "Ban" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ban User</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to{" "}
            {selectedUser?.status === "active" ? "Ban" : "Activate"}{" "}
            {selectedUser?.name}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleBanStatusChange}>
            {selectedUser?.status === "active" ? "Ban" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
