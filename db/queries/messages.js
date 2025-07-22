import db from "../client.js"

// CREATE MESSAGE
export async function createMessage({ user_id, vet_id, note, sender }) {
  const sql = `
    INSERT INTO messages(user_id, vet_id, note, sender)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows: message } = await db.query(sql, [user_id, vet_id, note, sender]);
  return message[0];
}

// USER MESSAGE CENTER - Mark
export async function getFullThreadForUser(user_id) {
  const sql = `
    SELECT *
    FROM messages
    WHERE user_id = $1
    ORDER BY created_at ASC;
  `;
  const { rows: messages } = await db.query(sql, [user_id]);
  return messages;
}

// VET MESSAGE CENTER - Mark
export async function getFullThreadForVet(vet_id, user_id) {
  const sql = `
    SELECT *
    FROM messages
    WHERE vet_id = $1 AND user_id = $2
    ORDER BY created_at ASC;
  `;
  const { rows: messages } = await db.query(sql, [vet_id, user_id]);
  return messages;
}

// USER DASHBOARD MESSAGES -Mark
export async function getRecentMessagesForUser(user_id) {
  const sql = `
    SELECT 
      m.*,
      v.first_name AS vet_first_name,
      v.last_name AS vet_last_name
    FROM messages m
    JOIN vets v ON m.vet_id = v.id
    WHERE m.user_id = $1
    ORDER BY m.created_at DESC
    LIMIT 5;
  `;
  const { rows: messages } = await db.query(sql, [user_id]);
  return messages;
}

// VET DASHBOARD MESSAGES -Mark
export async function getRecentMessagesForVet(vet_id) {
  const sql = `
    SELECT 
      m.*,
      u.owner_name AS user_name,
      u.pet_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.vet_id = $1
    ORDER BY m.created_at DESC
    LIMIT 5;
  `;
  const { rows: messages } = await db.query(sql, [vet_id]);
  return messages;
}

// FOR VETSIDE MESSAGES CENTER USER LIST - Mark
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
 