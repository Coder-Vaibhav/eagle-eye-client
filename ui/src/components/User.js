import { Button, Checkbox, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { UpdateUserForm } from "./UpdateUserForm";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const User = ({ user, fetchUsers }) => {
  const { id, name, completed } = user;
  const [isComplete, setIsComplete] = useState(completed);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateUserCompletion = async () => {
    try {
      await axios.put(API_URL, {
        id,
        name,
        completed: !isComplete,
      });
      setIsComplete((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/${user.id}`);

      await fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user">
      <div
        className={classnames("flex", {
          done: isComplete,
        })}
      >
        <Checkbox checked={isComplete} onChange={handleUpdateUserCompletion} />
        <Typography variant="h4">{name}</Typography>
      </div>
      <div className="userButtons">
        <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
          <EditIcon />
        </Button>
        <Button color="error" variant="contained" onClick={handleDeleteUser}>
          <DeleteIcon />
        </Button>
      </div>
      <UpdateUserForm
        fetchUsers={fetchUsers}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        user={user}
      />
    </div>
  );
};
