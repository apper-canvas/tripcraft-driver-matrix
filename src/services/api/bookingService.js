import bookingsData from '@/services/mockData/bookings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bookings = [...bookingsData];

const bookingService = {
  async getAll() {
    await delay(300);
    return [...bookings];
  },

  async getByTripId(tripId) {
    await delay(200);
    return bookings.filter(b => b.tripId === parseInt(tripId, 10));
  },

  async getById(Id) {
    await delay(200);
    const booking = bookings.find(b => b.Id === parseInt(Id, 10));
    if (!booking) {
      throw new Error('Booking not found');
    }
    return { ...booking };
  },

  async create(bookingData) {
    await delay(400);
    const maxId = Math.max(...bookings.map(b => b.Id), 0);
    const newBooking = {
      Id: maxId + 1,
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(Id, data) {
    await delay(300);
    const index = bookings.findIndex(b => b.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    const updatedBooking = {
      ...bookings[index],
      ...data,
      Id: bookings[index].Id
    };
    bookings[index] = updatedBooking;
    return { ...updatedBooking };
  },

  async delete(Id) {
    await delay(250);
    const index = bookings.findIndex(b => b.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Booking not found');
    }
    bookings.splice(index, 1);
    return true;
  }
};

export default bookingService;