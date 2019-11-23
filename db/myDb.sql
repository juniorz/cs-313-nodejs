-- Create a database on your server.
-- Create the tables you will need for your project.
-- Choose appropriate data types for each column.
-- Ensure that each table has an appropriate primary key.
-- Include foreign key constraints wherever possible.
-- Eliminate data redundancy wherever possible.

CREATE DATABASE family_budget;

\c family_budget

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS families (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS family_memberships (
    user_id INT REFERENCES users(id),
    family_id INT REFERENCES families(id),
    confirmed BOOLEAN DEFAULT false,

    PRIMARY KEY (user_id, family_id)
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    family_id INT NOT NULL REFERENCES families(id),
    name VARCHAR(255),
    protected BOOLEAN DEFAULT false,
    amount MONEY DEFAULT 0 NOT NULL,
    unique (family_id, name)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    family_id INT REFERENCES families(id),
    category_id INT REFERENCES categories(id),
    amount MONEY DEFAULT 0,
    date DATE NOT NULL,
    description TEXT
);

INSERT INTO users (name, email, password)
VALUES ('John', 'john@email.com', 'secret');

INSERT INTO families (id) VALUES (1);

INSERT INTO family_memberships (user_id, family_id, confirmed)
VALUES (1, 1, true);

INSERT INTO categories (family_id, name, protected, amount)
VALUES (1, 'Income', 'true', 0);

