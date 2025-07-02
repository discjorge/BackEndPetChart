DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES pets(id),
    vet_id INTEGER REFERENCES vets(id),
    note TEXT NOT NULL,
    time_stamp TIMESTAMP DEFAULT Now(),
    read_level INTEGER NOT NULL

)