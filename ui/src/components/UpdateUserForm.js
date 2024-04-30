import React, { useState } from "react";
import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { API_URL } from "../utils";

export const UpdateUserForm = ({
  fetchUsers,
  isDialogOpen,
  setIsDialogOpen,
  user,
}) => {
  const { id, completed } = user;
  const [userName, setUserName] = useState("");

  const handleUpdateUserName = async () => {
    try {
      await axios.put(API_URL, {
        id,
        name: userName,
        completed,
      });

      await fetchUsers();

      setUserName("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit User</DialogTitle>
      <div className="dialog">
        <TextField
          size="small"
          label="User"
          variant="outlined"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={async () => {
            await handleUpdateUserName();
            
            setIsDialogOpen(false);
          }}
        >
          <CheckIcon />
        </Button>
      </div>
    </Dialog>
  );
};
