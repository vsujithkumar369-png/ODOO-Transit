const { db } = require('../config/db');

const create = async ({ vehicle_id, description, cost }) => {
  const stmt = db.prepare(`
    INSERT INTO maintenance (vehicle_id, description, cost, status)
    VALUES (?, ?, ?, 'Open')
  `);
  const info = stmt.run(vehicle_id, description, cost || 0.00);
  return findById(info.lastInsertRowid);
};

const findAll = async () => {
  const stmt = db.prepare(`
    SELECT m.*, v.plate_number, v.model as vehicle_model
    FROM maintenance m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    ORDER BY m.id DESC
  `);
  return stmt.all();
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT m.*, v.plate_number, v.model as vehicle_model
    FROM maintenance m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    WHERE m.id = ?
  `);
  return stmt.get(id);
};

const close = async (id, cost) => {
  const stmt = db.prepare(`
    UPDATE maintenance
    SET status = 'Closed', cost = COALESCE(?, cost), end_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(cost, id);
  return findById(id);
};

const remove = async (id) => {
  const log = await findById(id);
  const stmt = db.prepare(`
    DELETE FROM maintenance
    WHERE id = ?
  `);
  stmt.run(id);
  return log;
};

module.exports = {
  create,
  findAll,
  findById,
  close,
  remove
};
