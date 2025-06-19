import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { expenseService, tripService } from '@/services';

const Budget = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId') || '1'; // Default to trip 1 for demo
  
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
    { key: 'flights', label: 'Flights', icon: 'Plane', color: '#2C5F2D' },
    { key: 'accommodation', label: 'Accommodation', icon: 'Building', color: '#97BC62' },
    { key: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#FF6B35' },
    { key: 'transport', label: 'Transportation', icon: 'Car', color: '#3B82F6' },
    { key: 'activities', label: 'Activities', icon: 'Camera', color: '#8B5CF6' },
    { key: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#EC4899' },
    { key: 'other', label: 'Other', icon: 'Package', color: '#6B7280' }
  ];

  useEffect(() => {
    loadBudgetData();
  }, [tripId]);

  const loadBudgetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripData, expenseData] = await Promise.all([
        tripService.getById(parseInt(tripId, 10)),
        expenseService.getByTripId(parseInt(tripId, 10))
      ]);
      setTrip(tripData);
      setExpenses(expenseData);
    } catch (err) {
      setError(err.message || 'Failed to load budget data');
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const expenseData = {
        ...newExpense,
        tripId: parseInt(tripId, 10),
        amount: parseFloat(newExpense.amount),
        currency: 'USD'
      };
      const createdExpense = await expenseService.create(expenseData);
      setExpenses([...expenses, createdExpense]);
      setNewExpense({
        category: 'food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      toast.success('Expense added successfully');
    } catch (err) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseService.delete(expenseId);
      setExpenses(expenses.filter(expense => expense.Id !== expenseId));
      toast.success('Expense deleted successfully');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const getBudgetStats = () => {
    if (!trip) return { spent: 0, remaining: 0, percentage: 0 };
    
    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = trip.budget - spent;
    const percentage = (spent / trip.budget) * 100;
    
    return { spent, remaining, percentage };
  };

  const getCategoryBreakdown = () => {
    const breakdown = expenseCategories.map(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.key);
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        ...category,
        amount: total,
        count: categoryExpenses.length
      };
    }).filter(category => category.amount > 0);
    
    return breakdown;
  };

  const getChartData = () => {
    const breakdown = getCategoryBreakdown();
    return {
      series: breakdown.map(cat => cat.amount),
      options: {
        chart: {
          type: 'donut',
        },
        labels: breakdown.map(cat => cat.label),
        colors: breakdown.map(cat => cat.color),
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Spent',
                  formatter: () => `$${getBudgetStats().spent.toLocaleString()}`
                }
              }
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonLoader count={3} type="list" />
          </div>
          <div>
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={error} onRetry={loadBudgetData} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          icon="DollarSign"
          title="Trip not found"
          description="The requested trip could not be found"
        />
      </div>
    );
  }

  const budgetStats = getBudgetStats();
  const categoryBreakdown = getCategoryBreakdown();
  const chartData = getChartData();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Budget Tracker
          </h1>
          <p className="text-gray-600">
            {trip.destination} - Track your spending and stay on budget
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" icon="Plus">
          Add Expense
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-primary">
                  ${trip.budget.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <ApperIcon name="Target" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spent</p>
                <p className="text-2xl font-bold text-accent">
                  ${budgetStats.spent.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budgetStats.percentage > 90 ? 'bg-red-500' : 
                        budgetStats.percentage > 70 ? 'bg-yellow-500' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {budgetStats.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${
                  budgetStats.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(budgetStats.remaining).toLocaleString()}
                </p>
                {budgetStats.remaining < 0 && (
                  <Badge variant="error" size="sm" className="mt-1">
                    Over Budget
                  </Badge>
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                budgetStats.remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <ApperIcon 
                  name={budgetStats.remaining >= 0 ? 'PiggyBank' : 'AlertTriangle'} 
                  className={`w-6 h-6 ${
                    budgetStats.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} 
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold">Recent Expenses</h3>
              <Badge variant="secondary">{expenses.length} items</Badge>
            </div>

            {expenses.length === 0 ? (
              <EmptyState
                icon="Receipt"
                title="No expenses recorded"
                description="Start tracking your spending by adding your first expense"
                actionLabel="Add Expense"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <div className="space-y-3">
                {expenses.slice().reverse().map((expense, index) => (
                  <motion.div
                    key={expense.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        expenseCategories.find(cat => cat.key === expense.category)?.color ? 
                        'bg-opacity-20' : 'bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: `${expenseCategories.find(cat => cat.key === expense.category)?.color}20`
                      }}>
                        <ApperIcon
                          name={expenseCategories.find(cat => cat.key === expense.category)?.icon || 'Package'}
                          className="w-5 h-5"
                          style={{
                            color: expenseCategories.find(cat => cat.key === expense.category)?.color || '#6B7280'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {expenseCategories.find(cat => cat.key === expense.category)?.label} • {format(new Date(expense.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteExpense(expense.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Budget Breakdown */}
        <div className="space-y-6">
          {categoryBreakdown.length > 0 && (
            <Card>
              <h3 className="text-lg font-display font-semibold mb-6">Spending Breakdown</h3>
              <div className="mb-6">
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="donut"
                  height={300}
                />
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-display font-semibold mb-4">Categories</h3>
            <div className="space-y-3">
              {categoryBreakdown.map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <ApperIcon
                        name={category.icon}
                        className="w-4 h-4"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.label}</p>
                      <p className="text-xs text-gray-500">{category.count} items</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-display font-semibold mb-4">
                Add New Expense
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  >
                    {expenseCategories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                  icon="DollarSign"
                  required
                />
                
                <Input
                  label="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="What did you spend on?"
                  required
                />
                
                <Input
                  label="Date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddExpense}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Budget;