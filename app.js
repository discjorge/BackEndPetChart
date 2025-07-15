import express from "express"
import dotenv from "dotenv"
import messagesRouter from "./api/messages.js"
import usersRouter from "./api/users.js"
import vetsRouter from "./api/vets.js"
import appointmentsRouter from "./api/appointments.js"
import cors from "cors"

dotenv.config();

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors({
  origin: true, 
  credentials: true
}));

// Test route to verify server is working
app.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Server is working!' });
});

app.use("/appointments", appointmentsRouter)
app.use("/users", usersRouter)
app.use("/vets", vetsRouter)
app.use("/messages", messagesRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});

export default app;