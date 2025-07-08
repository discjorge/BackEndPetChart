import jwt from "jsonwebtoken"
import express from "express"
import dotenv from "dotenv"
import messagesRouter from "./api/messages.js"
import usersRouter from "./api/users.js"
import vetsRouter from "./api/vets.js"
import cors from "cors"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// app.use("/appointments", appointmentsRouter)
app.use("/users", usersRouter)
app.use("/vets", vetsRouter)
app.use("/messages", messagesRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});

export default app;