import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {createUser, getUserById, getUserByEmail} from "../db/queries/users.js";
import { verifyUserToken } from "../middleware/auth.js";


const router = express.Router();
const SALT_ROUNDS = 10;

//users/register
router.post("/register", async (req, res) => {
  const { pet_name, owner_name, animal, breed, email, address, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: "Email and password required" });

  const existing = await getUserByEmail(email);
  if (existing) return res.status(400).send({ error: "This Email already has an account" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({pet_name, owner_name, animal, breed, email, address, password: hashed });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
  res.send({ token });
});

//users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: "Email and password required" });

  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
  res.send({ token });
});

// GET for account page//
router.get("/account", verifyUserToken , async (req, res) => {
  const user = await getUserById(req.user.userId);
  res.send(user);
});



export default router;

