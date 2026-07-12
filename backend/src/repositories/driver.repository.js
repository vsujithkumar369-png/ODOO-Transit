const db = require('../config/db');

const create = async ({ user_id, license_number, license_expiry, safety_score, status }, client = db) => {
  const queryText = `
    INSERT INTO drivers (user_id, license_number, license_expiry, safety_score, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [user_id, license_number, license_expiry, safety_score || 100.00, status || 'Available'];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT d.*, u.name as user_name, u.email as user_email
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY d.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT d.*, u.name as user_name, u.email as user_email
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const findByLicenseNumber = async (licenseNumber, client = db) => {
  const queryText = `
    SELECT * FROM drivers
    WHERE license_number = $1
  `;
  const res = await client.query(queryText, [licenseNumber]);
  return res.rows[0];
};

const update = async (id, { user_id, license_number, license_expiry, safety_score, status }, client = db) => {
  const queryText = `
    UPDATE drivers
    SET user_id = $1, license_number = $2, license_expiry = $3, safety_score = $4, status = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [user_id, license_number, license_expiry, safety_score, status, id];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const updateStatus = async (id, status, client = db) => {
  const queryText = `
    UPDATE drivers
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const res = await client.query(queryText, [status, id]);
  return res.rows[0];
};

const remove = async (id, client = db) => {
  const queryText = `
    DELETE FROM drivers
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const findAvailable = async (client = db) => {
  const queryText = `
    SELECT d.*, u.name as user_name
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.status = 'Available' AND d.license_expiry > CURRENT_DATE
    ORDER BY d.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
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
