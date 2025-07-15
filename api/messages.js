import express from "express";
import { createMessage, getMessageByUser,getMessagesBetweenVetAndUser ,getUsersByAppointment, markMessageAsSeen } from "../db/queries/messages.js";
import { verifyUserToken, verifyVetToken } from "../middleware/auth.js";

const router = express.Router();


//THIS ROUTE IF FOR USErS CREATING MESSAGES -mark
router.post("/", verifyUserToken, async (req, res) => {
const {user_id, vet_id, note, seen} = req.body;

if(!user_id || !vet_id || !note || seen === undefined) {
    return res.status(400).json({error: "Missing required params"})
}

const message = await createMessage({user_id, vet_id, note, seen});

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
    seen: false,
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

//THIS ROUTE IS FOR GETTING ALL USERS THE VET HAS AN APPOINTMENT WITH -mark
router.get("/vet/users", verifyVetToken, async (req, res) => {
  const vetID = req.vet.vetId;
  if (!vetID) return res.status(404).json({ error: "Vet ID not found" });

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

//THIS ROUTE MARKS MESSAGES AS SEEN -mark
router.put("/:id/seen", async (req, res) =>{
const messageID = parseInt(req.params.id);
    if(!messageID)
        returnres,status(400).json({error: "Invalid message ID" })

    const updatedMessage = await markMessageAsSeen(messageID);
    res.json(updatedMessage)
});


export default router;
