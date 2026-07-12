const db = require('../config/db');

const create = async ({ trip_number, vehicle_id, driver_id, cargo_weight, start_location, end_location }, client = db) => {
  const queryText = `
    INSERT INTO trips (trip_number, vehicle_id, driver_id, cargo_weight, status, start_location, end_location)
    VALUES ($1, $2, $3, $4, 'Draft', $5, $6)
    RETURNING *
  `;
  const values = [trip_number, vehicle_id, driver_id, cargo_weight, start_location, end_location];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const findAll = async (client = db) => {
  const queryText = `
    SELECT t.*, v.plate_number, v.model as vehicle_model, u.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY t.id DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const findById = async (id, client = db) => {
  const queryText = `
    SELECT t.*, v.plate_number, v.model as vehicle_model, u.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE t.id = $1
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const update = async (id, { vehicle_id, driver_id, cargo_weight, start_location, end_location }, client = db) => {
  const queryText = `
    UPDATE trips
    SET vehicle_id = $1, driver_id = $2, cargo_weight = $3, start_location = $4, end_location = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [vehicle_id, driver_id, cargo_weight, start_location, end_location, id];
  const res = await client.query(queryText, values);
  return res.rows[0];
};

const updateStatus = async (id, status, client = db) => {
  const queryText = `
    UPDATE trips
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const res = await client.query(queryText, [status, id]);
  return res.rows[0];
};

const dispatch = async (id, client = db) => {
  const queryText = `
    UPDATE trips
    SET status = 'Dispatched', dispatch_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const complete = async (id, client = db) => {
  const queryText = `
    UPDATE trips
    SET status = 'Completed', completion_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const cancel = async (id, client = db) => {
  const queryText = `
    UPDATE trips
    SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const res = await client.query(queryText, [id]);
  return res.rows[0];
};

const remove = async (id, client = db) => {
  const queryText = `
    DELETE FROM trips
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
  updateStatus,
  dispatch,
  complete,
  cancel,
  remove
};
