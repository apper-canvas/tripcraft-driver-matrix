import { toast } from 'react-toastify';

const bookingService = {
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
          { field: { Name: "type" } },
          { field: { Name: "provider" } },
          { field: { Name: "price" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "details" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('booking', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(booking => ({
        ...booking,
        tripId: booking.trip_id
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
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
          { field: { Name: "type" } },
          { field: { Name: "provider" } },
          { field: { Name: "price" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "details" } }
        ],
        where: [
          {
            FieldName: "trip_id",
            Operator: "EqualTo",
            Values: [parseInt(tripId, 10)]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('booking', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(booking => ({
        ...booking,
        tripId: booking.trip_id
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching bookings by trip ID:", error);
      toast.error("Failed to load bookings");
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
          { field: { Name: "type" } },
          { field: { Name: "provider" } },
          { field: { Name: "price" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "details" } }
        ]
      };

      const response = await apperClient.getRecordById('booking', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Booking not found');
      }

      // Map database field names to UI expected format
      const mappedData = {
        ...response.data,
        tripId: response.data.trip_id
      };

      return mappedData;
    } catch (error) {
      console.error(`Error fetching booking with ID ${Id}:`, error);
      throw error;
    }
  },

  async create(bookingData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: bookingData.Name || `${bookingData.type} - ${bookingData.provider}`,
        trip_id: parseInt(bookingData.tripId || bookingData.trip_id, 10),
        type: bookingData.type,
        provider: bookingData.provider,
        price: parseFloat(bookingData.price),
        date: bookingData.date,
        status: bookingData.status || 'confirmed',
        details: typeof bookingData.details === 'string' ? bookingData.details : JSON.stringify(bookingData.details || {})
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('booking', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create booking');
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
          throw new Error('Failed to create booking');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Booking created successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id
          };
          return mappedData;
        }
      }

      throw new Error('Failed to create booking');
    } catch (error) {
      console.error("Error creating booking:", error);
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
        ...(data.type !== undefined && { type: data.type }),
        ...(data.provider !== undefined && { provider: data.provider }),
        ...(data.price !== undefined && { price: parseFloat(data.price) }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.details !== undefined && { 
          details: typeof data.details === 'string' ? data.details : JSON.stringify(data.details || {})
        })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('booking', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update booking');
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
          throw new Error('Failed to update booking');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Booking updated successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id
          };
          return mappedData;
        }
      }

      throw new Error('Failed to update booking');
    } catch (error) {
      console.error("Error updating booking:", error);
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

      const response = await apperClient.deleteRecord('booking', params);
      
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

        toast.success('Booking deleted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }
};

export default bookingService;