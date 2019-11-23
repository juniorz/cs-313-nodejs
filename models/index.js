"use strict";

const pool = require('../db');

//TODO: make it configurable
const familyId = 1;
const userId = 1;

let getTransaction = async (id) => {
    const q = `
    SELECT t.*, u.name as user_name, c.name as category_name
    FROM transactions t
    INNER JOIN users u
      ON t.user_id = u.id
    INNER JOIN categories c
      ON t.category_id = c.id
      AND t.family_id = c.family_id
    WHERE t.id = $1
      AND t.family_id = $2
    `;

    const {rows} = await pool.query(q, [id, familyId]);
    return rows;
};
  
let insertTransaction = async (values) => {
    let q = `
    INSERT INTO transactions
    (amount, date, category_id, description, user_id, family_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `;

    const {rows} = await pool.query(q, [
        values.amount,
        values.date,
        values.category_id,
        values.description,
        userId,
        familyId,
    ]);

    // Return the inserted object id
    return rows[0];
};
  
let getTransactions = async () => {
    let q = `
    SELECT t.*, u.name as user_name, c.name as category_name
    FROM transactions t
    INNER JOIN users u
      ON t.user_id = u.id
    INNER JOIN categories c
      ON t.category_id = c.id
      AND t.family_id = c.family_id
    WHERE t.family_id = $1
    ORDER BY t.date DESC
    `;
  
    const {rows} = await pool.query(q, [
      familyId,
    ]);
  
    return rows;
};


let getCategories = async () => {
    let q = `
    SELECT c.id, c.name, c.amount, c.protected, c.amount - COALESCE(SUM(t.amount), '0.00'::money) as balance
    FROM categories c
    LEFT JOIN transactions t
      ON c.id = t.category_id
      AND c.family_id = t.family_id
    WHERE c.family_id = $1
    GROUP BY c.id
    ORDER BY c.name ASC
    `;
  
    const {rows} = await pool.query(q, [
      familyId,
    ]);
  
    return rows;
};


module.exports = {
    Transaction: {
        get: getTransaction,
        insert: insertTransaction,
        all: getTransactions,
    },
    Categories: {
        all: getCategories,
    },
};
