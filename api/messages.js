import express from "express";
import { createMessage, getMessageByUser, getMessageByVet } from "../db/queries/messages.js";
import { verifyUserToken, verifyVetToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/user", verifyUserToken, async (req, res,) => { // Middleware on this line
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

router.get("/vet", verifyVetToken, async (req, res) => {
    console.log("Decoded vet from token:", req.vet);
    const vetID = req.vet.vetId;
    if (!vetID){
        return res.status(404).send({error: "ID not found"});
    }

    const messages = await getMessageByVet({vet_id: vetID});
    if(messages.length === 0){
        return res.status(404).json({message: "You have no messages yet"});
    }
    res.send(messages);

});

router.post("/", verifyUserToken, async (req, res) => {
const {user_id, vet_id, note, read_level} = req.body;

if(!user_id || !vet_id || !note || read_level === undefined) {
    return res.status(400).json({error: "Missing required params"})
}

const message = await createMessage({user_id, vet_id, note, read_level});

res.status(201).json(message);


});

export default router;
