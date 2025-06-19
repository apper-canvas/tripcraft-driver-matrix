import { toast } from 'react-toastify';

const itineraryService = {
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
          { field: { Name: "trip_id" } },
          { field: { Name: "day" } },
          { field: { Name: "time" } },
          { field: { Name: "activity" } },
          { field: { Name: "location" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } }
        ],
        orderBy: [
          { fieldName: "day", sorttype: "ASC" },
          { fieldName: "time", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('itinerary', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(item => ({
        ...item,
        tripId: item.trip_id
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching itinerary items:", error);
      toast.error("Failed to load itinerary items");
      return [];
    }
  },

  async getByTripId(tripId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "trip_id" } },
          { field: { Name: "day" } },
          { field: { Name: "time" } },
          { field: { Name: "activity" } },
          { field: { Name: "location" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } }
        ],
        where: [
          {
            FieldName: "trip_id",
            Operator: "EqualTo",
            Values: [parseInt(tripId, 10)]
          }
        ],
        orderBy: [
          { fieldName: "day", sorttype: "ASC" },
          { fieldName: "time", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('itinerary', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(item => ({
        ...item,
        tripId: item.trip_id
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching itinerary items by trip ID:", error);
      toast.error("Failed to load itinerary items");
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
          { field: { Name: "trip_id" } },
          { field: { Name: "day" } },
          { field: { Name: "time" } },
          { field: { Name: "activity" } },
          { field: { Name: "location" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } }
        ]
      };

      const response = await apperClient.getRecordById('itinerary', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Itinerary item not found');
      }

      // Map database field names to UI expected format
      const mappedData = {
        ...response.data,
        tripId: response.data.trip_id
      };

      return mappedData;
    } catch (error) {
      console.error(`Error fetching itinerary item with ID ${Id}:`, error);
      throw error;
    }
  },

  async create(itemData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: itemData.activity || itemData.Name,
        trip_id: parseInt(itemData.tripId || itemData.trip_id, 10),
        day: parseInt(itemData.day, 10),
        time: itemData.time,
        activity: itemData.activity,
        location: itemData.location || '',
        notes: itemData.notes || '',
        type: itemData.type || 'sightseeing'
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('itinerary', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create itinerary item');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create itinerary item');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Itinerary item created successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id
          };
          return mappedData;
        }
      }

      throw new Error('Failed to create itinerary item');
    } catch (error) {
      console.error("Error creating itinerary item:", error);
      throw error;
    }
  },

  async update(Id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(Id, 10),
        ...(data.Name !== undefined && { Name: data.Name }),
        ...(data.tripId !== undefined && { trip_id: parseInt(data.tripId, 10) }),
        ...(data.trip_id !== undefined && { trip_id: parseInt(data.trip_id, 10) }),
        ...(data.day !== undefined && { day: parseInt(data.day, 10) }),
        ...(data.time !== undefined && { time: data.time }),
        ...(data.activity !== undefined && { activity: data.activity }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.type !== undefined && { type: data.type })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('itinerary', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update itinerary item');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update itinerary item');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Itinerary item updated successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id
          };
          return mappedData;
        }
      }

      throw new Error('Failed to update itinerary item');
    } catch (error) {
      console.error("Error updating itinerary item:", error);
      throw error;
    }
  },

  async delete(Id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(Id, 10)]
      };

      const response = await apperClient.deleteRecord('itinerary', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success('Itinerary item deleted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting itinerary item:", error);
      throw error;
    }
  }
};

export default itineraryService;