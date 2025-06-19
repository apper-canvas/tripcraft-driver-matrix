import { toast } from 'react-toastify';

const destinationService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "country" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "best_time_to_visit" } },
          { field: { Name: "currency1" } },
          { field: { Name: "language" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('destination', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(dest => ({
        ...dest,
        bestTimeToVisit: dest.best_time_to_visit,
        currency: dest.currency1,
        name: dest.Name
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Failed to load destinations");
      return [];
    }
  },

  async getById(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "country" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "best_time_to_visit" } },
          { field: { Name: "currency1" } },
          { field: { Name: "language" } }
        ]
      };

      const response = await apperClient.getRecordById('destination', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Destination not found');
      }

      // Map database field names to UI expected format
      const mappedData = {
        ...response.data,
        bestTimeToVisit: response.data.best_time_to_visit,
        currency: response.data.currency1,
        name: response.data.Name
      };

      return mappedData;
    } catch (error) {
      console.error(`Error fetching destination with ID ${Id}:`, error);
      throw error;
    }
  },

  async searchFlights(searchParams) {
    // Mock flight search results - keeping for compatibility
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(500);
    
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
    // Mock hotel search results - keeping for compatibility
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(500);
    
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