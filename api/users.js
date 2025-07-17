import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {createUser, getUserById, getUserByEmail} from "../db/queries/users.js";
import {getVetByEmail} from "../db/queries/vets.js"; 
import { verifyUserToken, verifyVetToken } from "../middleware/auth.js";
import multer from "multer"; 


const router = express.Router();
const SALT_ROUNDS = 10;
const upload = multer({ dest: "uploads/" }); 

//Ash - GET /users/check-user-type - this is the route that is used to check if a user is a pet parent or a veterinarian at login for differen dash UX
router.get("/check-user-type", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email parameter required" });
  }

  try {
    // Check if email exists in pet parent database
    const petParent = await getUserByEmail(email);
    if (petParent) {
      return res.json({
        exists: true,
        userType: "pet-parent"
      });
    }

    const veterinarian = await getVetByEmail(email);
    if (veterinarian) {
      return res.json({
        exists: true,
        userType: "veterinarian"
      });
    }

    return res.json({
      exists: false,
      userType: null
    });

  } catch (error) {
    console.error("Error checking user type:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//Ash -users/register - this is the route that is used to register a new user
router.post("/register", upload.single("pet_image"), async (req, res) => { 
  const { pet_name, owner_name, animal, breed, email, address, password } = req.body;

  let pet_image_url = null; 
  if (req.file) { 
    pet_image_url = `/uploads/${req.file.filename}`; 
  } 

  if (!email || !password) return res.status(400).send({ error: "Email and password required" });

  const existing = await getUserByEmail(email);
  if (existing) return res.status(400).send({ error: "This Email already has an account" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({pet_name, owner_name, animal, breed, email, address, password: hashed, pet_image_url });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
  res.send({ token, user });

});

//Ash - users/login - this is the route that is used to login a user
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

//Get for messages page -mark
router.get("/:id", verifyVetToken, async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.send(user);
});


export default router;

