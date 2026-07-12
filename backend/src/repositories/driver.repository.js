const { db } = require('../config/db');

const create = async ({ user_id, license_number, license_expiry, safety_score, status }) => {
  const stmt = db.prepare(`
    INSERT INTO drivers (user_id, license_number, license_expiry, safety_score, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(user_id, license_number, license_expiry, safety_score || 100.00, status || 'Available');
  return findById(info.lastInsertRowid);
};

const findAll = async () => {
  const stmt = db.prepare(`
    SELECT d.*, u.name as user_name, u.email as user_email
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY d.id DESC
  `);
  return stmt.all();
};

const findById = async (id) => {
  const stmt = db.prepare(`
    SELECT d.*, u.name as user_name, u.email as user_email
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = ?
  `);
  return stmt.get(id);
};

const findByLicenseNumber = async (licenseNumber) => {
  const stmt = db.prepare(`
    SELECT * FROM drivers
    WHERE license_number = ?
  `);
  return stmt.get(licenseNumber);
};

const update = async (id, { user_id, license_number, license_expiry, safety_score, status }) => {
  const stmt = db.prepare(`
    UPDATE drivers
    SET user_id = ?, license_number = ?, license_expiry = ?, safety_score = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(user_id, license_number, license_expiry, safety_score, status, id);
  return findById(id);
};

const updateStatus = async (id, status, client) => {
  const stmt = db.prepare(`
    UPDATE drivers
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(status, id);
  return findById(id);
};

const remove = async (id) => {
  const driver = await findById(id);
  const stmt = db.prepare(`
    DELETE FROM drivers
    WHERE id = ?
  `);
  stmt.run(id);
  return driver;
};

const findAvailable = async () => {
  const stmt = db.prepare(`
    SELECT d.*, u.name as user_name
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.status = 'Available' AND d.license_expiry > date('now')
    ORDER BY d.id DESC
  `);
  return stmt.all();
};

module.exports = {
  create,
  findAll,
  findById,
  findByLicenseNumber,
  update,
  updateStatus,
  remove,
  findAvailable
};
