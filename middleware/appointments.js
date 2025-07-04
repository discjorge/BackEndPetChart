import express from "express";
import {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
} from "../db/queries/appointments.js";

const router = express.Router();

// POST Create a new appointment
router.post("/", async (req, res) => {
  const { user_id, vet_id, time, appointment_reason } = req.body;

  try {
    const newAppointment = await createAppointment({
      user_id,
      vet_id,
      time,
      appointment_reason,
    });
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// GET /appointments — Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
