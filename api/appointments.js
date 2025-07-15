import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUser,
  getAppointmentsByVet,
  getAppointmentById,
  deleteAppointment,
} from "../db/queries/appointments.js";
import { getUserById } from "../db/queries/users.js";
import { getVetById } from "../db/queries/vets.js";

const router = express.Router();

//POST Create a new appointment
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

//GET /appointments — Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// GET /appointments/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await getAppointmentsByUser(userId);
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching user appointments:", err);
    res.status(500).json({ error: "Failed to fetch user appointments" });
  }
});

//GET /appointments/vets/:vetId
router.get("/vets/:vetId", async (req, res) => {
  try {
    const { vetId } = req.params;
    const appointments = await getAppointmentsByVet(vetId);
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching vet appointments:", err);
    res.status(500).json({ error: "Failed to fetch vet appointments" });
  }
});

//GET /appointments/vets/:vetId/patients
router.get("/vets/:vetId/patients", async (req, res) => {
  try {
    console.log("Fetching patients for vet ID:", req.params.vetId);
    const { vetId } = req.params;
    const appointments = await getAppointmentsByVet(vetId);
    console.log("Found appointments:", appointments);

    const uniqueUsers = [];
    const seenUserIds = new Set();

    for (const appointment of appointments) {
      if (!seenUserIds.has(appointment.user_id)) {
        const user = await getUserById(appointment.user_id);
        console.log("Found user:", user);
        uniqueUsers.push({
          user_id: user.id,
          owner_name: user.owner_name,
          pet_name: user.pet_name,
          animal: user.animal,
          breed: user.breed,
          email: user.email,
          pet_image_url: user.pet_image_url,
        });
        seenUserIds.add(appointment.user_id);
      }
    }

    console.log("Returning unique users:", uniqueUsers);
    res.json(uniqueUsers);
  } catch (err) {
    console.error("Error fetching vet patients:", err);
    res.status(500).json({ error: "Failed to fetch vet patients" });
  }
});

//GET /appointments/user/:userId/vets
router.get("/user/:userId/vets", async (req, res) => {
  try {
    console.log("Fetching vets for user ID:", req.params.userId);
    const { userId } = req.params;
    const appointments = await getAppointmentsByUser(userId);
    console.log("Found appointments:", appointments);

    const uniqueVets = [];
    const seenVetIds = new Set();

    for (const appointment of appointments) {
      if (!seenVetIds.has(appointment.vet_id)) {
        const vet = await getVetById(appointment.vet_id);
        console.log("Found vet:", vet);
        uniqueVets.push({
          vet_id: vet.id,
          first_name: vet.first_name,
          last_name: vet.last_name,
          email: vet.email,
          profile_image_url: vet.profile_image_url,
        });
        seenVetIds.add(appointment.vet_id);
      }
    }

    console.log("Returning unique vets:", uniqueVets);
    res.json(uniqueVets);
  } catch (err) {
    console.error("Error fetching user vets:", err);
    res.status(500).json({ error: "Failed to fetch user vets" });
  }
});

// GET /appointments/:appointmentId/associations
router.get("/:appointmentId/associations", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const user = await getUserById(appointment.user_id);
    const vet = await getVetById(appointment.vet_id);

    res.json({
      appointment,
      user: {
        id: user.id,
        owner_name: user.owner_name,
        pet_name: user.pet_name,
        email: user.email,
      },
      vet: {
        id: vet.id,
        first_name: vet.first_name,
        last_name: vet.last_name,
        email: vet.email,
      },
    });
  } catch (err) {
    console.error("Error fetching appointment associations:", err);
    res.status(500).json({ error: "Failed to fetch appointment associations" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

export default router;
