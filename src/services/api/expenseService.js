import expensesData from '@/services/mockData/expenses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let expenses = [...expensesData];

const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses];
  },

  async getByTripId(tripId) {
    await delay(200);
    return expenses.filter(e => e.tripId === parseInt(tripId, 10));
  },

  async getById(Id) {
    await delay(200);
    const expense = expenses.find(e => e.Id === parseInt(Id, 10));
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  },

  async create(expenseData) {
    await delay(400);
    const maxId = Math.max(...expenses.map(e => e.Id), 0);
    const newExpense = {
      Id: maxId + 1,
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(Id, data) {
    await delay(300);
    const index = expenses.findIndex(e => e.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...data,
      Id: expenses[index].Id
    };
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  async delete(Id) {
    await delay(250);
    const index = expenses.findIndex(e => e.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses.splice(index, 1);
    return true;
  }
};

export default expenseService;