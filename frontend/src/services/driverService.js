import { request } from './api';

const fallbackDrivers = [
  { id: 1, name: "John Doe", phone: "+1 234 567 890", license: "CDL-A", expiry: "2027-10-15", status: "Active" },
  { id: 2, name: "Alice Smith", phone: "+1 987 654 321", license: "CDL-B", expiry: "2026-05-22", status: "On Trip" },
  { id: 3, name: "Robert Fox", phone: "+1 555 444 333", license: "CDL-A", expiry: "2024-01-10", status: "Expiring Soon" }
];

export const driverService = {
  async list() {
    return request('GET', '/drivers', null, fallbackDrivers);
  }
};
