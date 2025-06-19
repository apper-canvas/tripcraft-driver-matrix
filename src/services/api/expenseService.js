import { toast } from 'react-toastify';

const expenseService = {
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
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "currency1" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(expense => ({
        ...expense,
        tripId: expense.trip_id,
        currency: expense.currency1
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses");
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
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "currency1" } }
        ],
        where: [
          {
            FieldName: "trip_id",
            Operator: "EqualTo",
            Values: [parseInt(tripId, 10)]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database field names to UI expected format
      const mappedData = (response.data || []).map(expense => ({
        ...expense,
        tripId: expense.trip_id,
        currency: expense.currency1
      }));

      return mappedData;
    } catch (error) {
      console.error("Error fetching expenses by trip ID:", error);
      toast.error("Failed to load expenses");
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
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "currency1" } }
        ]
      };

      const response = await apperClient.getRecordById('expense', parseInt(Id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Expense not found');
      }

      // Map database field names to UI expected format
      const mappedData = {
        ...response.data,
        tripId: response.data.trip_id,
        currency: response.data.currency1
      };

      return mappedData;
    } catch (error) {
      console.error(`Error fetching expense with ID ${Id}:`, error);
      throw error;
    }
  },

  async create(expenseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: expenseData.description || expenseData.Name,
        trip_id: parseInt(expenseData.tripId || expenseData.trip_id, 10),
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date,
        currency1: expenseData.currency || expenseData.currency1 || 'USD'
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create expense');
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
          throw new Error('Failed to create expense');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Expense created successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id,
            currency: successfulRecord.data.currency1
          };
          return mappedData;
        }
      }

      throw new Error('Failed to create expense');
    } catch (error) {
      console.error("Error creating expense:", error);
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
        ...(data.category !== undefined && { category: data.category }),
        ...(data.amount !== undefined && { amount: parseFloat(data.amount) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.currency !== undefined && { currency1: data.currency }),
        ...(data.currency1 !== undefined && { currency1: data.currency1 })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update expense');
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
          throw new Error('Failed to update expense');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success('Expense updated successfully');
          // Map database field names to UI expected format
          const mappedData = {
            ...successfulRecord.data,
            tripId: successfulRecord.data.trip_id,
            currency: successfulRecord.data.currency1
          };
          return mappedData;
        }
      }

      throw new Error('Failed to update expense');
    } catch (error) {
      console.error("Error updating expense:", error);
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

      const response = await apperClient.deleteRecord('expense', params);
      
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

        toast.success('Expense deleted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }
};

export default expenseService;