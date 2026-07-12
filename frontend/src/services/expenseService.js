import { request } from './api';

const fallbackExpenses = [
  { id: 'EXP-9021', date: '2026-07-10', vehicle: 'All', category: 'Fuel', amount: '$4,250.00', status: 'Cleared' },
  { id: 'EXP-9022', date: '2026-07-11', vehicle: 'V-003', category: 'Maintenance', amount: '$1,820.50', status: 'Pending' },
  { id: 'EXP-9023', date: '2026-07-11', vehicle: 'All', category: 'Salary', amount: '$12,400.00', status: 'Cleared' }
];

export const expenseService = {
  async list() {
    return request('GET', '/expenses', null, fallbackExpenses);
  }
};
