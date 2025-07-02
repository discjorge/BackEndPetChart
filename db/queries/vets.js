import db from "../client.js"

export async function createVet({first_name, last_name, profile_image_url}){
    const sql=`
    INSERT INTO vets(first_name, last_name, profile_image_url)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const {rows:vet} = await db.query(sql, [first_name, last_name, profile_image_url]);
    return vet[0]
}