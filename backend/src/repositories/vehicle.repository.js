const db = require('../config/db');

const create = async ({ plate_number, model, type, capacity, status }, client = db) => {
  const queryText = `
    INSERT INTO vehicles (plate_number, model, type, capacity, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [plate_number, model, type, capacity, status || 'Available'];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT * FROM vehicles
    WHERE status != 'Retired'
    ORDER BY id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT * FROM vehicles
    WHERE id = $1 AND status != 'Retired'
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const findByPlateNumber = async (plateNumber, client = db) => {
  const queryText = `
    SELECT * FROM vehicles
    WHERE plate_number = $1 AND status != 'Retired'
  `;
  const res = await client.query(queryText, [plateNumber]);
  return res.rows[0];
};

const update = async (id, { plate_number, model, type, capacity, status }, client = db) => {
  const queryText = `
    UPDATE vehicles
    SET plate_number = $1, model = $2, type = $3, capacity = $4, status = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND status != 'Retired'
    RETURNING *
  `;
  const values = [plate_number, model, type, capacity, status, id];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const updateStatus = async (id, status, client = db) => {
  const queryText = `
    UPDATE vehicles
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND status != 'Retired'
    RETURNING *
  `;
  const res = await client.query(queryText, [status, id]);
  return res.rows[0];
};

const softDelete = async (id, client = db) => {
  const queryText = `
    UPDATE vehicles
    SET status = 'Retired', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const findAvailable = async (client = db) => {
  const queryText = `
    SELECT * FROM vehicles
    WHERE status = 'Available'
    ORDER BY id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
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
