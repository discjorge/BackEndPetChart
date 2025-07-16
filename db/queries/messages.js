import db from "../client.js"

//CREATE MESSAGE
export async function createMessage({user_id, vet_id, note, sender}){
    const sql=`
    INSERT INTO messages(user_id, vet_id, note, sender)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const {rows:message} = await db.query(sql, [user_id, vet_id, note, sender]);
    return message[0]
}

//GET MESSAGES FOR USERS
export async function getMessageByUser({user_id}){
    const sql=`
    SELECT *
    FROM messages
    WHERE user_id = $1
    ORDER BY created_at ASC;
    `;
    const {rows:message} = await db.query(sql, [user_id]);
    return message
}

//GET MESSAGES FOR VETS 
export async function getMessagesBetweenVetAndUser({vet_id , user_id}) {
    const sql=`
    SELECT *
    FROM messages
    WHERE vet_id = $1 AND user_id =$2
    ORDER BY created_at DESC;
    `;
    const {rows:messages} = await db.query(sql, [vet_id, user_id]);
    return messages
}
 export async function getUsersByAppointment(vet_id) {
    const sql=`
    SELECT DISTINCT users.id, users.owner_name, users.pet_name
    FROM appointments
    JOIN users ON appointments.user_id = users.id
    WHERE appointments.vet_id = $1;
    `;
    const {rows:users} = await db.query(sql,[vet_id]);
    return users
 }
 