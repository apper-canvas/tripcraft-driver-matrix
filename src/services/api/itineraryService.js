import itineraryData from '@/services/mockData/itinerary.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let itineraryItems = [...itineraryData];

const itineraryService = {
  async getAll() {
    await delay(300);
    return [...itineraryItems];
  },

  async getByTripId(tripId) {
    await delay(200);
    return itineraryItems
      .filter(item => item.tripId === parseInt(tripId, 10))
      .sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.time.localeCompare(b.time);
      });
  },

  async getById(Id) {
    await delay(200);
    const item = itineraryItems.find(i => i.Id === parseInt(Id, 10));
    if (!item) {
      throw new Error('Itinerary item not found');
    }
    return { ...item };
  },

  async create(itemData) {
    await delay(400);
    const maxId = Math.max(...itineraryItems.map(i => i.Id), 0);
    const newItem = {
      Id: maxId + 1,
      ...itemData,
      createdAt: new Date().toISOString()
    };
    itineraryItems.push(newItem);
    return { ...newItem };
  },

  async update(Id, data) {
    await delay(300);
    const index = itineraryItems.findIndex(i => i.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Itinerary item not found');
    }
    
    const updatedItem = {
      ...itineraryItems[index],
      ...data,
      Id: itineraryItems[index].Id
    };
    itineraryItems[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(Id) {
    await delay(250);
    const index = itineraryItems.findIndex(i => i.Id === parseInt(Id, 10));
    if (index === -1) {
      throw new Error('Itinerary item not found');
    }
    itineraryItems.splice(index, 1);
    return true;
  }
};

export default itineraryService;