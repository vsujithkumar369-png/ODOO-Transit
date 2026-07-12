const db = require('../config/db');

const create = async ({ plate_number, model, type, capacity, region, status }, client = db) => {
  const queryText = `
    INSERT INTO vehicles (plate_number, model, type, capacity, region, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [plate_number, model, type, capacity, region || null, status || 'Available'];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (filters = {}, client = db) => {
  let queryText = `SELECT * FROM vehicles WHERE status != 'Retired'`;
  const values = [];
  let index = 1;

  if (filters.status) {
    queryText += ` AND status = $${index++}`;
    values.push(filters.status);
  }
  if (filters.type) {
    queryText += ` AND type = $${index++}`;
    values.push(filters.type);
  }
  if (filters.region) {
    queryText += ` AND region = $${index++}`;
    values.push(filters.region);
  }

  queryText += ` ORDER BY id DESC`;
  const res = await client.query(queryText, values);
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

const update = async (id, { plate_number, model, type, capacity, region, status }, client = db) => {
  const queryText = `
    UPDATE vehicles
    SET plate_number = $1, model = $2, type = $3, capacity = $4, region = $5, status = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7 AND status != 'Retired'
    RETURNING *
  `;
  const values = [plate_number, model, type, capacity, region || null, status, id];
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
