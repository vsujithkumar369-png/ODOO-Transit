const { db } = require('../config/db');

const getDashboardKPIs = async () => {
  const queryText = `
    SELECT
      (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired') as total_vehicles,
      (SELECT COUNT(*) FROM vehicles WHERE status = 'Available') as available_vehicles,
      (SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop') as vehicles_in_shop,
      (SELECT COUNT(*) FROM trips WHERE status = 'Dispatched') as active_trips,
      (SELECT COUNT(*) FROM trips WHERE status = 'Draft') as pending_trips,
      (SELECT COUNT(*) FROM drivers WHERE status = 'On Trip') as drivers_on_duty,
      COALESCE(
        ROUND(
          ((SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip') * 100.0) / 
          NULLIF((SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'), 0), 
          2
        ), 
        0.00
      ) as fleet_utilization,
      (SELECT COALESCE(SUM(cost), 0.00) FROM fuel_logs) as total_fuel_cost,
      (SELECT COALESCE(SUM(cost), 0.00) FROM maintenance) as total_maintenance_cost,
      (SELECT COALESCE(SUM(amount), 0.00) FROM expenses WHERE expense_date >= strftime('%Y-%m-01', 'now')) as monthly_expenses
  `;
  const stmt = db.prepare(queryText);
  const row = stmt.get();
  return {
    totalVehicles: parseInt(row.total_vehicles, 10),
    availableVehicles: parseInt(row.available_vehicles, 10),
    vehiclesInShop: parseInt(row.vehicles_in_shop, 10),
    activeTrips: parseInt(row.active_trips, 10),
    pendingTrips: parseInt(row.pending_trips, 10),
    driversOnDuty: parseInt(row.drivers_on_duty, 10),
    fleetUtilization: parseFloat(row.fleet_utilization),
    totalFuelCost: parseFloat(row.total_fuel_cost),
    totalMaintenanceCost: parseFloat(row.total_maintenance_cost),
    monthlyExpenses: parseFloat(row.monthly_expenses)
  };
};

const getFuelEfficiency = async () => {
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
  const stmt = db.prepare(queryText);
  return stmt.all();
};

const getOperationalCost = async () => {
  const queryText = `
    SELECT
      category,
      SUM(amount) as total_cost,
      COUNT(*) as transaction_count
    FROM expenses
    GROUP BY category
    ORDER BY total_cost DESC
  `;
  const stmt = db.prepare(queryText);
  return stmt.all();
};

const getFleetUtilization = async () => {
  const queryText = `
    SELECT
      status,
      COUNT(*) as count,
      ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'), 2) as percentage
    FROM vehicles
    WHERE status != 'Retired'
    GROUP BY status
  `;
  const stmt = db.prepare(queryText);
  return stmt.all();
};

const getVehicleROI = async () => {
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
  const stmt = db.prepare(queryText);
  return stmt.all();
};

const getBudgetReport = async () => {
  const fuelRow = db.prepare("SELECT SUM(cost) as total FROM fuel_logs WHERE log_date >= strftime('%Y-%m-01', 'now')").get();
  const maintRow = db.prepare("SELECT SUM(cost) as total FROM maintenance WHERE start_date >= strftime('%Y-%m-01', 'now')").get();
  const salaryRow = db.prepare("SELECT SUM(amount) as total FROM expenses WHERE category = 'Salary' AND expense_date >= strftime('%Y-%m-01', 'now')").get();
  const insuranceRow = db.prepare("SELECT SUM(amount) as total FROM expenses WHERE category IN ('Insurance', 'Tolls', 'Tolls & Fees') AND expense_date >= strftime('%Y-%m-01', 'now')").get();

  return [
    { department: 'Fuel Budget', actual: parseFloat(fuelRow.total || 0), limit: 50000.00, color: 'var(--warning)' },
    { department: 'Maintenance Budget', actual: parseFloat(maintRow.total || 0), limit: 25000.00, color: 'var(--success)' },
    { department: 'Driver Salaries', actual: parseFloat(salaryRow.total || 0), limit: 90000.00, color: 'var(--accent-primary)' },
    { department: 'Insurance & Tolls', actual: parseFloat(insuranceRow.total || 0), limit: 15000.00, color: 'var(--danger)' }
  ];
};

module.exports = {
  getDashboardKPIs,
  getFuelEfficiency,
  getOperationalCost,
  getFleetUtilization,
  getVehicleROI,
  getBudgetReport
};
