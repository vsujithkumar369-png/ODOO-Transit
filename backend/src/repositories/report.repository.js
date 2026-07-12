const db = require('../config/db');

const getDashboardKPIs = async (client = db) => {
  const queryText = `
    SELECT
      (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired') as total_vehicles,
      (SELECT COUNT(*) FROM trips WHERE status = 'Dispatched') as active_trips,
      (SELECT COUNT(*) FROM maintenance WHERE status = 'Open') as pending_maintenance,
      COALESCE((SELECT SUM(amount) FROM expenses WHERE expense_date >= DATE_TRUNC('month', CURRENT_DATE)), 0) as monthly_expenses
  `;
  const res = await client.query(queryText);
  return {
    totalVehicles: parseInt(res.rows[0].total_vehicles, 10),
    activeTrips: parseInt(res.rows[0].active_trips, 10),
    pendingMaintenance: parseInt(res.rows[0].pending_maintenance, 10),
    monthlyExpenses: parseFloat(res.rows[0].monthly_expenses)
  };
};

const getFuelEfficiency = async (client = db) => {
  const queryText = `
    SELECT
      v.id as vehicle_id,
      v.plate_number,
      v.model,
      SUM(f.fuel_quantity) as total_fuel_quantity,
      SUM(f.cost) as total_fuel_cost,
      COALESCE(MAX(f.odometer_reading) - MIN(f.odometer_reading), 0) as distance_run,
      CASE
        WHEN SUM(f.fuel_quantity) > 0 THEN COALESCE(MAX(f.odometer_reading) - MIN(f.odometer_reading), 0) / SUM(f.fuel_quantity)
        ELSE 0
      END as km_per_liter
    FROM fuel_logs f
    JOIN vehicles v ON f.vehicle_id = v.id
    GROUP BY v.id, v.plate_number, v.model
    ORDER BY km_per_liter DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const getOperationalCost = async (client = db) => {
  const queryText = `
    SELECT
      category,
      SUM(amount) as total_cost,
      COUNT(*) as transaction_count
    FROM expenses
    GROUP BY category
    ORDER BY total_cost DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const getFleetUtilization = async (client = db) => {
  const queryText = `
    SELECT
      status,
      COUNT(*) as count,
      ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'), 2) as percentage
    FROM vehicles
    WHERE status != 'Retired'
    GROUP BY status
  `;
  const res = await client.query(queryText);
  return res.rows;
};

const getVehicleROI = async (client = db) => {
  const queryText = `
    SELECT
      v.id as vehicle_id,
      v.plate_number,
      v.model,
      COALESCE(trip_stats.revenue, 0) as total_revenue,
      COALESCE(fuel_stats.cost, 0) as total_fuel_cost,
      COALESCE(maint_stats.cost, 0) as total_maintenance_cost,
      (COALESCE(trip_stats.revenue, 0) - COALESCE(fuel_stats.cost, 0) - COALESCE(maint_stats.cost, 0)) as net_roi
    FROM vehicles v
    LEFT JOIN (
      SELECT vehicle_id, SUM(cargo_weight * 1.50) as revenue
      FROM trips
      WHERE status = 'Completed'
      GROUP BY vehicle_id
    ) trip_stats ON v.id = trip_stats.vehicle_id
    LEFT JOIN (
      SELECT vehicle_id, SUM(cost) as cost
      FROM fuel_logs
      GROUP BY vehicle_id
    ) fuel_stats ON v.id = fuel_stats.vehicle_id
    LEFT JOIN (
      SELECT vehicle_id, SUM(cost) as cost
      FROM maintenance
      GROUP BY vehicle_id
    ) maint_stats ON v.id = maint_stats.vehicle_id
    WHERE v.status != 'Retired'
    ORDER BY net_roi DESC
  `;
  const res = await client.query(queryText);
  return res.rows;
};

module.exports = {
  getDashboardKPIs,
  getFuelEfficiency,
  getOperationalCost,
  getFleetUtilization,
  getVehicleROI
};
