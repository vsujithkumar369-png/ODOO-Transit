const db = require('../config/db');

const create = async ({ vehicle_id, description, cost }, client = db) => {
  const queryText = `
    INSERT INTO maintenance (vehicle_id, description, cost, status)
    VALUES ($1, $2, $3, 'Open')
    RETURNING *
  `;
  const values = [vehicle_id, description, cost || 0.00];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT m.*, v.plate_number, v.model as vehicle_model
    FROM maintenance m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    ORDER BY m.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT m.*, v.plate_number, v.model as vehicle_model
    FROM maintenance m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    WHERE m.id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const close = async (id, cost, client = db) => {
  const queryText = `
    UPDATE maintenance
    SET status = 'Closed', cost = COALESCE($1, cost), end_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const res = await client.query(queryText, [cost, id]);
  return res.rows[0];
};

const remove = async (id, client = db) => {
  const queryText = `
    DELETE FROM maintenance
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

module.exports = {
  create,
  findAll,
  findById,
  close,
  remove
};
