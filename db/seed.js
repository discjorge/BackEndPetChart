import db from "./client.js";
import { createMessage } from "./queries/messages.js";
import { createUser } from "./queries/users.js";
import {createVet} from "./queries/vets.js";
import {createAppointment} from "./queries/appoinments.js";
import bcrypt from "bcrypt"



await db.connect();
await seed();
console.log("🌱 Database seeded.");
await db.end();


async function seed() {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);


    //Seeding a Message -Mark//
const firstUser = await createUser({
    pet_name: "Spike", 
    owner_name: "Mike", 
    animal: "Dog", 
    breed: "Lab", 
    email: "mike@email.com", 
    password: hashedPassword,
    address: "123 House St."

})

//Seeding a Message -Mark//
const firstVet = await createVet({
    email: "vet@petchart.com",
    password: hashedPassword,
    first_name: "John", 
    last_name: "Smith", 
    profile_image_url:"https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg"
})

//Seeding a Message -Mark//
const firstAppointment = await createAppointment({
    user_id: 1, 
    vet_id: 1, 
    time: "2025-07-24 17:00", 
    appointment_reason: "Spike needs shots"
})


//Seeding a Message -Mark//
const firstMessage = await createMessage({
    user_id: 1, 
    vet_id: 1, 
    note: "WOW! the first ever message!",
    seen: false
})

}


