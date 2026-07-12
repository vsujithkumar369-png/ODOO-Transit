const { db } = require('../config/db');

const create = async ({ trip_number, vehicle_id, driver_id, cargo_weight, start_location, end_location }) => {
  const stmt = db.prepare(`
    INSERT INTO trips (trip_number, vehicle_id, driver_id, cargo_weight, status, start_location, end_location)
    VALUES (?, ?, ?, ?, 'Draft', ?, ?)
  `);
  const info = stmt.run(trip_number, vehicle_id, driver_id, cargo_weight, start_location, end_location);
  return findById(info.lastInsertRowid);
};

const findAll = async () => {
  const stmt = db.prepare(`
    SELECT t.*, v.plate_number, v.model as vehicle_model, u.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY t.id DESC
  `);
  return stmt.all();
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT t.*, v.plate_number, v.model as vehicle_model, u.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE t.id = ?
  `);
  return stmt.get(id);
};

const update = async (id, { vehicle_id, driver_id, cargo_weight, start_location, end_location }) => {
  const stmt = db.prepare(`
    UPDATE trips
    SET vehicle_id = ?, driver_id = ?, cargo_weight = ?, start_location = ?, end_location = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(vehicle_id, driver_id, cargo_weight, start_location, end_location, id);
  return findById(id);
};

const updateStatus = async (id, status) => {
  const stmt = db.prepare(`
    UPDATE trips
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(status, id);
  return findById(id);
};

const dispatch = async (id) => {
  const stmt = db.prepare(`
    UPDATE trips
    SET status = 'Dispatched', dispatch_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(id);
  return findById(id);
};

const complete = async (id) => {
  const stmt = db.prepare(`
    UPDATE trips
    SET status = 'Completed', completion_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(id);
  return findById(id);
};

const cancel = async (id) => {
  const stmt = db.prepare(`
    UPDATE trips
    SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(id);
  return findById(id);
};

const remove = async (id) => {
  const trip = await findById(id);
  const stmt = db.prepare(`
    DELETE FROM trips
    WHERE id = ?
  `);
  stmt.run(id);
  return trip;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  updateStatus,
  dispatch,
  complete,
  cancel,
  remove
};
