import tripsData from '@/services/mockData/trips.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let trips = [...tripsData];

const tripService = {
  async getAll() {
    await delay(300);
    return [...trips];
  },

  async getById(Id) {
    await delay(200);
    const trip = trips.find(t => t.Id === parseInt(Id, 10));
    if (!trip) {
      throw new Error('Trip not found');
    }
    return { ...trip };
  },

  async create(tripData) {
    await delay(400);
    const maxId = Math.max(...trips.map(t => t.Id), 0);
    const newTrip = {
      Id: maxId + 1,
      ...tripData,
      createdAt: new Date().toISOString(),
      expenses: [],
      bookings: []
    };
    trips.push(newTrip);
    return { ...newTrip };
  },

  async update(Id, data) {
    await delay(300);
    const index = trips.findIndex(t => t.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Trip not found');
    }
    
    const updatedTrip = {
      ...trips[index],
      ...data,
      Id: trips[index].Id // Prevent Id modification
    };
    trips[index] = updatedTrip;
    return { ...updatedTrip };
  },

  async delete(Id) {
    await delay(250);
    const index = trips.findIndex(t => t.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Trip not found');
    }
    trips.splice(index, 1);
    return true;
  }
};

export default tripService;