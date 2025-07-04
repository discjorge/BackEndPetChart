import db from "../client.js";

// Create a new appointment
export async function createAppointment({
  user_id,
  vet_id,
  time,
  appointment_reason,
}) {
  const sql = `
    INSERT INTO appointments (user_id, vet_id, time, appointment_reason)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows: appointment } = await db.query(sql, [
    user_id,
    vet_id,
    time,
    appointment_reason,
  ]);
  return appointment[0];
}

// Get all appointments
export async function getAllAppointments() {
  const sql = `
    SELECT * FROM appointments
    ORDER BY time
  `;
  const { rows } = await db.query(sql);
  return rows;
}

// Get appointments for user
export async function getAppointmentsByUser(user_id) {
  const sql = `
    SELECT * FROM appointments
    WHERE user_id = $1
    ORDER BY time
  `;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
}

// Get appointments for vet
export async function getAppointmentsByVet(vet_id, user_id) {
  const sql = `
    SELECT * FROM appointments
    WHERE vet_id = $1 AND $2
    ORDER BY time
  `;
  const { rows } = await db.query(sql, [vet_id]);
  return rows;
}
