/* 
 * TransitOps - Smart Transport Operations Platform
 * Main App Router, Modals & Event Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});

class AppController {
  constructor() {
    this.currentView = "dashboard";
    this.activeVehicleEditId = null;
    this.activeDriverEditId = null;
    this.activeCloseMaintenanceId = null;
    this.activeCompleteTripId = null;

    this.initDOM();
    this.initEvents();
    this.checkAuthentication();
  }

  initDOM() {
    this.authScreen = document.getElementById("auth-screen");
    this.appScreen = document.getElementById("app-screen");
    this.loginForm = document.getElementById("login-form");
    this.logoutBtn = document.getElementById("logout-btn");
    this.viewTitle = document.getElementById("view-title");
    this.contentArea = document.getElementById("content-area");
    this.sidebarMenu = document.getElementById("sidebar-menu");
    
    // Top Bar Selectors
    this.roleSelector = document.getElementById("navbar-role-selector");
    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.currentUserName = document.getElementById("user-name-display");
    this.currentUserRole = document.getElementById("user-role-display");
    this.avatarDisplay = document.getElementById("avatar-display");

    // Modals
    this.modalOverlay = document.getElementById("modal-overlay");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalSaveBtn = document.getElementById("modal-save-btn");
  }

  initEvents() {
    // Authentication
    this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    this.logoutBtn.addEventListener("click", () => this.handleLogout());

    // Role Switcher
    this.roleSelector.addEventListener("change", (e) => this.handleRoleSwitch(e.target.value));

    // Dark/Light Theme Toggle
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());

    // Global Modal close click
    document.getElementById("modal-close-btn").addEventListener("click", () => this.hideModal());
    this.modalOverlay.addEventListener("click", (e) => {
      if (e.target === this.modalOverlay) this.hideModal();
    });

    // Make functions globally available for inline HTML onclick attributes
    window.showAddVehicleModal = () => this.showVehicleModal(null);
    window.showEditVehicleModal = (id) => this.showVehicleModal(id);
    window.handleDeleteVehicle = (id) => this.deleteVehicle(id);
    window.filterVehiclesList = () => this.filterVehicles();

    window.showAddDriverModal = () => this.showDriverModal(null);
    window.showEditDriverModal = (id) => this.showDriverModal(id);
    window.handleDeleteDriver = (id) => this.deleteDriver(id);
    window.filterDriversList = () => this.filterDrivers();

    window.showAddTripModal = () => this.showTripModal();
    window.handleDispatchTrip = (id) => this.dispatchTrip(id);
    window.handleCancelTrip = (id) => this.cancelTrip(id);
    window.showCompleteTripModal = (id) => this.showCompleteTripModal(id);

    window.showAddMaintenanceModal = () => this.showMaintenanceModal();
    window.showCloseMaintenanceModal = (id) => this.showCloseMaintenanceModal(id);

    window.showAddFuelModal = () => this.showFuelModal();
    window.showAddExpenseModal = () => this.showExpenseModal();

    window.triggerAlertAction = (idx) => this.triggerAlertAction(idx);
    window.sendAllLicenseReminders = () => this.sendLicenseReminders();
    window.exportCSV = () => this.exportToCSV();
    window.printPDF = () => window.print();
  }

  // --- THEME ---
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    this.themeToggleBtn.innerHTML = newTheme === "dark" 
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  }

  // --- AUTHENTICATION ---
  checkAuthentication() {
    if (window.auth.isAuthenticated()) {
      this.showAppScreen();
    } else {
      this.showAuthScreen();
    }
  }

  showAuthScreen() {
    this.authScreen.style.display = "flex";
    this.appScreen.style.display = "none";
  }

  showAppScreen() {
    this.authScreen.style.display = "none";
    this.appScreen.style.display = "block";
    
    const user = window.auth.getCurrentUser();
    this.currentUserName.textContent = user.name;
    this.currentUserRole.textContent = user.role.replace("_", " ");
    this.avatarDisplay.textContent = user.name.substring(0, 2).toUpperCase();
    this.roleSelector.value = user.role;

    this.renderNavigation();
    this.navigateTo(this.currentView);
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    try {
      window.auth.login(email, pass);
      this.showToast("Welcome back!", "success");
      this.showAppScreen();
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  handleLogout() {
    window.auth.logout();
    this.showToast("Logged out successfully.", "info");
    this.showAuthScreen();
  }

  handleRoleSwitch(role) {
    window.auth.switchRole(role);
    this.showToast(`Switched view to ${role.replace("_", " ")}`, "info");
    this.showAppScreen();
  }

  // Set credentials quickly from demo chips
  setDemoCredentials(email, password) {
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = password;
  }

  // --- ROUTING & NAVIGATION ---
  renderNavigation() {
    const user = window.auth.getCurrentUser();
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "vehicles", label: "Vehicles", icon: "truck" },
      { id: "drivers", label: "Drivers", icon: "users" },
      { id: "trips", label: "Trips", icon: "route" },
      { id: "maintenance", label: "Maintenance", icon: "tool" },
      { id: "expenses", label: "Expenses & Fuel", icon: "dollar" },
      { id: "analytics", label: "Analytics", icon: "analytics" },
      { id: "alerts", label: "Compliance Alerts", icon: "alert" }
    ];

    let html = "";
    menuItems.forEach(item => {
      if (window.auth.hasViewPermission(item.id)) {
        const isActive = this.currentView === item.id ? "active" : "";
        html += `
          <li class="menu-item ${isActive}" onclick="window.app.navigateTo('${item.id}')">
            ${Icons[item.icon]}
            <span>${item.label}</span>
          </li>
        `;
      }
    });

    this.sidebarMenu.innerHTML = html;
  }

  navigateTo(viewId) {
    if (!window.auth.hasViewPermission(viewId)) {
      viewId = "dashboard"; // Fallback
    }

    this.currentView = viewId;
    
    // Update active nav class
    const items = this.sidebarMenu.querySelectorAll(".menu-item");
    items.forEach(el => el.classList.remove("active"));
    const activeEl = Array.from(items).find(el => el.textContent.trim().toLowerCase() === viewId.replace("-", " ").toLowerCase());
    if (activeEl) activeEl.classList.add("active");

    // Format view title
    this.viewTitle.textContent = viewId.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
    
    // Renders the specific component dynamically
    this.contentArea.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "view-section active";
    this.contentArea.appendChild(wrapper);

    switch(viewId) {
      case "dashboard":
        window.components.renderDashboard(wrapper);
        break;
      case "vehicles":
        window.components.renderVehicles(wrapper);
        break;
      case "drivers":
        window.components.renderDrivers(wrapper);
        break;
      case "trips":
        window.components.renderTrips(wrapper);
        break;
      case "maintenance":
        window.components.renderMaintenance(wrapper);
        break;
      case "expenses":
        window.components.renderExpenses(wrapper);
        break;
      case "analytics":
        window.components.renderAnalytics(wrapper);
        break;
      case "alerts":
        window.components.renderAlerts(wrapper);
        break;
    }
  }

  // --- MODAL UTILITIES ---
  showModal(title, bodyHTML, onSaveClick) {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = bodyHTML;
    this.modalOverlay.style.display = "flex";

    // Set up save button handler
    const newSaveBtn = this.modalSaveBtn.cloneNode(true);
    this.modalSaveBtn.replaceWith(newSaveBtn);
    this.modalSaveBtn = newSaveBtn;

    this.modalSaveBtn.addEventListener("click", () => {
      if (onSaveClick) onSaveClick();
    });
  }

  hideModal() {
    this.modalOverlay.style.display = "none";
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="color: var(--${type})">${Icons.alert}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- VEHICLE ACTIONS ---
  showVehicleModal(vehicleId = null) {
    const vehicle = vehicleId ? window.store.getVehicleById(vehicleId) : null;
    this.activeVehicleEditId = vehicleId;

    const title = vehicle ? "Edit Fleet Vehicle" : "Register Fleet Asset";
    const body = `
      <form id="vehicle-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Registration Number (Unique)</label>
          <input type="text" id="v-regNum" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.regNum : ''}" required ${vehicle ? 'readonly' : ''}>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Model / Vehicle Name</label>
          <input type="text" id="v-name" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.name : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Vehicle Type</label>
          <select id="v-type" class="filter-select" style="width: 100%;">
            <option value="Van" ${vehicle && vehicle.type === 'Van' ? 'selected' : ''}>Van</option>
            <option value="Heavy Truck" ${vehicle && vehicle.type === 'Heavy Truck' ? 'selected' : ''}>Heavy Truck</option>
            <option value="Flatbed" ${vehicle && vehicle.type === 'Flatbed' ? 'selected' : ''}>Flatbed</option>
            <option value="Light Vehicle" ${vehicle && vehicle.type === 'Light Vehicle' ? 'selected' : ''}>Light Vehicle</option>
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Max Load Capacity (kg)</label>
          <input type="number" id="v-capacity" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.maxCapacity : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Odometer Reading (km)</label>
          <input type="number" id="v-odometer" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.odometer : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Acquisition Cost ($)</label>
          <input type="number" id="v-cost" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.acquisitionCost : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Operating Region</label>
          <input type="text" id="v-region" class="form-input" style="padding-left: 16px;" value="${vehicle ? vehicle.region : ''}" required>
        </div>
        ${vehicle ? `
          <div class="form-group" style="margin: 0;">
            <label>Lifecycle Status</label>
            <select id="v-status" class="filter-select" style="width: 100%;">
              <option value="Available" ${vehicle.status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="In Shop" ${vehicle.status === 'In Shop' ? 'selected' : ''}>In Shop</option>
              <option value="Retired" ${vehicle.status === 'Retired' ? 'selected' : ''}>Retired</option>
            </select>
          </div>
        ` : ''}
      </form>
    `;

    this.showModal(title, body, () => this.saveVehicle());
  }

  saveVehicle() {
    const regNum = document.getElementById("v-regNum").value.trim();
    const name = document.getElementById("v-name").value.trim();
    const type = document.getElementById("v-type").value;
    const maxCapacity = Number(document.getElementById("v-capacity").value);
    const odometer = Number(document.getElementById("v-odometer").value);
    const acquisitionCost = Number(document.getElementById("v-cost").value);
    const region = document.getElementById("v-region").value.trim();

    if (!regNum || !name || !maxCapacity) {
      this.showToast("Please fill in all mandatory fields.", "warning");
      return;
    }

    try {
      if (this.activeVehicleEditId) {
        const status = document.getElementById("v-status").value;
        window.store.updateVehicle(this.activeVehicleEditId, { name, type, maxCapacity, odometer, acquisitionCost, region, status });
        this.showToast("Vehicle updated successfully.", "success");
      } else {
        window.store.addVehicle({ regNum, name, type, maxCapacity, odometer, acquisitionCost, region });
        this.showToast("Vehicle registered successfully.", "success");
      }
      this.hideModal();
      this.navigateTo("vehicles");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  deleteVehicle(id) {
    if (confirm("Are you sure you want to remove this vehicle from registry?")) {
      try {
        window.store.deleteVehicle(id);
        this.showToast("Vehicle deleted successfully.", "success");
        this.navigateTo("vehicles");
      } catch (err) {
        this.showToast(err.message, "danger");
      }
    }
  }

  filterVehicles() {
    const search = document.getElementById("vehicle-search").value.toLowerCase();
    const type = document.getElementById("vehicle-type-filter").value;
    const status = document.getElementById("vehicle-status-filter").value;

    const rows = document.querySelectorAll(".vehicle-row");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const reg = row.getAttribute("data-reg");
      const vtype = row.getAttribute("data-type");
      const vstatus = row.getAttribute("data-status");

      const matchSearch = name.includes(search) || reg.includes(search);
      const matchType = type === "" || vtype === type;
      const matchStatus = status === "" || vstatus === status;

      if (matchSearch && matchType && matchStatus) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  // --- DRIVER ACTIONS ---
  showDriverModal(driverId = null) {
    const driver = driverId ? window.store.getDriverById(driverId) : null;
    this.activeDriverEditId = driverId;

    const title = driver ? "Edit Driver Details" : "Register New Driver";
    const body = `
      <form id="driver-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Full Name</label>
          <input type="text" id="d-name" class="form-input" style="padding-left: 16px;" value="${driver ? driver.name : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>License Number</label>
          <input type="text" id="d-licenseNum" class="form-input" style="padding-left: 16px;" value="${driver ? driver.licenseNum : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>License Category</label>
          <select id="d-category" class="filter-select" style="width: 100%;">
            <option value="Class A" ${driver && driver.category === 'Class A' ? 'selected' : ''}>Class A (Heavy Duty)</option>
            <option value="Class B" ${driver && driver.category === 'Class B' ? 'selected' : ''}>Class B (Standard Fleet)</option>
            <option value="Class C" ${driver && driver.category === 'Class C' ? 'selected' : ''}>Class C (Light Transport)</option>
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>License Expiry Date</label>
          <input type="date" id="d-expiryDate" class="form-input" style="padding-left: 16px;" value="${driver ? driver.expiryDate : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Contact Number</label>
          <input type="text" id="d-contact" class="form-input" style="padding-left: 16px;" value="${driver ? driver.contact : ''}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Safety Audit Score (0 - 100)</label>
          <input type="number" id="d-score" class="form-input" style="padding-left: 16px;" min="0" max="100" value="${driver ? driver.safetyScore : '100'}" required>
        </div>
        ${driver ? `
          <div class="form-group" style="margin: 0;">
            <label>Duty Status</label>
            <select id="d-status" class="filter-select" style="width: 100%;">
              <option value="Available" ${driver.status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Off Duty" ${driver.status === 'Off Duty' ? 'selected' : ''}>Off Duty</option>
              <option value="Suspended" ${driver.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
            </select>
          </div>
        ` : ''}
      </form>
    `;

    this.showModal(title, body, () => this.saveDriver());
  }

  saveDriver() {
    const name = document.getElementById("d-name").value.trim();
    const licenseNum = document.getElementById("d-licenseNum").value.trim();
    const category = document.getElementById("d-category").value;
    const expiryDate = document.getElementById("d-expiryDate").value;
    const contact = document.getElementById("d-contact").value.trim();
    const safetyScore = Number(document.getElementById("d-score").value);

    if (!name || !licenseNum || !expiryDate || !contact) {
      this.showToast("Please fill in all mandatory driver details.", "warning");
      return;
    }

    try {
      if (this.activeDriverEditId) {
        const status = document.getElementById("d-status").value;
        window.store.updateDriver(this.activeDriverEditId, { name, licenseNum, category, expiryDate, contact, safetyScore, status });
        this.showToast("Driver profile updated.", "success");
      } else {
        window.store.addDriver({ name, licenseNum, category, expiryDate, contact, safetyScore });
        this.showToast("Driver profile registered.", "success");
      }
      this.hideModal();
      this.navigateTo("drivers");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  deleteDriver(id) {
    if (confirm("Are you sure you want to delete this driver?")) {
      try {
        window.store.deleteDriver(id);
        this.showToast("Driver profile removed.", "success");
        this.navigateTo("drivers");
      } catch (err) {
        this.showToast(err.message, "danger");
      }
    }
  }

  filterDrivers() {
    const search = document.getElementById("driver-search").value.toLowerCase();
    const status = document.getElementById("driver-status-filter").value;

    const cards = document.querySelectorAll(".driver-card");
    cards.forEach(card => {
      const name = card.getAttribute("data-name");
      const license = card.getAttribute("data-license");
      const dstatus = card.getAttribute("data-status");

      const matchSearch = name.includes(search) || license.includes(search);
      const matchStatus = status === "" || dstatus === status;

      if (matchSearch && matchStatus) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // --- TRIP LIFE CYCLE ACTIONS ---
  showTripModal() {
    const vehicles = window.store.getVehicles().filter(v => v.status === "Available");
    const drivers = window.store.getDrivers().filter(d => d.status === "Available" && !window.store.isLicenseExpired(d));

    let vehicleOptions = vehicles.map(v => `<option value="${v.id}">${v.name} (${v.regNum}) [Capacity: ${v.maxCapacity}kg]</option>`).join("");
    let driverOptions = drivers.map(d => `<option value="${d.id}">${d.name} (Score: ${d.safetyScore})</option>`).join("");

    if (vehicles.length === 0) vehicleOptions = `<option value="">No Available Vehicles in Registry</option>`;
    if (drivers.length === 0) driverOptions = `<option value="">No Available/Licensed Drivers</option>`;

    const body = `
      <form id="trip-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Departure Point / Source</label>
          <input type="text" id="t-source" class="form-input" style="padding-left: 16px;" placeholder="e.g. Depot A" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Destination Point</label>
          <input type="text" id="t-dest" class="form-input" style="padding-left: 16px;" placeholder="e.g. Factory B" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Cargo Weight (kg)</label>
          <input type="number" id="t-cargo" class="form-input" style="padding-left: 16px;" placeholder="e.g. 450" oninput="window.app.filterDispatchOptionsByLoad()" required>
          <div id="capacity-warning" style="font-size: 11px; color: var(--danger); display: none; margin-top: 4px;">Cargo exceeds selected vehicle limit!</div>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Planned Distance (km)</label>
          <input type="number" id="t-dist" class="form-input" style="padding-left: 16px;" placeholder="e.g. 150" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Contract Revenue ($)</label>
          <input type="number" id="t-rev" class="form-input" style="padding-left: 16px;" placeholder="e.g. 800" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Assign Available Vehicle</label>
          <select id="t-vehicleId" class="filter-select" style="width: 100%;" onchange="window.app.validateCargoLimit()">
            ${vehicleOptions}
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Assign Available Driver</label>
          <select id="t-driverId" class="filter-select" style="width: 100%;">
            ${driverOptions}
          </select>
        </div>
      </form>
    `;

    this.showModal("Create New Dispatch Order", body, () => this.saveTrip());
  }

  // Dynamic filter UX: if cargo weight is set, disable or warn about vehicle selection exceeding capacity
  filterDispatchOptionsByLoad() {
    const weight = Number(document.getElementById("t-cargo").value);
    const select = document.getElementById("t-vehicleId");
    
    // Check all options
    Array.from(select.options).forEach(opt => {
      const vehicle = window.store.getVehicleById(opt.value);
      if (vehicle && vehicle.maxCapacity < weight) {
        opt.disabled = true;
        opt.style.opacity = "0.5";
      } else {
        opt.disabled = false;
        opt.style.opacity = "1";
      }
    });

    this.validateCargoLimit();
  }

  validateCargoLimit() {
    const weight = Number(document.getElementById("t-cargo").value);
    const select = document.getElementById("t-vehicleId");
    const warning = document.getElementById("capacity-warning");
    
    if (select.value) {
      const vehicle = window.store.getVehicleById(select.value);
      if (vehicle && vehicle.maxCapacity < weight) {
        warning.style.display = "block";
        this.modalSaveBtn.disabled = true;
      } else {
        warning.style.display = "none";
        this.modalSaveBtn.disabled = false;
      }
    }
  }

  saveTrip() {
    const source = document.getElementById("t-source").value.trim();
    const destination = document.getElementById("t-dest").value.trim();
    const cargoWeight = Number(document.getElementById("t-cargo").value);
    const distance = Number(document.getElementById("t-dist").value);
    const revenue = Number(document.getElementById("t-rev").value);
    const vehicleId = document.getElementById("t-vehicleId").value;
    const driverId = document.getElementById("t-driverId").value;

    if (!source || !destination || !cargoWeight || !distance || !vehicleId || !driverId) {
      this.showToast("All fields are mandatory for creating a trip.", "warning");
      return;
    }

    try {
      window.store.addTrip({ source, destination, cargoWeight, distance, revenue, vehicleId, driverId });
      this.showToast("Trip order created as Draft.", "success");
      this.hideModal();
      this.navigateTo("trips");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  dispatchTrip(id) {
    try {
      window.store.dispatchTrip(id);
      this.showToast("Trip Dispatched! Vehicle and Driver are now On Trip.", "success");
      this.navigateTo("trips");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  cancelTrip(id) {
    try {
      window.store.cancelTrip(id);
      this.showToast("Trip Order has been Cancelled.", "info");
      this.navigateTo("trips");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  showCompleteTripModal(tripId) {
    this.activeCompleteTripId = tripId;
    const trip = window.store.getTripById(tripId);
    const vehicle = window.store.getVehicleById(trip.vehicleId);

    const body = `
      <form id="complete-trip-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
          Completing Trip from <strong>${trip.source}</strong> to <strong>${trip.destination}</strong>.
          <br/>Current Vehicle Odometer: <strong>${vehicle.odometer} km</strong>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Final Odometer Reading (km)</label>
          <input type="number" id="ct-odometer" class="form-input" style="padding-left: 16px;" value="${vehicle.odometer + trip.distance}" required>
        </div>
        <div style="font-weight: 600; font-size: 12px; margin-top: 10px; color: var(--primary);">Optional: Log Fuel Consumption</div>
        <div class="form-group" style="margin: 0;">
          <label>Fuel Consumed (Liters)</label>
          <input type="number" id="ct-fuel-liters" class="form-input" style="padding-left: 16px;" placeholder="e.g. 45">
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Fuel Cost ($)</label>
          <input type="number" id="ct-fuel-cost" class="form-input" style="padding-left: 16px;" placeholder="e.g. 70">
        </div>
      </form>
    `;

    this.showModal("Complete Active Trip", body, () => this.handleCompleteTrip());
  }

  handleCompleteTrip() {
    const finalOdometer = Number(document.getElementById("ct-odometer").value);
    const fuelLiters = document.getElementById("ct-fuel-liters").value;
    const fuelCost = document.getElementById("ct-fuel-cost").value;

    try {
      window.store.completeTrip(this.activeCompleteTripId, finalOdometer, fuelLiters, fuelCost);
      this.showToast("Trip marked Completed. Vehicle & Driver status reset to Available.", "success");
      this.hideModal();
      this.navigateTo("trips");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  // --- MAINTENANCE OPERATIONS ---
  showMaintenanceModal() {
    const vehicles = window.store.getVehicles().filter(v => v.status === "Available");
    let options = vehicles.map(v => `<option value="${v.id}">${v.name} (${v.regNum})</option>`).join("");
    if (vehicles.length === 0) options = `<option value="">No Available Vehicles</option>`;

    const body = `
      <form id="maintenance-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Select Fleet Vehicle</label>
          <select id="m-vehicleId" class="filter-select" style="width: 100%;">
            ${options}
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Issue Description</label>
          <textarea id="m-desc" class="form-input" style="padding-left: 16px; height: 80px; resize: none;" placeholder="Brake replacements, engine diagnostics..." required></textarea>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Estimated Cost ($)</label>
          <input type="number" id="m-cost" class="form-input" style="padding-left: 16px;" required>
        </div>
      </form>
    `;

    this.showModal("Log Maintenance Entry", body, () => this.saveMaintenance());
  }

  saveMaintenance() {
    const vehicleId = document.getElementById("m-vehicleId").value;
    const description = document.getElementById("m-desc").value.trim();
    const cost = Number(document.getElementById("m-cost").value);

    if (!vehicleId || !description || !cost) {
      this.showToast("Please fill out all fields.", "warning");
      return;
    }

    try {
      window.store.addMaintenanceLog({ vehicleId, description, cost });
      this.showToast("Maintenance Logged. Vehicle sent to Shop.", "success");
      this.hideModal();
      this.navigateTo("maintenance");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  showCloseMaintenanceModal(logId) {
    this.activeCloseMaintenanceId = logId;
    const log = window.store.getMaintenanceLogs().find(m => m.id === logId);
    
    const body = `
      <form id="close-maintenance-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Final Maintenance Cost ($)</label>
          <input type="number" id="cm-cost" class="form-input" style="padding-left: 16px;" value="${log.cost}" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Release Vehicle To</label>
          <select id="cm-resolveStatus" class="filter-select" style="width: 100%;">
            <option value="Available">Available Status</option>
            <option value="Retired">Retired Status (Decommission)</option>
          </select>
        </div>
      </form>
    `;

    this.showModal("Close Maintenance Log & Release Vehicle", body, () => this.handleCloseMaintenance());
  }

  handleCloseMaintenance() {
    const cost = Number(document.getElementById("cm-cost").value);
    const resolveStatus = document.getElementById("cm-resolveStatus").value;

    try {
      window.store.closeMaintenanceLog(this.activeCloseMaintenanceId, cost, resolveStatus);
      this.showToast("Maintenance log closed. Vehicle released.", "success");
      this.hideModal();
      this.navigateTo("maintenance");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  // --- EXPENSE & FUEL LOGGING ---
  showFuelModal() {
    const vehicles = window.store.getVehicles().filter(v => v.status !== "Retired");
    let options = vehicles.map(v => `<option value="${v.id}">${v.name} (${v.regNum}) [Current Odo: ${v.odometer}km]</option>`).join("");

    const body = `
      <form id="fuel-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Select Vehicle</label>
          <select id="fl-vehicleId" class="filter-select" style="width: 100%;">
            ${options}
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Fuel Consumed (Liters)</label>
          <input type="number" id="fl-liters" class="form-input" style="padding-left: 16px;" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Total Cost ($)</label>
          <input type="number" id="fl-cost" class="form-input" style="padding-left: 16px;" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Odometer Reading (km)</label>
          <input type="number" id="fl-odometer" class="form-input" style="padding-left: 16px;" required>
        </div>
      </form>
    `;

    this.showModal("Log Fuel Consumption", body, () => this.saveFuelLog());
  }

  saveFuelLog() {
    const vehicleId = document.getElementById("fl-vehicleId").value;
    const liters = Number(document.getElementById("fl-liters").value);
    const cost = Number(document.getElementById("fl-cost").value);
    const odo = Number(document.getElementById("fl-odometer").value);

    const vehicle = window.store.getVehicleById(vehicleId);

    if (!vehicleId || !liters || !cost || !odo) {
      this.showToast("All fields are required.", "warning");
      return;
    }

    if (odo < vehicle.odometer) {
      this.showToast(`Odometer cannot be less than vehicle's current odometer (${vehicle.odometer} km).`, "warning");
      return;
    }

    try {
      window.store.addFuelLog({ vehicleId, liters, cost, odometerReading: odo });
      window.store.updateVehicle(vehicleId, { odometer: odo });
      this.showToast("Fuel usage logged and odometer updated.", "success");
      this.hideModal();
      this.navigateTo("expenses");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  showExpenseModal() {
    const vehicles = window.store.getVehicles().filter(v => v.status !== "Retired");
    let options = vehicles.map(v => `<option value="${v.id}">${v.name} (${v.regNum})</option>`).join("");

    const body = `
      <form id="expense-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group" style="margin: 0;">
          <label>Select Vehicle</label>
          <select id="ex-vehicleId" class="filter-select" style="width: 100%;">
            ${options}
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Expense Type</label>
          <select id="ex-type" class="filter-select" style="width: 100%;">
            <option value="Toll">Toll Fee</option>
            <option value="Insurance">Insurance Premium</option>
            <option value="Permit">Permits / Licenses</option>
            <option value="Other">Other Expenses</option>
          </select>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Cost ($)</label>
          <input type="number" id="ex-cost" class="form-input" style="padding-left: 16px;" required>
        </div>
        <div class="form-group" style="margin: 0;">
          <label>Description / Reference</label>
          <input type="text" id="ex-desc" class="form-input" style="padding-left: 16px;" required>
        </div>
      </form>
    `;

    this.showModal("Log Operational Expense", body, () => this.saveExpense());
  }

  saveExpense() {
    const vehicleId = document.getElementById("ex-vehicleId").value;
    const type = document.getElementById("ex-type").value;
    const cost = Number(document.getElementById("ex-cost").value);
    const description = document.getElementById("ex-desc").value.trim();

    if (!vehicleId || !cost || !description) {
      this.showToast("All fields are required.", "warning");
      return;
    }

    try {
      window.store.addExpense({ vehicleId, type, cost, description });
      this.showToast("Operating expense logged.", "success");
      this.hideModal();
      this.navigateTo("expenses");
    } catch (err) {
      this.showToast(err.message, "danger");
    }
  }

  // --- SYSTEM AUDITS & SIMULATIONS ---
  triggerAlertAction(idx) {
    if (window.activeAlertActions && window.activeAlertActions[idx]) {
      const alert = window.activeAlertActions[idx];
      alert.action();
      
      // Refresh views
      this.navigateTo(this.currentView);
    }
  }

  sendLicenseReminders() {
    const drivers = window.store.getDrivers();
    let remindersCount = 0;
    
    drivers.forEach(d => {
      if (window.store.isLicenseExpired(d) || window.store.isLicenseExpiringSoon(d)) {
        remindersCount++;
      }
    });

    if (remindersCount === 0) {
      this.showToast("All driver licenses are fully valid. No reminders needed.", "info");
    } else {
      this.showToast(`Email reminders dispatched to ${remindersCount} drivers successfully.`, "success");
    }
  }

  // --- DATA EXPORTS ---
  exportToCSV() {
    const vehicles = window.store.getVehicles();
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Registration Number,Vehicle Name,Type,Max Capacity (kg),Odometer (km),Acquisition Cost ($),Total Expenses ($),ROI (%),Status\r\n";
    
    // Rows
    vehicles.forEach(v => {
      const expenses = window.store.getVehicleOperationalCost(v.id);
      const roi = window.store.getVehicleROI(v.id);
      const row = `"${v.regNum}","${v.name}","${v.type}",${v.maxCapacity},${v.odometer},${v.acquisitionCost},${expenses},${roi},"${v.status}"`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transitops_fleet_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("CSV report download started.", "success");
  }
}
