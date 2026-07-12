/* 
 * TransitOps - Smart Transport Operations Platform
 * Authentication & Role-Based Access Control (RBAC) Module
 */

class Auth {
  constructor() {
    this.sessionKey = "transitops_session";
    this.tokenKey = "transitops_token";
    this.currentUser = null;
    this.init();
  }

  init() {
    const session = sessionStorage.getItem(this.sessionKey);
    if (session) {
      this.currentUser = JSON.parse(session);
    }
  }

  async login(email, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        let errMsg = "Invalid email or password.";
        try {
          const errData = await response.json();
          if (errData && errData.message) errMsg = errData.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      const token = data.token;
      const backendRole = data.user.role;
      const mappedRole = this.mapBackendRoleToFrontend(backendRole);

      this.currentUser = {
        email: data.user.email,
        name: data.user.name,
        role: mappedRole,
        originalRole: backendRole
      };

      sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (err) {
      console.error("Login failed:", err);
      // Local fallback for robust hackathon display if API fails
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        return this.localFallbackLogin(email, password);
      }
      throw err;
    }
  }

  // Fallback for hackathon presentation if backend is not running
  localFallbackLogin(email, password) {
    const fallbackUsers = [
      { email: "manager@transitops.com", password: "admin", role: "fleet_manager", name: "Sarah Connor" },
      { email: "driver@transitops.com", password: "driver", role: "driver", name: "Alex Mercer" },
      { email: "safety@transitops.com", password: "safety", role: "safety_officer", name: "Safety Patrol" },
      { email: "analyst@transitops.com", password: "analyst", role: "financial_analyst", name: "Edward Thorne" }
    ];
    const user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      this.currentUser = {
        email: user.email,
        name: user.name,
        role: user.role
      };
      sessionStorage.setItem(this.tokenKey, "mock_token_" + Date.now());
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error("Invalid email or password (offline).");
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getAuthHeaders() {
    const token = sessionStorage.getItem(this.tokenKey);
    return {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    };
  }

  // Switch roles on the fly (Excellent for Hackathon demonstration)
  async switchRole(roleName) {
    if (!this.currentUser) return;
    
    // Quick role mapping credentials
    const credentialsMap = {
      fleet_manager: { email: "manager@transitops.com", pass: "admin" },
      driver: { email: "driver@transitops.com", pass: "driver" },
      safety_officer: { email: "safety@transitops.com", pass: "safety" },
      financial_analyst: { email: "analyst@transitops.com", pass: "analyst" }
    };

    const creds = credentialsMap[roleName];
    if (creds) {
      return await this.login(creds.email, creds.pass);
    }
  }

  // RBAC Helper mappings to backend roles
  mapBackendRoleToFrontend(role) {
    const map = {
      "FleetManager": "fleet_manager",
      "Driver": "driver",
      "SafetyOfficer": "safety_officer",
      "FinancialAnalyst": "financial_analyst"
    };
    return map[role] || role;
  }

  mapFrontendRoleToBackend(role) {
    const map = {
      "fleet_manager": "FleetManager",
      "driver": "Driver",
      "safety_officer": "SafetyOfficer",
      "financial_analyst": "FinancialAnalyst"
    };
    return map[role] || role;
  }

  // RBAC Access Control Mapping
  // Defines what views each role can see
  getRolePermissions(role) {
    const permissions = {
      fleet_manager: {
        views: ["dashboard", "vehicles", "drivers", "trips", "maintenance", "expenses", "analytics", "alerts"],
        actions: {
          manage_vehicles: true,
          manage_drivers: true,
          manage_trips: true,
          manage_maintenance: true,
          manage_expenses: true,
          view_analytics: true
        }
      },
      driver: {
        views: ["dashboard", "trips"],
        actions: {
          manage_vehicles: false,
          manage_drivers: false,
          manage_trips: true, // Drivers log/update trips
          manage_maintenance: false,
          manage_expenses: false,
          view_analytics: false
        }
      },
      safety_officer: {
        views: ["dashboard", "drivers", "alerts"],
        actions: {
          manage_vehicles: false,
          manage_drivers: true, // Auditing safety scores & licensing
          manage_trips: false,
          manage_maintenance: false,
          manage_expenses: false,
          view_analytics: false
        }
      },
      financial_analyst: {
        views: ["dashboard", "vehicles", "expenses", "analytics"],
        actions: {
          manage_vehicles: false,
          manage_drivers: false,
          manage_trips: false,
          manage_maintenance: false,
          manage_expenses: true, // Log fuel/expenses & analyze ROI
          view_analytics: true
        }
      }
    };

    return permissions[role] || { views: [], actions: {} };
  }

  hasViewPermission(viewId) {
    if (!this.currentUser) return false;
    const perms = this.getRolePermissions(this.currentUser.role);
    return perms.views.includes(viewId);
  }

  hasActionPermission(actionId) {
    if (!this.currentUser) return false;
    const perms = this.getRolePermissions(this.currentUser.role);
    return !!perms.actions[actionId];
  }
}

// Global instance
window.auth = new Auth();

