const { db } = require('../config/db');

const create = async ({ vehicle_id, trip_id, category, amount, description, expense_date }) => {
  const stmt = db.prepare(`
    INSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date)
    VALUES (?, ?, ?, ?, ?, COALESCE(?, date('now')))
  `);
  const info = stmt.run(vehicle_id, trip_id, category, amount, description, expense_date);
  return findById(info.lastInsertRowid);
};

const findAll = async () => {
  const stmt = db.prepare(`
    SELECT e.*, v.plate_number, t.trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    ORDER BY e.id DESC
  `);
  return stmt.all();
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT e.*, v.plate_number, t.trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    WHERE e.id = ?
  `);
  return stmt.get(id);
};

const update = async (id, { vehicle_id, trip_id, category, amount, description, expense_date }) => {
  const stmt = db.prepare(`
    UPDATE expenses
    SET vehicle_id = ?, trip_id = ?, category = ?, amount = ?, description = ?, expense_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(vehicle_id, trip_id, category, amount, description, expense_date, id);
  return findById(id);
};

const remove = async (id) => {
  const expense = await findById(id);
  const stmt = db.prepare(`
    DELETE FROM expenses
    WHERE id = ?
  `);
  stmt.run(id);
  return expense;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
