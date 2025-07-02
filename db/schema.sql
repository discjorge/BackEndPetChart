-- Appointment table
CREATE TABLE appointment (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pets(id),
  vet_id INTEGER REFERENCES vets(id),
  time TIMESTAMP NOT NULL,
  appointment_reason TEXT,
  time_stamp TIMESTAMP DEFAULT NOW()
);
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES pets(id),
    vet_id INTEGER REFERENCES vets(id),
    note TEXT NOT NULL,
    time_stamp TIMESTAMP DEFAULT Now(),
    read_level INTEGER NOT NULL

)