import db from "../client.js"

//CREATE VET//
export async function createVet({email, password, first_name, last_name, profile_image_url}){
    const sql=`
    INSERT INTO vets(email, password, first_name, last_name, profile_image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const {rows:vet} = await db.query(sql, [email, password, first_name, last_name, profile_image_url]);
    return vet[0]
}

//GET VET BY ID//
export async function getVetById(id){
    const sql = `
    SELECT *
    FROM vets
    WHERE id = $1;
    `;
    const {rows: vet} = await db.query(sql, [id]);
    return vet[0];

}

//GET VET BY Email - query for login - Ash

export async function getVetByEmail(email){
    const sql = `
    SELECT *
    FROM vets
    WHERE email = $1;
    `;
    const {rows: vet} = await db.query(sql, [email]);
    return vet[0];

}
