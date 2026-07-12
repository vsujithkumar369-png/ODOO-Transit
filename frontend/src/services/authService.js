import { request, setAuthToken, removeAuthToken } from './api';

export const authService = {
  async login(email, password) {
    const fallback = {
      user: {
        id: 1,
        name: "Fleet Manager",
        email: email || "manager@transitops.com",
        phone: "9876543210",
        role: "FleetManager"
      },
      token: "mock-token-eyJhbGciOiJIUzI1NiIsIn..."
    };
    
    const data = await request('POST', '/auth/login', { email, password }, fallback);
    if (data && data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async register(userData) {
    const fallback = {
      id: 1,
      name: userData.name || "New User",
      email: userData.email,
      phone: userData.phone || "9876543210",
      role: userData.role || "FleetManager",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return request('POST', '/auth/register', userData, fallback);
  },

  async getMe() {
    const fallback = {
      id: 1,
      name: "Fleet Manager",
      email: "manager@transitops.com",
      phone: "9876543210",
      role: "FleetManager"
    };
    return request('GET', '/auth/me', null, fallback);
  },

  logout() {
    removeAuthToken();
  }
};
