const { db } = require('../config/db');

const create = async ({ name, email, phone, password, role }) => {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, email, phone, password, role);
  return findById(info.lastInsertRowid);
};

const findByEmail = async (email) => {
  const stmt = db.prepare(`
    SELECT id, name, email, phone, password, role, created_at, updated_at
    FROM users
    WHERE email = ?
  `);
  return stmt.get(email);
};

const findByPhone = async (phone) => {
  const stmt = db.prepare(`
    SELECT id, name, email, phone, password, role, created_at, updated_at
    FROM users
    WHERE phone = ?
  `);
  return stmt.get(phone);
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT id, name, email, phone, role, created_at, updated_at
    FROM users
    WHERE id = ?
  `);
  return stmt.get(id);
};

const update = async (id, { name, email, phone }) => {
  const stmt = db.prepare(`
    UPDATE users
    SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(name, email, phone, id);
  return findById(id);
};

module.exports = {
  create,
  findByEmail,
  findByPhone,
  findById,
  update
};
