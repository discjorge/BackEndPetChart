import db from "../client.js"

//CREATE APPOINTMENT
export async function createAppointment({user_id, vet_id, time, appointment_reason}){
    const sql=`
    INSERT INTO appointments(user_id, vet_id, time, appointment_reason)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const {rows:appointment} = await db.query(sql, [user_id, vet_id, time, appointment_reason]);
    return appointment[0]
}