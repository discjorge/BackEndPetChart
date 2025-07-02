-- Appointment table
CREATE TABLE appointment (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pets(id),
  vet_id INTEGER REFERENCES vets(id),
  time TIMESTAMP NOT NULL,
  appointment_reason TEXT,
  time_stamp TIMESTAMP DEFAULT NOW()
);