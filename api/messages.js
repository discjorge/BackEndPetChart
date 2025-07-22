import express from "express";
import {
  createMessage,
  getFullThreadForUser,
  getFullThreadForVet,
  getRecentMessagesForUser,
  getRecentMessagesForVet,
  getUsersByAppointment
} from "../db/queries/messages.js";
import { verifyUserToken, verifyVetToken } from "../middleware/auth.js";

const router = express.Router();

// USER SENDING MESSAGE - Mark
router.post("/user", verifyUserToken, async (req, res) => {
  const { user_id, vet_id, note } = req.body;

  if (!user_id || !vet_id || !note) {
    return res.status(400).json({ error: "Missing required params" });
  }

  const message = await createMessage({
    user_id,
    vet_id,
    note,
    sender: "user",
  });

  res.status(201).json(message);
});

// VET SENDING MESSAGE - Mark
router.post("/vet", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  const { user_id, note } = req.body;

  if (!user_id || !note) {
    return res.status(400).json({ error: "Missing required params" });
  }

  const message = await createMessage({
    user_id,
    vet_id: vetID,
    note,
    sender: "vet",
  });

  res.status(201).json(message);
});

// GET USER MESSAGE DASHBOARD -Mark
router.get("/user", verifyUserToken, async (req, res) => {
  const userID = req.user.userId;
  if (!userID) return res.status(404).json({ error: "User ID not found" });

  const messages = await getRecentMessagesForUser(userID);
  if (messages.length === 0) {
    return res.status(404).json({ message: "You have no messages yet" });
  }

  res.json(messages);
});

//  GET VET MESSAGE DASHBOARD -Mark
router.get("/vet", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  if (!vetID) return res.status(404).json({ error: "Vet ID not found" });

  const messages = await getRecentMessagesForVet(vetID);
  if (messages.length === 0) {
    return res.status(404).json({ message: "You have no messages yet" });
  }

  res.json(messages);
});

// GET USER MESSAGE CENTER THREAD -Mark
router.get("/user/thread", verifyUserToken, async (req, res) => {
  const userID = req.user.userId;

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  const messages = await getFullThreadForUser(userID);
  res.json(messages);
});

// GET VET MESSAGE CENTER THREAD -Mark
router.get("/vet/thread/:userId", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  const userID = parseInt(req.params.userId);

  if (!vetID || !userID) {
    return res.status(400).json({ error: "Missing vet or user ID" });
  }

  const messages = await getFullThreadForVet(vetID, userID);
  res.json(messages);
});

// GET USERS FOR VET USER MESSAGE LIST -Mark
router.get("/vet/users", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  if (!vetID) return res.status(404).json({ error: "Vet ID not found" });

  const users = await getUsersByAppointment(vetID);
  if (users.length === 0) {
    return res.status(404).json({ message: "No messages found" });
  }

  res.json(users);
});

export default router;
