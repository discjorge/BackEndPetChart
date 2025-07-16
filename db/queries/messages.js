import db from "../client.js"

//CREATE MESSAGE
export async function createMessage({user_id, vet_id, note, seen = false}){
    const sql=`
    INSERT INTO messages(user_id, vet_id, note, seen)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const {rows:message} = await db.query(sql, [user_id, vet_id, note, seen]);
    return message[0]
}

export async function markMessageAsSeen(message_id) {
  const sql = `
    UPDATE messages
    SET seen = true
    WHERE id = $1
    RETURNING *;
  `;
  const { rows:message } = await db.query(sql, [message_id]);
  return message[0];
}

//GET MESSAGES FOR USERS
export async function getMessageByUser({user_id}){
    const sql=`
    SELECT 
        m.id,
        m.user_id,
        m.vet_id,
        m.note,
        m.created_at,
        m.seen,
        v.first_name,
        v.last_name
    FROM messages m
    JOIN vets v ON m.vet_id = v.id
    WHERE m.user_id = $1
    ORDER BY m.created_at DESC;
    `;
    const {rows:message} = await db.query(sql, [user_id]);
    return message
}

//GET MESSAGES FOR VETS
export async function getMessageByVet({vet_id}){
    const sql=`
    SELECT 
        m.id,
        m.user_id,
        m.vet_id,
        m.note,
        m.created_at,
        m.seen,
        u.owner_name,
        u.pet_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.vet_id = $1
    ORDER BY m.created_at DESC;
    `;
    const {rows:messages} = await db.query(sql, [vet_id]);
    return messages
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