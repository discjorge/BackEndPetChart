import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createVet, getVetByEmail, getVetById } from "../db/queries/vets.js";
import { verifyVetToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const SALT_ROUNDS = 10;
const upload = multer({ dest: "uploads/" });

// vets/register
router.post("/register", upload.single("profile_image"), async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  let profile_image_url = null;
  if (req.file) {
    profile_image_url = `/uploads/${req.file.filename}`;
  }

  if (!email || !password || !first_name || !last_name || !profile_image_url) return res.status(400).send({ error: "All fields required" });

  const existing = await getVetByEmail(email);
  if (existing) return res.status(400).send({ error: "Email already taken" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const vet = await createVet({ email, password: hashed, first_name, last_name, profile_image_url });

  const token = jwt.sign({ vetId: vet.id, email: vet.email }, process.env.JWT_SECRET);
  res.send({ token });
});

// vets/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: "Email and password required" });

  const vet = await getVetByEmail(email);
  if (!vet) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, vet.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ vetId: vet.id, email: vet.email }, process.env.JWT_SECRET);
  res.send({ token });
});

// **GET for account page**//
router.get("/account", verifyVetToken, async (req, res) => {
  const vet = await getVetById(req.vet.vetId);
  res.send(vet);
});

export default router;
