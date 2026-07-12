const { db } = require('../config/db');

const create = async ({ plate_number, model, type, capacity, region, status }) => {
  const stmt = db.prepare(`
    INSERT INTO vehicles (plate_number, model, type, capacity, region, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(plate_number, model, type, capacity, region || null, status || 'Available');
  return findById(info.lastInsertRowid);
};

const findAll = async (filters = {}) => {
  let queryText = `SELECT * FROM vehicles WHERE status != 'Retired'`;
  const values = [];

  if (filters.status) {
    queryText += ` AND status = ?`;
    values.push(filters.status);
  }
  if (filters.type) {
    queryText += ` AND type = ?`;
    values.push(filters.type);
  }
  if (filters.region) {
    queryText += ` AND region = ?`;
    values.push(filters.region);
  }

  queryText += ` ORDER BY id DESC`;
  const stmt = db.prepare(queryText);
  return stmt.all(values);
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT * FROM vehicles
    WHERE id = ? AND status != 'Retired'
  `);
  return stmt.get(id);
};

const findByPlateNumber = async (plateNumber) => {
  const stmt = db.prepare(`
    SELECT * FROM vehicles
    WHERE plate_number = ? AND status != 'Retired'
  `);
  return stmt.get(plateNumber);
};

const update = async (id, { plate_number, model, type, capacity, region, status }) => {
  const stmt = db.prepare(`
    UPDATE vehicles
    SET plate_number = ?, model = ?, type = ?, capacity = ?, region = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status != 'Retired'
  `);
  stmt.run(plate_number, model, type, capacity, region || null, status, id);
  return findById(id);
};

const updateStatus = async (id, status, client) => {
  // We ignore the client parameter since SQLite uses a single connection
  const stmt = db.prepare(`
    UPDATE vehicles
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status != 'Retired'
  `);
  stmt.run(status, id);
  return findById(id);
};

const softDelete = async (id) => {
  const stmt = db.prepare(`
    UPDATE vehicles
    SET status = 'Retired', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(id);
  return findById(id);
};

const findAvailable = async () => {
  const stmt = db.prepare(`
    SELECT * FROM vehicles
    WHERE status = 'Available'
    ORDER BY id DESC
  `);
  return stmt.all();
};

module.exports = {
  create,
  findAll,
  findById,
  findByPlateNumber,
  update,
  updateStatus,
  softDelete,
  findAvailable
};
