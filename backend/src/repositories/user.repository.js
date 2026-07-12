const db = require('../config/db');

const create = async ({ name, email, phone, password, role }, client = db) => {
  const queryText = `
    INSERT INTO users (name, email, phone, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at, updated_at
  `;
  const values = [name, email, phone, password, role];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findByEmail = async (email, client = db) => {
  const queryText = `
    SELECT id, name, email, phone, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const res = await client.query(queryText, [email]);
  return res.rows[0];
};

const findByPhone = async (phone, client = db) => {
  const queryText = `
    SELECT id, name, email, phone, password, role, created_at, updated_at
    FROM users
    WHERE phone = $1
  `;
  const res = await client.query(queryText, [phone]);
  return res.rows[0];
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT id, name, email, phone, role, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

module.exports = {
  create,
  findByEmail,
  findByPhone,
  findById
};
