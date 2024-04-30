import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_URL } from "../utils";

export const AddUserForm = ({ fetchUsers }) => {
  const [newUser, setNewUser] = useState("");

  const addNewUser = async () => {
    try {
      await axios.post(API_URL, {
        name: newUser,
        completed: false,
      });

      await fetchUsers();

      setNewUser("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
        My User
      </Typography>
      <div className="addUserForm">
        <TextField
          size="small"
          label="User"
          variant="outlined"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <Button
          disabled={!newUser.length}
          variant="outlined"
          onClick={addNewUser}
        >
          <AddIcon />
        </Button>
      </div>
    </div>
  );
};
