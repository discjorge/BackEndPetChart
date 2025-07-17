import express from "express";
import { createMessage, getMessageByUser, getMessageByVet, getMessagesBetweenVetAndUser ,getUsersByAppointment } from "../db/queries/messages.js";
import { verifyUserToken, verifyVetToken } from "../middleware/auth.js";

const router = express.Router();


//THIS ROUTE IF FOR USErS CREATING MESSAGES -mark
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

//THIS ROUTE IS FOR VETS CREATING MESSAGES -mark
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


//THIS ROUTE IS FOR GETTING ALL USER's MESSAGES FROM THE VET -mark

router.get("/user", verifyUserToken, async (req, res,) => { 
    const userID = req.user.userId;
    if (!userID){
        return res.status(404).send({error: "ID not found"});
    }

    const messages = await getMessageByUser({user_id: userID});
    if(messages.length === 0){
        return res.status(404).json({message: "You have no messages yet"});
    }
    res.send(messages);

});

//THIS ROUTE IS FOR GETTING ALL MESSAGES FOR A VET -mark --refactor a bit to add the query for dashboard component messages - Ash
router.get("/vet", verifyVetToken, async (req, res) => {
    const vetID = req.vet.vetId;
    if (!vetID){
        return res.status(404).send({error: "Vet ID not found"});
    }

    const messages = await getMessageByVet({vet_id: vetID});
    if(messages.length === 0){
        return res.status(404).json({message: "You have no messages yet"});
    }
    res.send(messages);
});

//THIS ROUTE IS FOR GETTING ALL USERS THE VET HAS AN APPOINTMENT WITH -mark
router.get("/vet/users", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  if (!vetID) return res.status(404).json({ error: "Vet ID not found" });

  console.log("Vet ID from token:", vetID);


  const users = await getUsersByAppointment(vetID);
  if (users.length === 0)
    return res.status(404).json({ message: "No messagesfound" });



  res.json(users);
});

//THIS ROUTE IS FOR VIEWING A SPECIFIC MESSAGE SENT BY A VET -mark
router.get("/vet/user/:userId", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  const userID = parseInt(req.params.userId);
  if (!vetID || !userID)
    return res.status(400).json({ error: "Missing vet or user ID" });

  const messages = await getMessagesBetweenVetAndUser({ vet_id: vetID, user_id: userID });
  res.json(messages);
});

export default router;
