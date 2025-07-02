import db from "./client.js"
import { createMessage } from "./queries/messages.js"

await db.connect();
await seed();
console.log("🌱 Database seeded.");
await db.end();

async function seed() {
//Seeding a Message -Mark//
const firstMessage = await createMessage({
    user_id: 1, 
    vet_id: 1, 
    note: "WOW! the first ever message!",
    time_stamp: new Date(),
    read_level: 1
})

}
