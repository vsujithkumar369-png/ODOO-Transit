const { db } = require('../config/db');

const create = async ({ vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date }) => {
  const stmt = db.prepare(`
    INSERT INTO fuel_logs (vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date)
    VALUES (?, ?, ?, ?, ?, COALESCE(?, date('now')))
  `);
  const info = stmt.run(vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date);
  return findById(info.lastInsertRowid);
};

const findAll = async () => {
  const stmt = db.prepare(`
    SELECT f.*, v.plate_number, u.name as driver_name
    FROM fuel_logs f
    LEFT JOIN vehicles v ON f.vehicle_id = v.id
    LEFT JOIN drivers d ON f.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY f.id DESC
  `);
  return stmt.all();
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT f.*, v.plate_number, u.name as driver_name
    FROM fuel_logs f
    LEFT JOIN vehicles v ON f.vehicle_id = v.id
    LEFT JOIN drivers d ON f.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE f.id = ?
  `);
  return stmt.get(id);
};

const update = async (id, { vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date }) => {
  const stmt = db.prepare(`
    UPDATE fuel_logs
    SET vehicle_id = ?, driver_id = ?, fuel_quantity = ?, cost = ?, odometer_reading = ?, log_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date, id);
  return findById(id);
};

const remove = async (id) => {
  const log = await findById(id);
  const stmt = db.prepare(`
    DELETE FROM fuel_logs
    WHERE id = ?
  `);
  stmt.run(id);
  return log;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
