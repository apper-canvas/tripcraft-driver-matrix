import { toast } from 'react-toastify';

const tripService = {
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
          { field: { Name: "Tags" } },
          { field: { Name: "destination" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "travelers" } }
        ],
        orderBy: [
          { fieldName: "start_date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('trip', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips");
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
          { field: { Name: "Tags" } },
          { field: { Name: "destination" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "travelers" } }
        ]
      };

      const response = await apperClient.getRecordById('trip', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Trip not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching trip with ID ${Id}:`, error);
      throw error;
    }
  },

  async create(tripData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: tripData.Name || tripData.name,
        Tags: tripData.Tags || '',
        destination: tripData.destination,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        budget: parseInt(tripData.budget, 10),
        spent: parseInt(tripData.spent || 0, 10),
        status: tripData.status || 'planning',
        image: tripData.image || '',
        description: tripData.description || '',
        travelers: parseInt(tripData.travelers || 1, 10)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('trip', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create trip');
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
          throw new Error('Failed to create trip');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Trip created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('Failed to create trip');
    } catch (error) {
      console.error("Error creating trip:", error);
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
        ...(data.Tags !== undefined && { Tags: data.Tags }),
        ...(data.destination !== undefined && { destination: data.destination }),
        ...(data.start_date !== undefined && { start_date: data.start_date }),
        ...(data.end_date !== undefined && { end_date: data.end_date }),
        ...(data.budget !== undefined && { budget: parseInt(data.budget, 10) }),
        ...(data.spent !== undefined && { spent: parseInt(data.spent, 10) }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.travelers !== undefined && { travelers: parseInt(data.travelers, 10) })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('trip', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update trip');
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
          throw new Error('Failed to update trip');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Trip updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('Failed to update trip');
    } catch (error) {
      console.error("Error updating trip:", error);
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

      const response = await apperClient.deleteRecord('trip', params);
      
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

        toast.success('Trip deleted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  }
};

export default tripService;