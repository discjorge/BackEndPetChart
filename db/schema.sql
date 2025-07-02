DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS vets;


-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    pet_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    animal TEXT NOT NULL,
    breed TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    pet_image_url TEXT
);

-- Vets table
CREATE TABLE vets (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_image_url TEXT NOT NULL
);

-- Appointment table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  vet_id INTEGER REFERENCES vets(id),
  time TIMESTAMP NOT NULL,
  appointment_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    vet_id INTEGER REFERENCES vets(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT Now(),
    read_level INTEGER NOT NULL

)