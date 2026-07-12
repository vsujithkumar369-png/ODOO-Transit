const { db } = require('../config/db');
const response = require('../utils/response');

// Ensure the incidents table is created in SQLite
db.exec(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Low',
    incident_date DATE NOT NULL DEFAULT (date('now')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const getIncidents = async (req, res, next) => {
  try {
    const stmt = db.prepare(`
      SELECT i.*, v.plate_number, u.name as driver_name
      FROM incidents i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      LEFT JOIN drivers d ON i.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY i.id DESC
    `);
    const data = stmt.all();
    return response.success(res, 'Incident reports listed successfully', data);
  } catch (error) {
    next(error);
  }
};

const createIncident = async (req, res, next) => {
  try {
    const { vehicle_id, driver_id, description, severity, incident_date } = req.body;
    if (!description) {
      const error = new Error('Description is required');
      error.statusCode = 400;
      throw error;
    }
    const stmt = db.prepare(`
      INSERT INTO incidents (vehicle_id, driver_id, description, severity, incident_date)
      VALUES (?, ?, ?, ?, COALESCE(?, date('now')))
    `);
    const info = stmt.run(vehicle_id || null, driver_id || null, description, severity || 'Low', incident_date || null);
    
    const selectStmt = db.prepare(`
      SELECT i.*, v.plate_number, u.name as driver_name
      FROM incidents i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      LEFT JOIN drivers d ON i.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE i.id = ?
    `);
    const newIncident = selectStmt.get(info.lastInsertRowid);
    return response.success(res, 'Incident logged successfully', newIncident, 201);
  } catch (error) {
    next(error);
  }
};

const getDriverCompliance = async (req, res, next) => {
  try {
    const stmt = db.prepare(`
      SELECT d.id as driver_id, u.name as driver_name, d.license_number, d.license_expiry, d.safety_score, d.status,
             CASE WHEN d.license_expiry > date('now') THEN 'Compliant' ELSE 'Expired' END as compliance_status
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.id DESC
    `);
    const data = stmt.all();
    return response.success(res, 'Driver compliance status listed successfully', data);
  } catch (error) {
    next(error);
  }
};

const getVehicleSafety = async (req, res, next) => {
  try {
    const stmt = db.prepare(`
      SELECT v.id as vehicle_id, v.plate_number, v.model, v.status,
             CASE WHEN v.status = 'In Shop' THEN 'Under Maintenance' ELSE 'Inspected & Safe' END as safety_status
      FROM vehicles v
      WHERE v.status != 'Retired'
      ORDER BY v.id DESC
    `);
    const data = stmt.all();
    return response.success(res, 'Vehicle safety logs listed successfully', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncidents,
  createIncident,
  getDriverCompliance,
  getVehicleSafety
};
