import db from "../client.js"

//CREATE MESSAGE
export async function createMessage({user_id, vet_id, note, read_level}){
    const sql=`
    INSERT INTO messages(user_id, vet_id, note, read_level)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const {rows:message} = await db.query(sql, [user_id, vet_id, note, read_level]);
    return message[0]
}

//GET MESSAGES FOR USERS
export async function getMessageByUser({user_id}){
    const sql=`
    SELECT *
    FROM messages
    WHERE user_id = $1;
    `;
    const {rows:message} = await db.query(sql, [user_id]);
    return message
}

//GET MESSAGES FOR VETS
export async function getMessageByVet({vet_id}) {
    const sql=`
    SELECT *
    FROM messages
    WHERE uvet_id = $1;
    `;
    const {rows:message} = await db.query(sql, [vet_id]);
    return message
    
}
