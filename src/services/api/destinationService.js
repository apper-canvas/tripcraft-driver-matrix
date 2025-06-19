import destinationsData from '@/services/mockData/destinations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let destinations = [...destinationsData];

const destinationService = {
  async getAll() {
    await delay(300);
    return [...destinations];
  },

  async getById(Id) {
    await delay(200);
    const destination = destinations.find(d => d.Id === parseInt(Id, 10));
    if (!destination) {
      throw new Error('Destination not found');
    }
    return { ...destination };
  },

  async searchFlights(searchParams) {
    await delay(500);
    // Mock flight search results
    const flights = [
      {
        Id: 1,
        airline: 'SkyLine Airways',
        departure: searchParams.departure || 'New York',
        arrival: searchParams.arrival || 'Paris',
        departureTime: '08:30',
        arrivalTime: '22:45',
        duration: '8h 15m',
        stops: 0,
        price: 649,
        type: 'Economy'
      },
      {
        Id: 2,
        airline: 'Global Wings',
        departure: searchParams.departure || 'New York',
        arrival: searchParams.arrival || 'Paris',
        departureTime: '14:20',
        arrivalTime: '05:35+1',
        duration: '9h 15m',
        stops: 1,
        price: 529,
        type: 'Economy'
      },
      {
        Id: 3,
        airline: 'Premium Air',
        departure: searchParams.departure || 'New York',
        arrival: searchParams.arrival || 'Paris',
        departureTime: '23:10',
        arrivalTime: '12:25+1',
        duration: '7h 15m',
        stops: 0,
        price: 899,
        type: 'Business'
      }
    ];
    return flights;
  },

  async searchHotels(searchParams) {
    await delay(500);
    // Mock hotel search results
    const hotels = [
      {
        Id: 1,
        name: 'Grand Palace Hotel',
        location: searchParams.location || 'Paris',
        rating: 4.8,
        reviews: 1247,
        price: 189,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
      },
      {
        Id: 2,
        name: 'Boutique Central',
        location: searchParams.location || 'Paris',
        rating: 4.5,
        reviews: 892,
        price: 149,
        amenities: ['WiFi', 'Breakfast', 'Gym'],
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
      },
      {
        Id: 3,
        name: 'Luxury Suites',
        location: searchParams.location || 'Paris',
        rating: 4.9,
        reviews: 634,
        price: 289,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Concierge'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
      }
    ];
    return hotels;
  }
};

export default destinationService;