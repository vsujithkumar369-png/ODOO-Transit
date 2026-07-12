/* 
 * TransitOps - Smart Transport Operations Platform
 * Database Store & Business Logic Engine
 */

const SEED_DATA = {
  users: [
    { email: "manager@transitops.com", password: "admin", role: "fleet_manager", name: "Sarah Connor" },
    { email: "driver@transitops.com", password: "driver", role: "driver", name: "Alex Mercer" },
    { email: "safety@transitops.com", password: "safety", role: "safety_officer", name: "Safety Patrol" },
    { email: "analyst@transitops.com", password: "analyst", role: "financial_analyst", name: "Edward Thorne" }
  ],
  vehicles: [
    { id: "v1", regNum: "VN-005", name: "Van-05", type: "Van", maxCapacity: 500, odometer: 12000, acquisitionCost: 25000, status: "Available", region: "North" },
    { id: "v2", regNum: "TR-001", name: "Truck-01", type: "Heavy Truck", maxCapacity: 5000, odometer: 45000, acquisitionCost: 75000, status: "Available", region: "South" },
    { id: "v3", regNum: "VN-002", name: "Van-02", type: "Van", maxCapacity: 800, odometer: 8500, acquisitionCost: 28000, status: "In Shop", region: "East" },
    { id: "v4", regNum: "SD-004", name: "Sedan-04", type: "Light Vehicle", maxCapacity: 300, odometer: 15000, acquisitionCost: 18000, status: "On Trip", region: "West" },
    { id: "v5", regNum: "TR-002", name: "Truck-02", type: "Flatbed", maxCapacity: 3000, odometer: 32000, acquisitionCost: 60000, status: "Retired", region: "North" }
  ],
  drivers: [
    { id: "d1", name: "Alex", licenseNum: "LIC-ALX01", category: "Class A", expiryDate: "2027-12-31", contact: "9876543210", safetyScore: 95, status: "Available" },
    { id: "d2", name: "John", licenseNum: "LIC-JHN02", category: "Class B", expiryDate: "2026-10-15", contact: "9876543211", safetyScore: 88, status: "On Trip" },
    { id: "d3", name: "Sarah", licenseNum: "LIC-SRH03", category: "Class A", expiryDate: "2026-05-10", contact: "9876543212", safetyScore: 92, status: "Available" },
    { id: "d4", name: "Mike", licenseNum: "LIC-MK004", category: "Class B", expiryDate: "2027-08-20", contact: "9876543213", safetyScore: 55, status: "Suspended" },
    { id: "d5", name: "David", licenseNum: "LIC-DVD05", category: "Class C", expiryDate: "2026-07-20", contact: "9876543214", safetyScore: 78, status: "Available" }
  ],
  trips: [
    { id: "t1", source: "Chicago Depot", destination: "Milwaukee Hub", vehicleId: "v4", driverId: "d2", cargoWeight: 250, distance: 120, status: "Dispatched", dateCreated: "2026-07-11", revenue: 600 },
    { id: "t2", source: "Detroit Factory", destination: "Chicago Depot", vehicleId: "v2", driverId: "d1", cargoWeight: 4500, distance: 280, status: "Completed", dateCreated: "2026-07-08", revenue: 2200 },
    { id: "t3", source: "Houston Port", destination: "Austin Facility", vehicleId: "v2", driverId: "d1", cargoWeight: 4200, distance: 160, status: "Draft", dateCreated: "2026-07-12", revenue: 1100 }
  ],
  maintenanceLogs: [
    { id: "m1", vehicleId: "v3", description: "Brake pad replacement & oil change", cost: 350, startDate: "2026-07-10", endDate: null, status: "Active" },
    { id: "m2", vehicleId: "v2", description: "Tire rotation and alignment", cost: 200, startDate: "2026-06-05", endDate: "2026-06-06", status: "Closed" }
  ],
  fuelLogs: [
    { id: "f1", vehicleId: "v2", liters: 120, cost: 180, odometerReading: 44800, date: "2026-06-10" },
    { id: "f2", vehicleId: "v4", liters: 30, cost: 45, odometerReading: 14950, date: "2026-07-02" }
  ],
  expenses: [
    { id: "e1", vehicleId: "v2", type: "Toll", cost: 50, date: "2026-06-10", description: "I-94 Tollway" },
    { id: "e2", vehicleId: "v4", type: "Toll", cost: 20, date: "2026-07-02", description: "City bypass tolls" }
  ]
};

