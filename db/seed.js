import db from "./client.js";
import { createMessage } from "./queries/messages.js";
import { createUser } from "./queries/users.js";
import {createVet} from "./queries/vets.js";
import {createAppointment} from "./queries/appointments.js";
import bcrypt from "bcrypt"



await db.connect();
await seed();
console.log("🌱 Database seeded.");
await db.end();


async function seed() {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);


    //Seeding Users -Mark//
const firstUser = await createUser({
    pet_name: "Spike", 
    owner_name: "Mike", 
    animal: "Dog", 
    breed: "Lab", 
    email: "mike@email.com", 
    password: hashedPassword,
    address: "123 House St.",
    pet_image_url:"https://image10.photobiz.com/8495/28_20220226150052_6422823_xlarge.jpg"
})

const secondUser = await createUser({
    pet_name: "Fluffy", 
    owner_name: "Alice Smith", 
    animal: "Dog", 
    breed: "Labrador", 
    email: "alice.smith@example.com", 
    password: hashedPassword,
    address: "456 Oak Ave.",
    pet_image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"
})

const thirdUser = await createUser({
    pet_name: "Alfred", 
    owner_name: "Ashley Pyka", 
    animal: "Dog", 
    breed: "Golden Retriever", 
    email: "pyka.ashley@gmail.com", 
    password: hashedPassword,
    address: "789 Pine St.",
    pet_image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop"
})

//Seeding a Message -Mark//
const firstVet = await createVet({
    email: "vet@petchart.com",
    password: hashedPassword,
    first_name: "John", 
    last_name: "Smith", 
    profile_image_url:"https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg"
})

//Seeding Appointments -Mark//
const firstAppointment = await createAppointment({
    user_id: 1, 
    vet_id: 1, 
    time: "2025-07-24 17:00", 
    appointment_reason: "Spike needs shots"
})

// Additional appointments for vet@petchart.com
const secondAppointment = await createAppointment({
    user_id: 1, 
    vet_id: 1, 
    time: "2025-01-15 10:00", 
    appointment_reason: "Annual checkup for Spike"
})

const thirdAppointment = await createAppointment({
    user_id: 2, 
    vet_id: 1, 
    time: "2025-01-16 14:30", 
    appointment_reason: "Fluffy needs vaccinations"
})

const fourthAppointment = await createAppointment({
    user_id: 3, 
    vet_id: 1, 
    time: "2025-01-17 11:00", 
    appointment_reason: "Alfred wellness exam"
})


//Seeding a Message -Mark//
const firstMessage = await createMessage({
    user_id: 1, 
    vet_id: 1, 
    note: "WOW! the first ever message!",
    seen: false
})

}


