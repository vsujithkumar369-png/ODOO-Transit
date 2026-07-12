/* 
 * TransitOps - Smart Transport Operations Platform
 * UI View Component Renderers
 */

// Lucide-style inline SVG Icons Helper
const Icons = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11v11"/><path d="M14 14h7v4H14z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  route: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/></svg>`,
  tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  dollar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  analytics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  gas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v20"/><path d="M17 5h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/><circle cx="10" cy="12" r="3"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
};

const components = {
  // Render Dashboard
  renderDashboard(container) {
    const stats = window.store.getDashboardStats();
    
    let html = `
      <div class="kpi-grid">
        <div class="glass-panel kpi-card info">
          <div class="kpi-info">
            <span class="kpi-title">Active Vehicles</span>
            <span class="kpi-value">${stats.activeVehicles} / ${stats.totalVehicles}</span>
          </div>
          <div class="kpi-icon info">${Icons.truck}</div>
        </div>
        <div class="glass-panel kpi-card success">
          <div class="kpi-info">
            <span class="kpi-title">Available Vehicles</span>
            <span class="kpi-value">${stats.availableVehicles}</span>
          </div>
          <div class="kpi-icon success">${Icons.check}</div>
        </div>
        <div class="glass-panel kpi-card warning">
          <div class="kpi-info">
            <span class="kpi-title">In Shop</span>
            <span class="kpi-value">${stats.inMaintenance}</span>
          </div>
          <div class="kpi-icon warning">${Icons.tool}</div>
        </div>
        <div class="glass-panel kpi-card primary">
          <div class="kpi-info">
            <span class="kpi-title">Fleet Utilization</span>
            <span class="kpi-value">${stats.utilization}%</span>
          </div>
          <div class="kpi-icon primary">${Icons.analytics}</div>
        </div>
      </div>

      <div class="dash-layout-grid">
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 20px; font-weight: 700; font-size: 16px;">Active Dispatch Operations</h3>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Cargo Weight</th>
                  <th>Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
    `;

    const activeTrips = window.store.getTrips().filter(t => t.status === "Dispatched" || t.status === "Draft");
    if (activeTrips.length === 0) {
      html += `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No active dispatches.</td></tr>`;
    } else {
      activeTrips.forEach(t => {
        const vehicle = window.store.getVehicleById(t.vehicleId);
        const driver = window.store.getDriverById(t.driverId);
        const badgeClass = t.status === "Dispatched" ? "badge-success" : "badge-warning";
        html += `
          <tr>
            <td style="font-weight: 700;">#${t.id.substring(0, 6)}</td>
            <td>
              <div style="font-weight: 600;">${t.source}</div>
              <div style="font-size: 12px; color: var(--text-muted);">to ${t.destination}</div>
            </td>
            <td>${vehicle ? vehicle.name : "N/A"} (${vehicle ? vehicle.regNum : ""})</td>
            <td>${driver ? driver.name : "N/A"}</td>
            <td>${t.cargoWeight} kg</td>
            <td>${t.distance} km</td>
            <td><span class="badge ${badgeClass}">${t.status}</span></td>
          </tr>
        `;
      });
    }

    html += `
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
          <h3 style="font-weight: 700; font-size: 16px;">Compliance & Action Center</h3>
          <div class="alert-widget-list">
    `;

    const alerts = window.store.getSystemAlerts();
    if (alerts.length === 0) {
      html += `<div style="text-align: center; color: var(--text-muted); padding: 32px 0;">All operations compliant. No warnings.</div>`;
    } else {
      alerts.slice(0, 3).forEach((alert, idx) => {
        const iconColor = alert.type === "danger" ? "var(--danger)" : alert.type === "warning" ? "var(--warning)" : "var(--info)";
        html += `
          <div class="alert-widget-item">
            <div style="color: ${iconColor}">${Icons.alert}</div>
            <div class="alert-widget-content">
              <span class="alert-widget-title">${alert.title}</span>
              <span class="alert-widget-desc">${alert.desc}</span>
              <div class="alert-widget-action">
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;" onclick="window.triggerAlertAction(${idx})">
                  ${alert.actionLabel}
                </button>
              </div>
            </div>
          </div>
        `;
      });
      // Store action hooks globally for dynamic execution
      window.activeAlertActions = alerts;
    }

    html += `
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Vehicles Registry (CRUD for Fleet Manager)
  renderVehicles(container) {
    const vehicles = window.store.getVehicles();
    const canManage = window.auth.hasActionPermission("manage_vehicles");

    let html = `
      <div class="registry-header">
        <div class="registry-filters">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" class="search-input" id="vehicle-search" placeholder="Search vehicle name or registration..." oninput="window.filterVehiclesList()">
          </div>
          <select class="filter-select" id="vehicle-type-filter" onchange="window.filterVehiclesList()">
            <option value="">All Types</option>
            <option value="Van">Van</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Flatbed">Flatbed</option>
            <option value="Light Vehicle">Light Vehicle</option>
          </select>
          <select class="filter-select" id="vehicle-status-filter" onchange="window.filterVehiclesList()">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        ${canManage ? `
          <button class="btn btn-primary" onclick="window.showAddVehicleModal()">
            ${Icons.plus} Add Vehicle
          </button>
        ` : ""}
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <div class="table-responsive">
          <table class="custom-table" id="vehicles-table">
            <thead>
              <tr>
                <th>Reg Number</th>
                <th>Model / Name</th>
                <th>Type</th>
                <th>Max Capacity</th>
                <th>Odometer</th>
                <th>Operational Cost</th>
                <th>ROI (%)</th>
                <th>Status</th>
                ${canManage ? `<th style="text-align: right;">Actions</th>` : ""}
              </tr>
            </thead>
            <tbody>
    `;

    vehicles.forEach(v => {
      let statusBadge = "badge-info";
      if (v.status === "Available") statusBadge = "badge-success";
      else if (v.status === "In Shop") statusBadge = "badge-warning";
      else if (v.status === "Retired") statusBadge = "badge-danger";

      const opCost = window.store.getVehicleOperationalCost(v.id);
      const roi = window.store.getVehicleROI(v.id);

      html += `
        <tr class="vehicle-row" data-name="${v.name.toLowerCase()}" data-reg="${v.regNum.toLowerCase()}" data-type="${v.type}" data-status="${v.status}">
          <td style="font-weight: 700; font-size: 13px;">${v.regNum}</td>
          <td>
            <div style="font-weight: 600;">${v.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">Region: ${v.region || 'Default'}</div>
          </td>
          <td>${v.type}</td>
          <td>${v.maxCapacity} kg</td>
          <td>${v.odometer.toLocaleString()} km</td>
          <td>$${opCost.toLocaleString()}</td>
          <td style="font-weight: 600; color: ${roi >= 0 ? 'var(--success)' : 'var(--danger)'}">${roi}%</td>
          <td><span class="badge ${statusBadge}">${v.status}</span></td>
          ${canManage ? `
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button class="icon-btn" style="width: 32px; height: 32px; border-radius: 6px;" onclick="window.showEditVehicleModal('${v.id}')" title="Edit Vehicle">${Icons.edit}</button>
                <button class="icon-btn" style="width: 32px; height: 32px; border-radius: 6px; color: var(--danger);" onclick="window.handleDeleteVehicle('${v.id}')" title="Delete Vehicle">${Icons.trash}</button>
              </div>
            </td>
          ` : ""}
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Driver Profiles (CRUD for Fleet Manager/Safety Officer)
  renderDrivers(container) {
    const drivers = window.store.getDrivers();
    const canManage = window.auth.hasActionPermission("manage_drivers");

    let html = `
      <div class="registry-header">
        <div class="registry-filters">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" class="search-input" id="driver-search" placeholder="Search driver name or license..." oninput="window.filterDriversList()">
          </div>
          <select class="filter-select" id="driver-status-filter" onchange="window.filterDriversList()">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        ${canManage ? `
          <button class="btn btn-primary" onclick="window.showAddDriverModal()">
            ${Icons.plus} Add Driver
          </button>
        ` : ""}
      </div>

      <div class="cards-grid" id="drivers-grid-container">
    `;

    drivers.forEach(d => {
      let statusBadge = "badge-info";
      if (d.status === "Available") statusBadge = "badge-success";
      else if (d.status === "Suspended") statusBadge = "badge-danger";
      else if (d.status === "Off Duty") statusBadge = "badge-warning";

      const initials = d.name.substring(0, 2).toUpperCase();
      
      const isExpired = window.store.isLicenseExpired(d);
      const isExpiringSoon = window.store.isLicenseExpiringSoon(d);
      
      let licenseWarning = "";
      if (isExpired) {
        licenseWarning = `<span class="badge badge-danger" style="margin-top: 4px; display: inline-block;">License Expired</span>`;
      } else if (isExpiringSoon) {
        licenseWarning = `<span class="badge badge-warning" style="margin-top: 4px; display: inline-block;">Expiring Soon</span>`;
      }

      html += `
        <div class="glass-panel entity-card driver-card" data-name="${d.name.toLowerCase()}" data-license="${d.licenseNum.toLowerCase()}" data-status="${d.status}">
          <div class="entity-card-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="avatar">${initials}</div>
              <div>
                <div class="entity-title">${d.name}</div>
                <div class="entity-subtitle">${d.contact}</div>
              </div>
            </div>
            <span class="badge ${statusBadge}">${d.status}</span>
          </div>

          <div class="entity-details">
            <div>
              <div class="detail-label">License</div>
              <div class="detail-value">${d.licenseNum}</div>
              ${licenseWarning}
            </div>
            <div>
              <div class="detail-label">Category</div>
              <div class="detail-value">${d.category}</div>
            </div>
            <div>
              <div class="detail-label">Expiry Date</div>
              <div class="detail-value">${d.expiryDate}</div>
            </div>
            <div>
              <div class="detail-label">Safety Score</div>
              <div class="detail-value" style="color: ${d.safetyScore >= 85 ? 'var(--success)' : d.safetyScore >= 70 ? 'var(--warning)' : 'var(--danger)'}; font-weight: 700;">
                ${d.safetyScore} / 100
              </div>
            </div>
          </div>

          <div class="entity-card-footer">
            ${canManage ? `
              <button class="btn btn-secondary" style="padding: 6px 12px;" onclick="window.showEditDriverModal('${d.id}')">${Icons.edit} Edit</button>
              <button class="btn btn-secondary" style="padding: 6px 12px; color: var(--danger);" onclick="window.handleDeleteDriver('${d.id}')">${Icons.trash}</button>
            ` : ""}
          </div>
        </div>
      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Maintenance Logs
  renderMaintenance(container) {
    const logs = window.store.getMaintenanceLogs();
    const canManage = window.auth.hasActionPermission("manage_maintenance");

    let html = `
      <div class="registry-header">
        <h2 style="font-size: 18px; font-weight: 700;">Maintenance & Shop Operations</h2>
        ${canManage ? `
          <button class="btn btn-primary" onclick="window.showAddMaintenanceModal()">
            ${Icons.tool} Log Shop Entry
          </button>
        ` : ""}
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Vehicle</th>
                <th>Issue / Description</th>
                <th>Est. Cost</th>
                <th>Date Placed</th>
                <th>Date Released</th>
                <th>Status</th>
                ${canManage ? `<th style="text-align: right;">Action</th>` : ""}
              </tr>
            </thead>
            <tbody>
    `;

    if (logs.length === 0) {
      html += `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No maintenance logs.</td></tr>`;
    } else {
      logs.forEach(log => {
        const vehicle = window.store.getVehicleById(log.vehicleId);
        const statusBadge = log.status === "Active" ? "badge-warning" : "badge-success";
        
        html += `
          <tr>
            <td style="font-weight: 700;">#${log.id.substring(0, 6)}</td>
            <td>
              <div style="font-weight: 600;">${vehicle ? vehicle.name : "Unknown"}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${vehicle ? vehicle.regNum : ""}</div>
            </td>
            <td>${log.description}</td>
            <td>$${log.cost.toLocaleString()}</td>
            <td>${log.startDate}</td>
            <td>${log.endDate || '-'}</td>
            <td><span class="badge ${statusBadge}">${log.status}</span></td>
            ${canManage ? `
              <td style="text-align: right;">
                ${log.status === "Active" ? `
                  <button class="btn btn-secondary" style="padding: 6px 12px; border-color: var(--success); color: var(--success);" onclick="window.showCloseMaintenanceModal('${log.id}')">
                    ${Icons.check} Complete Repair
                  </button>
                ` : `<span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Completed</span>`}
              </td>
            ` : ""}
          </tr>
        `;
      });
    }

    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Trip Dispatcher (CRUD for Drivers / Fleet Manager)
  renderTrips(container) {
    const trips = window.store.getTrips();
    const canManage = window.auth.hasActionPermission("manage_trips");

    let html = `
      <div class="registry-header">
        <h2 style="font-size: 18px; font-weight: 700;">Trip Dispatch & Lifecycles</h2>
        ${canManage ? `
          <button class="btn btn-primary" onclick="window.showAddTripModal()">
            ${Icons.plus} Create Dispatch Order
          </button>
        ` : ""}
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route Info</th>
                <th>Vehicle Assigned</th>
                <th>Driver Assigned</th>
                <th>Cargo Load</th>
                <th>Est. Revenue</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (trips.length === 0) {
      html += `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No dispatch trips created.</td></tr>`;
    } else {
      trips.forEach(t => {
        const vehicle = window.store.getVehicleById(t.vehicleId);
        const driver = window.store.getDriverById(t.driverId);
        
        let statusBadge = "badge-info";
        if (t.status === "Draft") statusBadge = "badge-warning";
        else if (t.status === "Completed") statusBadge = "badge-success";
        else if (t.status === "Cancelled") statusBadge = "badge-danger";

        html += `
          <tr>
            <td style="font-weight: 700;">#${t.id.substring(0, 6)}</td>
            <td>
              <div style="font-weight: 600;">${t.source} &rarr; ${t.destination}</div>
              <div style="font-size: 12px; color: var(--text-muted);">Est. Distance: ${t.distance} km</div>
            </td>
            <td>${vehicle ? vehicle.name : "N/A"} (${vehicle ? vehicle.regNum : "N/A"})</td>
            <td>${driver ? driver.name : "N/A"}</td>
            <td>${t.cargoWeight} kg</td>
            <td>$${t.revenue.toLocaleString()}</td>
            <td><span class="badge ${statusBadge}">${t.status}</span></td>
            <td style="text-align: right;">
              <div style="display: inline-flex; justify-content: flex-end; gap: 8px;">
        `;

        if (t.status === "Draft" && canManage) {
          html += `
            <button class="btn btn-secondary" style="padding: 6px 12px; border-color: var(--success); color: var(--success);" onclick="window.handleDispatchTrip('${t.id}')">
              Dispatch
            </button>
            <button class="btn btn-secondary" style="padding: 6px 12px; color: var(--danger);" onclick="window.handleCancelTrip('${t.id}')">
              Cancel
            </button>
          `;
        } else if (t.status === "Dispatched" && canManage) {
          html += `
            <button class="btn btn-secondary" style="padding: 6px 12px; border-color: var(--success); color: var(--success);" onclick="window.showCompleteTripModal('${t.id}')">
              Complete
            </button>
            <button class="btn btn-secondary" style="padding: 6px 12px; color: var(--danger);" onclick="window.handleCancelTrip('${t.id}')">
              Cancel
            </button>
          `;
        } else {
          html += `<span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">No actions available</span>`;
        }

        html += `
              </div>
            </td>
          </tr>
        `;
      });
    }

    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Expense Logging & Rollups
  renderExpenses(container) {
    const fuelLogs = window.store.getFuelLogs();
    const expenses = window.store.getExpenses();
    const canManage = window.auth.hasActionPermission("manage_expenses");

    let html = `
      <div class="registry-header">
        <h2 style="font-size: 18px; font-weight: 700;">Fuel & Expense Logs</h2>
        ${canManage ? `
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="window.showAddFuelModal()">
              ${Icons.gas} Log Fueling
            </button>
            <button class="btn btn-secondary" onclick="window.showAddExpenseModal()">
              ${Icons.dollar} Log Toll/Expense
            </button>
          </div>
        ` : ""}
      </div>

      <div class="dash-layout-grid">
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 16px; font-weight: 700; font-size: 15px;">Recent Fuel Consumption Logs</h3>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Fuel Liters</th>
                  <th>Fuel Cost</th>
                  <th>Odometer Reading</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
    `;

    if (fuelLogs.length === 0) {
      html += `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px 0;">No fuel logs recorded.</td></tr>`;
    } else {
      fuelLogs.forEach(f => {
        const vehicle = window.store.getVehicleById(f.vehicleId);
        html += `
          <tr>
            <td style="font-weight: 600;">${vehicle ? vehicle.name : "N/A"}</td>
            <td>${f.liters} L</td>
            <td style="font-weight: 600;">$${f.cost.toLocaleString()}</td>
            <td>${f.odometerReading.toLocaleString()} km</td>
            <td>${f.date}</td>
          </tr>
        `;
      });
    }

    html += `
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 16px; font-weight: 700; font-size: 15px;">General Operating Expenses (Tolls, etc.)</h3>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Cost</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
    `;

    if (expenses.length === 0) {
      html += `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px 0;">No expenses recorded.</td></tr>`;
    } else {
      expenses.forEach(e => {
        const vehicle = window.store.getVehicleById(e.vehicleId);
        html += `
          <tr>
            <td style="font-weight: 600;">${vehicle ? vehicle.name : "N/A"}</td>
            <td><span class="badge badge-info">${e.type}</span></td>
            <td style="font-weight: 600;">$${e.cost.toLocaleString()}</td>
            <td style="font-size: 13px;">${e.description}</td>
            <td>${e.date}</td>
          </tr>
        `;
      });
    }

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // Render Charts & Export Options
  renderAnalytics(container) {
    let html = `
      <div class="registry-header">
        <h2 style="font-size: 18px; font-weight: 700;">Reports & Fleet Analytics</h2>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="window.exportCSV()">
            Download CSV Report
          </button>
          <button class="btn btn-secondary" onclick="window.printPDF()">
            Print PDF Report
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 16px; font-size: 14px; color: var(--text-muted); text-transform: uppercase;">Total Fleet Revenue</h3>
          <div class="kpi-value" style="color: var(--success); font-size: 32px;">
            $${window.store.getTrips().filter(t => t.status === "Completed").reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
          </div>
        </div>
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 16px; font-size: 14px; color: var(--text-muted); text-transform: uppercase;">Total Operational Expenses</h3>
          <div class="kpi-value" style="color: var(--danger); font-size: 32px;">
            $${(
              window.store.getFuelLogs().reduce((sum, f) => sum + f.cost, 0) +
              window.store.getMaintenanceLogs().reduce((sum, m) => sum + m.cost, 0) +
              window.store.getExpenses().reduce((sum, e) => sum + e.cost, 0)
            ).toLocaleString()}
          </div>
        </div>
      </div>

      <div class="dash-layout-grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 20px; font-size: 15px; font-weight: 700;">Vehicle ROI Comparison (%)</h3>
          <div class="chart-container">
            <canvas id="roiChart"></canvas>
          </div>
        </div>

        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 20px; font-size: 15px; font-weight: 700;">Fuel Efficiency (Km / Liter)</h3>
          <div class="chart-container">
            <canvas id="fuelEfficiencyChart"></canvas>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Delayed Chart Initialization so canvases exist in DOM
    setTimeout(() => {
      this.initAnalyticsCharts();
    }, 100);
  },

  // Initialize ChartJS Canvases
  initAnalyticsCharts() {
    const vehicles = window.store.getVehicles().filter(v => v.status !== "Retired");
    const labels = vehicles.map(v => v.name);
    const roiData = vehicles.map(v => window.store.getVehicleROI(v.id));
    const efficiencyData = vehicles.map(v => window.store.getVehicleFuelEfficiency(v.id));

    // Common Chart Options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    };

    // ROI Chart
    const ctxRoi = document.getElementById("roiChart")?.getContext("2d");
    if (ctxRoi) {
      new Chart(ctxRoi, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'ROI %',
            data: roiData,
            backgroundColor: roiData.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.65)' : 'rgba(239, 68, 68, 0.65)'),
            borderColor: roiData.map(v => v >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'),
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: chartOptions
      });
    }

    // Fuel Efficiency Chart
    const ctxFuel = document.getElementById("fuelEfficiencyChart")?.getContext("2d");
    if (ctxFuel) {
      new Chart(ctxFuel, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Km per Liter',
            data: efficiencyData,
            backgroundColor: 'rgba(99, 102, 241, 0.65)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: chartOptions
      });
    }
  },

  // Render alerts list in detail
  renderAlerts(container) {
    const alerts = window.store.getSystemAlerts();
    
    let html = `
      <div class="registry-header">
        <h2 style="font-size: 18px; font-weight: 700;">Safety Officer Audit & Alerts Center</h2>
        <button class="btn btn-secondary" onclick="window.sendAllLicenseReminders()">
          ${Icons.email} Trigger License Expiry Emails
        </button>
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <h3 style="margin-bottom: 20px; font-size: 16px; font-weight: 700;">Outstanding Operations Warnings</h3>
        <div class="alert-widget-list" style="max-width: 600px;">
    `;

    if (alerts.length === 0) {
      html += `<div style="text-align: center; color: var(--text-muted); padding: 32px 0;">All vehicles, drivers, and operations are currently compliant.</div>`;
    } else {
      alerts.forEach((alert, idx) => {
        const iconColor = alert.type === "danger" ? "var(--danger)" : alert.type === "warning" ? "var(--warning)" : "var(--info)";
        html += `
          <div class="alert-widget-item">
            <div style="color: ${iconColor}">${Icons.alert}</div>
            <div class="alert-widget-content" style="flex: 1;">
              <span class="alert-widget-title">${alert.title}</span>
              <span class="alert-widget-desc">${alert.desc}</span>
              <div class="alert-widget-action">
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; margin-top: 8px;" onclick="window.triggerAlertAction(${idx})">
                  ${alert.actionLabel}
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};

window.components = components;