class Store {
  constructor() {
    this.dataKey = "transitops_store";
    this.state = null;
    this.dashboardStats = null;
    this.availableVehicles = [];
    this.availableDrivers = [];
    
    // Analytics caches
    this.roiCache = {};
    this.fuelEfficiencyCache = {};
    this.operationalCostCache = {};

    this.init();
  }

  init() {
    if (!localStorage.getItem(this.dataKey)) {
      localStorage.setItem(this.dataKey, JSON.stringify(SEED_DATA));
    }
    this.state = JSON.parse(localStorage.getItem(this.dataKey));
  }

  save() {
    localStorage.setItem(this.dataKey, JSON.stringify(this.state));
  }

  // --- API SERVICE HELPER ---
  async apiFetch(url, options = {}) {
    const headers = window.auth.getAuthHeaders();
    const finalOptions = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    };
    
    const response = await fetch(url, finalOptions);
    if (!response.ok) {
      let errMsg = `Request failed: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData && errData.message) errMsg = errData.message;
      } catch (_) {}
      throw new Error(errMsg);
    }
    return response.json();
  }

  // --- FETCH DATA FOR VIEW DYNAMICALLY ---
  async fetchViewData(viewId) {
    try {
      switch(viewId) {
        case "dashboard":
          this.dashboardStats = await this.apiFetch("/api/dashboard/kpis");
          const dashboardTrips = await this.apiFetch("/api/trips");
          this.state.trips = dashboardTrips.map(t => this.mapTripFromAPI(t));
          const dashVehicles = await this.apiFetch("/api/vehicles");
          this.state.vehicles = dashVehicles.map(v => this.mapVehicleFromAPI(v));
          const dashDrivers = await this.apiFetch("/api/drivers");
          this.state.drivers = dashDrivers.map(d => this.mapDriverFromAPI(d));
          break;

        case "vehicles":
          const vehiclesList = await this.apiFetch("/api/vehicles");
          this.state.vehicles = vehiclesList.map(v => this.mapVehicleFromAPI(v));
          break;

        case "drivers":
          const driversList = await this.apiFetch("/api/drivers");
          this.state.drivers = driversList.map(d => this.mapDriverFromAPI(d));
          break;

        case "trips":
          const tripsList = await this.apiFetch("/api/trips");
          this.state.trips = tripsList.map(t => this.mapTripFromAPI(t));
          
          const vList = await this.apiFetch("/api/vehicles");
          this.state.vehicles = vList.map(v => this.mapVehicleFromAPI(v));
          
          const dList = await this.apiFetch("/api/drivers");
          this.state.drivers = dList.map(d => this.mapDriverFromAPI(d));

          const avVehicles = await this.apiFetch("/api/vehicles/available");
          this.availableVehicles = avVehicles.map(v => this.mapVehicleFromAPI(v));
          
          const avDrivers = await this.apiFetch("/api/drivers/available");
          this.availableDrivers = avDrivers.map(d => this.mapDriverFromAPI(d));
          break;

        case "maintenance":
          const maintList = await this.apiFetch("/api/maintenance");
          this.state.maintenanceLogs = maintList.map(m => this.mapMaintenanceFromAPI(m));
          const maintVehicles = await this.apiFetch("/api/vehicles");
          this.state.vehicles = maintVehicles.map(v => this.mapVehicleFromAPI(v));
          break;

        case "expenses":
          // Fetch overall or per vehicle if backend expects query. Support fallback to local storage
          const fuelLogs = await this.apiFetch("/api/fuel-logs").catch(() => null);
          if (fuelLogs) this.state.fuelLogs = fuelLogs.map(f => this.mapFuelLogFromAPI(f));
          
          const expenses = await this.apiFetch("/api/expenses").catch(() => null);
          if (expenses) this.state.expenses = expenses.map(e => this.mapExpenseFromAPI(e));

          const expenseVehicles = await this.apiFetch("/api/vehicles");
          this.state.vehicles = expenseVehicles.map(v => this.mapVehicleFromAPI(v));
          break;

        case "analytics":
          const analyticVehicles = await this.apiFetch("/api/vehicles");
          this.state.vehicles = analyticVehicles.map(v => this.mapVehicleFromAPI(v));

          const analyticTrips = await this.apiFetch("/api/trips");
          this.state.trips = analyticTrips.map(t => this.mapTripFromAPI(t));

          const analyticFuel = await this.apiFetch("/api/fuel-logs").catch(() => null);
          if (analyticFuel) this.state.fuelLogs = analyticFuel.map(f => this.mapFuelLogFromAPI(f));

          const analyticExpense = await this.apiFetch("/api/expenses").catch(() => null);
          if (analyticExpense) this.state.expenses = analyticExpense.map(e => this.mapExpenseFromAPI(e));

          // Fetch reports per active vehicle
          for (let v of this.state.vehicles) {
            if (v.status !== "Retired") {
              const roiRes = await this.apiFetch(`/api/reports/vehicle-roi?vehicleId=${v.id}`).catch(() => null);
              if (roiRes) this.roiCache[v.id] = roiRes.roi || roiRes;

              const efficiencyRes = await this.apiFetch(`/api/reports/fuel-efficiency?vehicleId=${v.id}`).catch(() => null);
              if (efficiencyRes) this.fuelEfficiencyCache[v.id] = efficiencyRes.efficiency || efficiencyRes;

              const opCostRes = await this.apiFetch(`/api/reports/operational-cost?vehicleId=${v.id}`).catch(() => null);
              if (opCostRes) this.operationalCostCache[v.id] = opCostRes.operationalCost || opCostRes.cost || opCostRes;
            }
          }
          break;

        case "alerts":
          const alertDrivers = await this.apiFetch("/api/drivers");
          this.state.drivers = alertDrivers.map(d => this.mapDriverFromAPI(d));
          const alertVehicles = await this.apiFetch("/api/vehicles");
          this.state.vehicles = alertVehicles.map(v => this.mapVehicleFromAPI(v));
          break;
      }
    } catch (err) {
      console.warn("Offline or failed fetching, utilizing localStorage cache fallback.", err);
      // Fallback is already initialized in constructor, no extra work required
    }
  }

  // --- SCHEMA MAPPINGS ---
  mapVehicleFromAPI(api) {
    return {
      id: api.id || api._id || api.regNumber,
      regNum: api.regNumber || api.regNum,
      name: api.name,
      type: api.type,
      maxCapacity: api.maxLoadCapacity || api.maxCapacity,
      odometer: api.odometer,
      acquisitionCost: api.acquisitionCost,
      status: api.status,
      region: api.region
    };
  }

  mapVehicleToAPI(storeVehicle) {
    return {
      regNumber: storeVehicle.regNum,
      name: storeVehicle.name,
      type: storeVehicle.type,
      maxLoadCapacity: storeVehicle.maxCapacity,
      odometer: storeVehicle.odometer,
      acquisitionCost: storeVehicle.acquisitionCost,
      status: storeVehicle.status,
      region: storeVehicle.region
    };
  }

  mapDriverFromAPI(api) {
    return {
      id: api.id || api._id || api.licenseNumber,
      name: api.name,
      licenseNum: api.licenseNumber || api.licenseNum,
      category: api.licenseCategory || api.category,
      expiryDate: api.licenseExpiry || api.expiryDate,
      contact: api.contact,
      safetyScore: api.safetyScore,
      status: api.status
    };
  }

  mapDriverToAPI(storeDriver) {
    return {
      name: storeDriver.name,
      licenseNumber: storeDriver.licenseNum,
      licenseCategory: storeDriver.category,
      licenseExpiry: storeDriver.expiryDate,
      contact: storeDriver.contact,
      safetyScore: storeDriver.safetyScore,
      status: storeDriver.status
    };
  }

  mapTripFromAPI(api) {
    return {
      id: api.id || api._id,
      source: api.source,
      destination: api.destination,
      vehicleId: api.vehicleId,
      driverId: api.driverId,
      cargoWeight: api.cargoWeight,
      distance: api.plannedDistance || api.distance,
      revenue: api.revenue || 0,
      status: api.status,
      dateCreated: api.dateCreated || api.createdAt || "2026-07-12"
    };
  }

  mapTripToAPI(storeTrip) {
    return {
      source: storeTrip.source,
      destination: storeTrip.destination,
      vehicleId: storeTrip.vehicleId,
      driverId: storeTrip.driverId,
      cargoWeight: storeTrip.cargoWeight,
      plannedDistance: storeTrip.distance,
      revenue: storeTrip.revenue
    };
  }

  mapMaintenanceFromAPI(api) {
    return {
      id: api.id || api._id,
      vehicleId: api.vehicleId,
      description: api.description,
      cost: api.cost,
      startDate: api.date || api.startDate || "2026-07-12",
      endDate: api.endDate || null,
      status: api.status || (api.endDate ? "Closed" : "Active")
    };
  }

  mapFuelLogFromAPI(api) {
    return {
      id: api.id || api._id,
      vehicleId: api.vehicleId,
      liters: api.liters,
      cost: api.cost,
      odometerReading: api.odometerReading || 0,
      date: api.date
    };
  }

  mapExpenseFromAPI(api) {
    return {
      id: api.id || api._id,
      vehicleId: api.vehicleId,
      type: api.type,
      cost: api.amount || api.cost,
      date: api.date,
      description: api.description || ""
    };
  }

  // --- QUERY UTILITIES ---
  getVehicles() { return this.state.vehicles; }
  getVehicleById(id) { return this.state.vehicles.find(v => v.id === id); }
  getDrivers() { return this.state.drivers; }
  getDriverById(id) { return this.state.drivers.find(d => d.id === id); }
  getTrips() { return this.state.trips; }
  getTripById(id) { return this.state.trips.find(t => t.id === id); }
  getMaintenanceLogs() { return this.state.maintenanceLogs; }
  getFuelLogs() { return this.state.fuelLogs; }
  getExpenses() { return this.state.expenses; }
  getUsers() { return this.state.users; }

  isLicenseExpired(driver) {
    const today = new Date("2026-07-12");
    const expiry = new Date(driver.expiryDate);
    return expiry < today;
  }

  isLicenseExpiringSoon(driver) {
    const today = new Date("2026-07-12");
    const expiry = new Date(driver.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }

  // --- VEHICLE CRUD ---
  async addVehicle(vehicle) {
    try {
      const added = await this.apiFetch("/api/vehicles", {
        method: "POST",
        body: JSON.stringify(this.mapVehicleToAPI(vehicle))
      });
      const mapped = this.mapVehicleFromAPI(added);
      this.state.vehicles.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addVehicle", err);
      // Verify local uniqueness
      const exists = this.state.vehicles.some(v => v.regNum.toUpperCase() === vehicle.regNum.toUpperCase());
      if (exists) throw new Error(`Registration Number '${vehicle.regNum}' must be unique.`);
      const newVehicle = {
        id: "v_" + Date.now(),
        status: "Available",
        ...vehicle,
        odometer: Number(vehicle.odometer) || 0,
        acquisitionCost: Number(vehicle.acquisitionCost) || 0,
        maxCapacity: Number(vehicle.maxCapacity) || 0
      };
      this.state.vehicles.push(newVehicle);
      this.save();
      return newVehicle;
    }
  }

  async updateVehicle(id, updatedFields) {
    try {
      const updated = await this.apiFetch(`/api/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(this.mapVehicleToAPI({ ...this.getVehicleById(id), ...updatedFields }))
      });
      const mapped = this.mapVehicleFromAPI(updated);
      const idx = this.state.vehicles.findIndex(v => v.id === id);
      if (idx !== -1) this.state.vehicles[idx] = mapped;
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for updateVehicle", err);
      const index = this.state.vehicles.findIndex(v => v.id === id);
      if (index === -1) throw new Error("Vehicle not found.");

      if (updatedFields.regNum && updatedFields.regNum.toUpperCase() !== this.state.vehicles[index].regNum.toUpperCase()) {
        const exists = this.state.vehicles.some(v => v.regNum.toUpperCase() === updatedFields.regNum.toUpperCase());
        if (exists) throw new Error(`Registration Number '${updatedFields.regNum}' must be unique.`);
      }

      this.state.vehicles[index] = {
        ...this.state.vehicles[index],
        ...updatedFields,
        odometer: updatedFields.odometer !== undefined ? Number(updatedFields.odometer) : this.state.vehicles[index].odometer,
        acquisitionCost: updatedFields.acquisitionCost !== undefined ? Number(updatedFields.acquisitionCost) : this.state.vehicles[index].acquisitionCost,
        maxCapacity: updatedFields.maxCapacity !== undefined ? Number(updatedFields.maxCapacity) : this.state.vehicles[index].maxCapacity
      };
      this.save();
      return this.state.vehicles[index];
    }
  }

  async deleteVehicle(id) {
    try {
      await this.apiFetch(`/api/vehicles/${id}`, { method: "DELETE" });
      this.state.vehicles = this.state.vehicles.filter(v => v.id !== id);
      this.save();
    } catch (err) {
      console.warn("Offline fallback for deleteVehicle", err);
      const vehicle = this.getVehicleById(id);
      if (!vehicle) throw new Error("Vehicle not found.");
      if (vehicle.status === "On Trip") throw new Error("Cannot delete a vehicle currently active on a trip.");
      
      this.state.vehicles = this.state.vehicles.filter(v => v.id !== id);
      this.save();
    }
  }

  // --- DRIVER CRUD ---
  async addDriver(driver) {
    try {
      const added = await this.apiFetch("/api/drivers", {
        method: "POST",
        body: JSON.stringify(this.mapDriverToAPI(driver))
      });
      const mapped = this.mapDriverFromAPI(added);
      this.state.drivers.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addDriver", err);
      const newDriver = {
        id: "d_" + Date.now(),
        status: "Available",
        ...driver,
        safetyScore: Number(driver.safetyScore) || 100
      };
      this.state.drivers.push(newDriver);
      this.save();
      return newDriver;
    }
  }

  async updateDriver(id, updatedFields) {
    try {
      const updated = await this.apiFetch(`/api/drivers/${id}`, {
        method: "PUT",
        body: JSON.stringify(this.mapDriverToAPI({ ...this.getDriverById(id), ...updatedFields }))
      });
      const mapped = this.mapDriverFromAPI(updated);
      const idx = this.state.drivers.findIndex(d => d.id === id);
      if (idx !== -1) this.state.drivers[idx] = mapped;
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for updateDriver", err);
      const index = this.state.drivers.findIndex(d => d.id === id);
      if (index === -1) throw new Error("Driver not found.");

      this.state.drivers[index] = {
        ...this.state.drivers[index],
        ...updatedFields,
        safetyScore: updatedFields.safetyScore !== undefined ? Number(updatedFields.safetyScore) : this.state.drivers[index].safetyScore
      };
      this.save();
      return this.state.drivers[index];
    }
  }

  async deleteDriver(id) {
    try {
      await this.apiFetch(`/api/drivers/${id}`, { method: "DELETE" });
      this.state.drivers = this.state.drivers.filter(d => d.id !== id);
      this.save();
    } catch (err) {
      console.warn("Offline fallback for deleteDriver", err);
      const driver = this.getDriverById(id);
      if (!driver) throw new Error("Driver not found.");
      if (driver.status === "On Trip") throw new Error("Cannot delete a driver currently active on a trip.");
      
      this.state.drivers = this.state.drivers.filter(d => d.id !== id);
      this.save();
    }
  }

  // --- TRIP LIFE CYCLE & VALIDATIONS ---
  async addTrip(trip) {
    try {
      const added = await this.apiFetch("/api/trips", {
        method: "POST",
        body: JSON.stringify(this.mapTripToAPI(trip))
      });
      const mapped = this.mapTripFromAPI(added);
      this.state.trips.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addTrip", err);
      const newTrip = {
        id: "t_" + Date.now(),
        status: "Draft",
        dateCreated: "2026-07-12",
        revenue: Number(trip.revenue) || 0,
        cargoWeight: Number(trip.cargoWeight) || 0,
        distance: Number(trip.distance) || 0,
        ...trip
      };
      this.state.trips.push(newTrip);
      this.save();
      return newTrip;
    }
  }

  async dispatchTrip(tripId) {
    try {
      const dispatched = await this.apiFetch(`/api/trips/${tripId}/dispatch`, { method: "POST" });
      const mapped = this.mapTripFromAPI(dispatched);
      const idx = this.state.trips.findIndex(t => t.id === tripId);
      if (idx !== -1) this.state.trips[idx] = mapped;
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for dispatchTrip", err);
      const trip = this.getTripById(tripId);
      if (!trip) throw new Error("Trip not found.");
      if (trip.status !== "Draft") throw new Error("Only Draft trips can be dispatched.");

      const vehicle = this.getVehicleById(trip.vehicleId);
      const driver = this.getDriverById(trip.driverId);

      if (!vehicle) throw new Error("Assigned vehicle not found.");
      if (!driver) throw new Error("Assigned driver not found.");

      if (vehicle.status === "Retired" || vehicle.status === "In Shop") {
        throw new Error(`Vehicle '${vehicle.name}' is currently ${vehicle.status} and cannot be dispatched.`);
      }
      if (vehicle.status === "On Trip") {
        throw new Error(`Vehicle '${vehicle.name}' is already active on another trip.`);
      }
      if (driver.status === "On Trip") {
        throw new Error(`Driver '${driver.name}' is already active on another trip.`);
      }
      if (driver.status === "Suspended") {
        throw new Error(`Driver '${driver.name}' is currently Suspended and cannot be assigned to trips.`);
      }
      if (driver.status === "Off Duty") {
        throw new Error(`Driver '${driver.name}' is Off Duty.`);
      }
      if (this.isLicenseExpired(driver)) {
        throw new Error(`Driver '${driver.name}' has an expired license (Expired: ${driver.expiryDate}) and cannot drive.`);
      }
      if (Number(trip.cargoWeight) > Number(vehicle.maxCapacity)) {
        throw new Error(`Cargo weight (${trip.cargoWeight} kg) exceeds maximum load capacity of vehicle '${vehicle.name}' (${vehicle.maxCapacity} kg).`);
      }

      trip.status = "Dispatched";
      vehicle.status = "On Trip";
      driver.status = "On Trip";

      this.save();
      return trip;
    }
  }

  async completeTrip(tripId, finalOdometer, fuelLiters, fuelCost) {
    try {
      const completed = await this.apiFetch(`/api/trips/${tripId}/complete`, {
        method: "POST",
        body: JSON.stringify({
          finalOdometer: Number(finalOdometer),
          fuelConsumed: Number(fuelLiters)
        })
      });
      const mapped = this.mapTripFromAPI(completed);
      const idx = this.state.trips.findIndex(t => t.id === tripId);
      if (idx !== -1) this.state.trips[idx] = mapped;

      // Log fuel consumption separately if provided
      if (fuelLiters && fuelCost) {
        await this.addFuelLog({
          vehicleId: mapped.vehicleId,
          liters: Number(fuelLiters),
          cost: Number(fuelCost),
          odometerReading: Number(finalOdometer),
          date: "2026-07-12"
        }).catch(() => null);
      }
      
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for completeTrip", err);
      const trip = this.getTripById(tripId);
      if (!trip) throw new Error("Trip not found.");
      if (trip.status !== "Dispatched") throw new Error("Only Dispatched trips can be completed.");

      const vehicle = this.getVehicleById(trip.vehicleId);
      const driver = this.getDriverById(trip.driverId);

      if (finalOdometer) {
        const odo = Number(finalOdometer);
        if (odo < vehicle.odometer) {
          throw new Error(`Final odometer (${odo} km) cannot be less than current odometer (${vehicle.odometer} km).`);
        }
        vehicle.odometer = odo;
      } else {
        vehicle.odometer += Number(trip.distance);
      }

      if (fuelLiters && fuelCost) {
        this.addFuelLog({
          vehicleId: vehicle.id,
          liters: Number(fuelLiters),
          cost: Number(fuelCost),
          odometerReading: vehicle.odometer,
          date: "2026-07-12"
        });
      }

      trip.status = "Completed";
      if (vehicle.status === "On Trip") vehicle.status = "Available";
      if (driver.status === "On Trip") driver.status = "Available";

      this.save();
      return trip;
    }
  }

  async cancelTrip(tripId) {
    try {
      const cancelled = await this.apiFetch(`/api/trips/${tripId}/cancel`, { method: "POST" });
      const mapped = this.mapTripFromAPI(cancelled);
      const idx = this.state.trips.findIndex(t => t.id === tripId);
      if (idx !== -1) this.state.trips[idx] = mapped;
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for cancelTrip", err);
      const trip = this.getTripById(tripId);
      if (!trip) throw new Error("Trip not found.");
      
      const originalStatus = trip.status;
      trip.status = "Cancelled";

      if (originalStatus === "Dispatched") {
        const vehicle = this.getVehicleById(trip.vehicleId);
        const driver = this.getDriverById(trip.driverId);
        if (vehicle && vehicle.status === "On Trip") vehicle.status = "Available";
        if (driver && driver.status === "On Trip") driver.status = "Available";
      }

      this.save();
      return trip;
    }
  }

  // --- MAINTENANCE MANAGEMENT ---
  async addMaintenanceLog(log) {
    try {
      const added = await this.apiFetch("/api/maintenance", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: log.vehicleId,
          type: log.type || "Maintenance",
          description: log.description,
          cost: Number(log.cost),
          date: log.date || "2026-07-12"
        })
      });
      const mapped = this.mapMaintenanceFromAPI(added);
      this.state.maintenanceLogs.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addMaintenanceLog", err);
      const vehicle = this.getVehicleById(log.vehicleId);
      if (!vehicle) throw new Error("Vehicle not found.");
      if (vehicle.status === "On Trip") throw new Error("Cannot send a vehicle to maintenance while active on a trip.");
      if (vehicle.status === "Retired") throw new Error("Cannot perform maintenance on a retired vehicle.");

      const newLog = {
        id: "m_" + Date.now(),
        status: "Active",
        startDate: "2026-07-12",
        endDate: null,
        cost: Number(log.cost) || 0,
        ...log
      };

      vehicle.status = "In Shop";
      this.state.maintenanceLogs.push(newLog);
      this.save();
      return newLog;
    }
  }

  async closeMaintenanceLog(id, finalCost, resolveStatus = "Available") {
    try {
      const closed = await this.apiFetch(`/api/maintenance/${id}/close`, {
        method: "PUT",
        body: JSON.stringify({ finalCost })
      });
      const mapped = this.mapMaintenanceFromAPI(closed);
      const idx = this.state.maintenanceLogs.findIndex(m => m.id === id);
      if (idx !== -1) this.state.maintenanceLogs[idx] = mapped;
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for closeMaintenanceLog", err);
      const log = this.state.maintenanceLogs.find(m => m.id === id);
      if (!log) throw new Error("Maintenance record not found.");
      if (log.status !== "Active") throw new Error("This maintenance log is already closed.");

      log.status = "Closed";
      log.endDate = "2026-07-12";
      if (finalCost !== undefined) {
        log.cost = Number(finalCost);
      }

      const vehicle = this.getVehicleById(log.vehicleId);
      if (vehicle) {
        if (vehicle.status === "In Shop") {
          vehicle.status = resolveStatus;
        }
      }

      this.save();
      return log;
    }
  }

  // --- FUEL & EXPENSE CRUD ---
  async addFuelLog(log) {
    try {
      const added = await this.apiFetch("/api/fuel-logs", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: log.vehicleId,
          liters: Number(log.liters),
          cost: Number(log.cost),
          date: log.date || "2026-07-12"
        })
      });
      const mapped = this.mapFuelLogFromAPI(added);
      this.state.fuelLogs.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addFuelLog", err);
      const newLog = {
        id: "f_" + Date.now(),
        date: "2026-07-12",
        ...log,
        liters: Number(log.liters) || 0,
        cost: Number(log.cost) || 0,
        odometerReading: Number(log.odometerReading) || 0
      };
      this.state.fuelLogs.push(newLog);
      this.save();
      return newLog;
    }
  }

  async addExpense(expense) {
    try {
      const added = await this.apiFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: expense.vehicleId,
          type: expense.type,
          amount: Number(expense.cost),
          date: expense.date || "2026-07-12"
        })
      });
      const mapped = this.mapExpenseFromAPI(added);
      this.state.expenses.push(mapped);
      this.save();
      return mapped;
    } catch (err) {
      console.warn("Offline fallback for addExpense", err);
      const newExpense = {
        id: "e_" + Date.now(),
        date: "2026-07-12",
        ...expense,
        cost: Number(expense.cost) || 0
      };
      this.state.expenses.push(newExpense);
      this.save();
      return newExpense;
    }
  }

  // --- ANALYTICAL COMPUTATIONS ---
  getVehicleOperationalCost(vehicleId) {
    if (this.operationalCostCache && this.operationalCostCache[vehicleId] !== undefined) {
      return this.operationalCostCache[vehicleId];
    }
    const fuelCost = this.state.fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, f) => sum + f.cost, 0);

    const maintenanceCost = this.state.maintenanceLogs
      .filter(m => m.vehicleId === vehicleId)
      .reduce((sum, m) => sum + m.cost, 0);

    const otherCost = this.state.expenses
      .filter(e => e.vehicleId === vehicleId)
      .reduce((sum, e) => sum + e.cost, 0);

    return fuelCost + maintenanceCost + otherCost;
  }

  getVehicleRevenue(vehicleId) {
    return this.state.trips
      .filter(t => t.vehicleId === vehicleId && t.status === "Completed")
      .reduce((sum, t) => sum + (t.revenue || 0), 0);
  }

  getVehicleROI(vehicleId) {
    if (this.roiCache && this.roiCache[vehicleId] !== undefined) {
      return this.roiCache[vehicleId];
    }
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle || vehicle.acquisitionCost === 0) return 0;
    
    const revenue = this.getVehicleRevenue(vehicleId);
    const operationalCost = this.getVehicleOperationalCost(vehicleId);
    
    const roi = (revenue - operationalCost) / vehicle.acquisitionCost;
    return Number((roi * 100).toFixed(2));
  }

  getVehicleFuelEfficiency(vehicleId) {
    if (this.fuelEfficiencyCache && this.fuelEfficiencyCache[vehicleId] !== undefined) {
      return this.fuelEfficiencyCache[vehicleId];
    }
    const completedTrips = this.state.trips.filter(t => t.vehicleId === vehicleId && t.status === "Completed");
    const totalDistance = completedTrips.reduce((sum, t) => sum + t.distance, 0);

    const totalFuel = this.state.fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, f) => sum + f.liters, 0);

    if (totalFuel === 0) return 0;
    return Number((totalDistance / totalFuel).toFixed(2));
  }

  getDashboardStats() {
    if (this.dashboardStats) {
      return {
        totalVehicles: this.state.vehicles.length,
        activeVehicles: this.dashboardStats.activeVehicles,
        availableVehicles: this.dashboardStats.availableVehicles,
        inMaintenance: this.dashboardStats.inMaintenance,
        activeTrips: this.dashboardStats.activeTrips,
        pendingTrips: this.dashboardStats.pendingTrips,
        driversOnDuty: this.dashboardStats.driversOnDuty,
        utilization: this.dashboardStats.fleetUtilizationPct
      };
    }

    const totalVehicles = this.state.vehicles.length;
    const activeVehicles = this.state.vehicles.filter(v => v.status === "On Trip").length;
    const availableVehicles = this.state.vehicles.filter(v => v.status === "Available").length;
    const inMaintenance = this.state.vehicles.filter(v => v.status === "In Shop").length;
    
    const activeTrips = this.state.trips.filter(t => t.status === "Dispatched").length;
    const pendingTrips = this.state.trips.filter(t => t.status === "Draft").length;
    const driversOnDuty = this.state.drivers.filter(d => d.status === "On Trip" || d.status === "Available").length;
    
    const nonRetiredVehicles = this.state.vehicles.filter(v => v.status !== "Retired").length;
    const utilization = nonRetiredVehicles > 0 
      ? Math.round((activeVehicles / nonRetiredVehicles) * 100) 
      : 0;

    return {
      totalVehicles,
      activeVehicles,
      availableVehicles,
      inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      utilization
    };
  }

  getSystemAlerts() {
    const alerts = [];
    
    this.state.drivers.forEach(d => {
      if (this.isLicenseExpired(d)) {
        alerts.push({
          type: "danger",
          title: `Expired License: ${d.name}`,
          desc: `License ${d.licenseNum} expired on ${d.expiryDate}. Driver is grounded.`,
          actionLabel: "Suspend Driver",
          action: () => this.updateDriver(d.id, { status: "Suspended" })
        });
      } else if (this.isLicenseExpiringSoon(d)) {
        alerts.push({
          type: "warning",
          title: `License Expiring Soon: ${d.name}`,
          desc: `License ${d.licenseNum} expires on ${d.expiryDate} (under 30 days).`,
          actionLabel: "Send Email Notification",
          action: () => alert(`Simulated Email Alert: Reminded ${d.name} (${d.contact}) to renew license ${d.licenseNum}.`)
        });
      }
    });

    this.state.vehicles.forEach(v => {
      const operationalCost = this.getVehicleOperationalCost(v.id);
      if (v.status !== "Retired" && operationalCost > (v.acquisitionCost * 0.15)) {
        alerts.push({
          type: "info",
          title: `High Expense Fleet Asset: ${v.name}`,
          desc: `Operational costs ($${operationalCost}) exceed 15% of asset acquisition value ($${v.acquisitionCost}).`,
          actionLabel: "Schedule Audit",
          action: () => alert(`Audit Scheduled: Assigned fleet maintenance inspector to review asset ${v.name}.`)
        });
      }
    });

    return alerts;
  }
}

// Global instance
window.store = new Store();

