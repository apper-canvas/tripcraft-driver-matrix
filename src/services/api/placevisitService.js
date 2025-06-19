import { toast } from 'react-toastify';

const placevisitService = {
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
          { field: { Name: "Owner" } },
          { field: { Name: "destination" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "trip_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('placevisit', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching place visits:", error);
      toast.error("Failed to load place visits");
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
          { field: { Name: "Owner" } },
          { field: { Name: "destination" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "trip_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('placevisit', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Place visit not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching place visit with ID ${Id}:`, error);
      throw error;
    }
  },

  async create(placevisitData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: placevisitData.Name || placevisitData.name,
        Tags: placevisitData.Tags || '',
        Owner: placevisitData.Owner,
        destination: placevisitData.destination,
        date: placevisitData.date,
        notes: placevisitData.notes || '',
        trip_id: placevisitData.trip_id ? parseInt(placevisitData.trip_id, 10) : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('placevisit', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create place visit');
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
          throw new Error('Failed to create place visit');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Place visit created successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('Failed to create place visit');
    } catch (error) {
      console.error("Error creating place visit:", error);
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
        ...(data.Owner !== undefined && { Owner: data.Owner }),
        ...(data.destination !== undefined && { destination: data.destination }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.trip_id !== undefined && { trip_id: data.trip_id ? parseInt(data.trip_id, 10) : null })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('placevisit', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update place visit');
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
          throw new Error('Failed to update place visit');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Place visit updated successfully');
          return successfulRecord.data;
        }
      }

      throw new Error('Failed to update place visit');
    } catch (error) {
      console.error("Error updating place visit:", error);
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

      const response = await apperClient.deleteRecord('placevisit', params);
      
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

        toast.success('Place visit deleted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting place visit:", error);
      throw error;
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "destination" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "trip_id" },
            referenceField: { field: { Name: "Name" } }
          }
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

      const response = await apperClient.fetchRecords('placevisit', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching place visits for trip ${tripId}:`, error);
      toast.error("Failed to load place visits for trip");
      return [];
    }
  }
};

export default placevisitService;