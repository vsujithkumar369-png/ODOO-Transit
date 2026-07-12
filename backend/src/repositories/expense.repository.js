const db = require('../config/db');

const create = async ({ vehicle_id, trip_id, category, amount, description, expense_date }, client = db) => {
  const queryText = `
    INSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date)
    VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
    RETURNING *
  `;
  const values = [vehicle_id, trip_id, category, amount, description, expense_date];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT e.*, v.plate_number, t.trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    ORDER BY e.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT e.*, v.plate_number, t.trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    WHERE e.id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const update = async (id, { vehicle_id, trip_id, category, amount, description, expense_date }, client = db) => {
  const queryText = `
    UPDATE expenses
    SET vehicle_id = $1, trip_id = $2, category = $3, amount = $4, description = $5, expense_date = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const values = [vehicle_id, trip_id, category, amount, description, expense_date, id];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const remove = async (id, client = db) => {
  const queryText = `
    DELETE FROM expenses
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
  update,
  remove
};
