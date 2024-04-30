import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchUsers, createUpdateUser, updateUsers, deleteUsers } from "./user.js";

const app = express();
const port = 3001;

app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const users = await fetchUsers(name);

    res.send(users.Items);
  } catch (err) {
    res.status(400).send(`Error fetching users: ${err}`);
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = req.body;
    const response = await createUpdateUser(user);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error creating users: ${err}`);
  }
});

app.put("/user", async (req, res) => {
  try {
    const user = req.body;

    const response = await updateUsers(user);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error updating users: ${err}`);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteUsers(id);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error deleting users: ${err}`);
  }
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
