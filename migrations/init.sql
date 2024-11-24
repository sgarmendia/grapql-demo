CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES 
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Silvia', 'silvia@example.com'),
('Patricia', 'patry@example.com'),
('Ainara', 'ainara@example.com');