import db from "../client.js"

//CREATE USER
export async function createUser({pet_name, owner_name, animal, breed, email, password, address, pet_image_url}){
    const sql=`
    INSERT INTO users (pet_name, owner_name, animal, breed, email, password, address, pet_image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;
    const {rows:user} = await db.query(sql, [pet_name, owner_name, animal, breed, email, password, address, pet_image_url]);
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

//GET USER BY USERNAME - query for login - Ash

export async function getUserByEmail(email){
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;
    const {rows: user} = await db.query(sql, [email]);
    return user[0];

}

export async function getAllUsers(){
    const sql = `
    SELECT
        id,
        pet_name,
        owner_name,
        animal,
        breed,
        email,
        address,
        pet_image_url
    FROM users
    ORDER BY pet_name ASC;
    `;
    const {rows: users} = await db.query(sql);
    return users;
}