import db from "./client.js";
import { createMessage } from "./queries/messages.js";
import { createUser, getUserByEmail } from "./queries/users.js";
import { createVet, getVetByEmail } from "./queries/vets.js";
import { createAppointment } from "./queries/appointments.js";
import bcrypt from "bcrypt";

await db.connect();
await seed();
console.log("🌱 Database seeded.");
await db.end();

async function seed() {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

  //Seeding Users -Mark//
  let firstUser = await getUserByEmail("mike@email.com");
  if (!firstUser) {
    firstUser = await createUser({
      pet_name: "Spike",
      owner_name: "Mike",
      animal: "Dog",
      breed: "Lab",
      email: "mike@email.com",
      password: hashedPassword,
      address: "123 House St.",
      pet_image_url:
        "https://image10.photobiz.com/8495/28_20220226150052_6422823_xlarge.jpg",
    });
  }

  let secondUser = await getUserByEmail("alice.smith@example.com");
  if (!secondUser) {
    secondUser = await createUser({
      pet_name: "Fluffy",
      owner_name: "Alice Smith",
      animal: "Dog",
      breed: "Labrador",
      email: "alice.smith@example.com",
      password: hashedPassword,
      address: "456 Oak Ave.",
      pet_image_url:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    });
  }

  let thirdUser = await getUserByEmail("pyka.ashley@gmail.com");
  if (!thirdUser) {
    thirdUser = await createUser({
      pet_name: "Alfred",
      owner_name: "Ashley Pyka",
      animal: "Dog",
      breed: "Golden Retriever",
      email: "pyka.ashley@gmail.com",
      password: hashedPassword,
      address: "789 Pine St.",
      pet_image_url:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    });
  }

  //Seeding a Vet -Mark//
  let firstVet = await getVetByEmail("vet@petchart.com");
  if (!firstVet) {
    firstVet = await createVet({
      email: "vet@petchart.com",
      password: hashedPassword,
      first_name: "John",
      last_name: "Smith",
      profile_image_url:
        "https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg",
    });
  }

  //Seeding Appointments -Mark//
  const firstAppointment = await createAppointment({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    time: "2025-07-24 17:00",
    appointment_reason: "Spike needs shots",
  });

  // Additional appointments for vet@petchart.com - Ash
  const secondAppointment = await createAppointment({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    time: "2025-01-15 10:00",
    appointment_reason: "Annual checkup for Spike",
  });

  const thirdAppointment = await createAppointment({
    user_id: secondUser.id,
    vet_id: firstVet.id,
    time: "2025-01-16 14:30",
    appointment_reason: "Fluffy needs vaccinations",
  });

  const fourthAppointment = await createAppointment({
    user_id: thirdUser.id,
    vet_id: firstVet.id,
    time: "2025-01-17 11:00",
    appointment_reason: "Alfred wellness exam",
  });

  
  // Messages from users to vet - Adding a lot more messages to test the dashboard component - Ash
  const firstMessage = await createMessage({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    note: "WOW! the first ever message!",
    sender: "vet",
  });

  const secondMessage = await createMessage({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    note: "Spike has been acting strange lately, should I be concerned?",
    seen: true,
  });

  const thirdMessage = await createMessage({
    user_id: secondUser.id,
    vet_id: firstVet.id,
    note: "Fluffy's vaccinations are due next week, can we schedule an appointment?",
    seen: false,
  });

  const fourthMessage = await createMessage({
    user_id: secondUser.id,
    vet_id: firstVet.id,
    note: "Fluffy seems to be eating less than usual, is this normal?",
    seen: true,
  });

  const fifthMessage = await createMessage({
    user_id: thirdUser.id,
    vet_id: firstVet.id,
    note: "Alfred's wellness exam is coming up, any special preparations needed?",
    seen: false,
  });

  const sixthMessage = await createMessage({
    user_id: thirdUser.id,
    vet_id: firstVet.id,
    note: "Alfred has been more energetic lately, should I increase his exercise?",
    seen: false,
  });

  // Messages from vet to users - Adding a lot more messages to test the dashboard component - Ash
  const seventhMessage = await createMessage({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    note: "Hi Mike! Spike's blood work results came back normal. See you at the next appointment!",
    seen: false,
  });

  const eighthMessage = await createMessage({
    user_id: firstUser.id,
    vet_id: firstVet.id,
    note: "Don't forget Spike's flea and tick prevention this month!",
    seen: true,
  });

  const ninthMessage = await createMessage({
    user_id: secondUser.id,
    vet_id: firstVet.id,
    note: "Alice, Fluffy's appointment is confirmed for next Tuesday at 2:30 PM.",
    seen: false,
  });

  const tenthMessage = await createMessage({
    user_id: secondUser.id,
    vet_id: firstVet.id,
    note: "Fluffy's weight is perfect! Keep up the good work with his diet.",
    seen: false,
  });

  const eleventhMessage = await createMessage({
    user_id: thirdUser.id,
    vet_id: firstVet.id,
    note: "Ashley, Alfred's wellness exam is scheduled for January 17th at 11:00 AM.",
    seen: false,
  });

  const twelfthMessage = await createMessage({
    user_id: thirdUser.id,
    vet_id: firstVet.id,
    note: "Alfred's increased energy is a great sign! More exercise is definitely beneficial.",
    seen: false,
  });
}
