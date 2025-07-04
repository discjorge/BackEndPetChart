import db from "../client.js"

//CREATE USER
export async function createUser({pet_name, owner_name, animal, breed, email, password, address}){
    const sql=`
    INSERT INTO users (pet_name, owner_name, animal, breed, email, password, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `;
    const {rows:user} = await db.query(sql, [pet_name, owner_name, animal, breed, email, password, address]);
    return user[0]
}
//GET USER BY ID//
export async function getUserById(id){
    const sql = `
    SELECT *
    FROM users
    WHERE id = $1;
    `;
    const {rows: user} = await db.query(sql, [id]);
    return user[0];

}

//GET USER BY USERNAME **for log in??**

export async function getUserByEmail(email){
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;
    const {rows: user} = await db.query(sql, [email]);
    return user[0];

}