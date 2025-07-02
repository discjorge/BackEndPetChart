import db from "../client.js"

//CREATE USER
export async function createUser({pet_name, owner_name, animal, breed, email, address}){
    const sql=`
    INSERT INTO users (pet_name, owner_name, animal, breed, email, address)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;
    const {rows:user} = await db.query(sql, [pet_name, owner_name, animal, breed, email, address]);
    return user[0]
}