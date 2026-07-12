const db = require('../config/db');

const create = async ({ vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date }, client = db) => {
  const queryText = `
    INSERT INTO fuel_logs (vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date)
    VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
    RETURNING *
  `;
  const values = [vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT f.*, v.plate_number, u.name as driver_name
    FROM fuel_logs f
    LEFT JOIN vehicles v ON f.vehicle_id = v.id
    LEFT JOIN drivers d ON f.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY f.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT f.*, v.plate_number, u.name as driver_name
    FROM fuel_logs f
    LEFT JOIN vehicles v ON f.vehicle_id = v.id
    LEFT JOIN drivers d ON f.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE f.id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const update = async (id, { vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date }, client = db) => {
  const queryText = `
    UPDATE fuel_logs
    SET vehicle_id = $1, driver_id = $2, fuel_quantity = $3, cost = $4, odometer_reading = $5, log_date = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const values = [vehicle_id, driver_id, fuel_quantity, cost, odometer_reading, log_date, id];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const remove = async (id, client = db) => {
  const queryText = `
    DELETE FROM fuel_logs
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
