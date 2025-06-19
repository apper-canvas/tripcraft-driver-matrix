import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { itineraryService, tripService } from '@/services';

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId') || '1'; // Default to trip 1 for demo
  
  const [trip, setTrip] = useState(null);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    time: '',
    activity: '',
    location: '',
    notes: '',
    type: 'sightseeing'
  });

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    setLoading(true);
    setError(null);
    try {
const [tripData, itineraryData] = await Promise.all([
        tripService.getById(parseInt(tripId, 10)),
        itineraryService.getByTripId(parseInt(tripId, 10))
      ]);
      setTrip(tripData);
      setItineraryItems(itineraryData);
    } catch (err) {
      setError(err.message || 'Failed to load itinerary');
      toast.error('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.time || !newItem.activity) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
const itemData = {
        ...newItem,
        tripId: parseInt(tripId, 10),
        day: selectedDay
      };
      const createdItem = await itineraryService.create(itemData);
      setItineraryItems([...itineraryItems, createdItem]);
      setNewItem({ time: '', activity: '', location: '', notes: '', type: 'sightseeing' });
      setShowAddModal(false);
      toast.success('Activity added to itinerary');
    } catch (err) {
      toast.error('Failed to add activity');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Remove this activity from your itinerary?')) return;
    
    try {
      await itineraryService.delete(itemId);
      setItineraryItems(itineraryItems.filter(item => item.Id !== itemId));
      toast.success('Activity removed from itinerary');
    } catch (err) {
      toast.error('Failed to remove activity');
    }
  };

  const getItemsByDay = (day) => {
    return itineraryItems.filter(item => item.day === day);
  };

  const getTripDays = () => {
    if (!trip) return [];
const start = parseISO(trip.start_date);
    const end = parseISO(trip.end_date);
    const days = [];
    let current = start;
    let dayNumber = 1;
    
    while (current <= end) {
      days.push({
        number: dayNumber,
        date: current,
        label: format(current, 'EEE, MMM d')
      });
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
      dayNumber++;
    }
    return days;
  };

  const getActivityTypeIcon = (type) => {
    const iconMap = {
      transport: 'Car',
      sightseeing: 'Camera',
      dining: 'Utensils',
      culture: 'Building2',
      shopping: 'ShoppingBag',
      entertainment: 'Music',
      outdoor: 'Mountain'
    };
    return iconMap[type] || 'MapPin';
  };

  const getActivityTypeColor = (type) => {
    const colorMap = {
      transport: 'bg-blue-100 text-blue-700',
      sightseeing: 'bg-green-100 text-green-700',
      dining: 'bg-orange-100 text-orange-700',
      culture: 'bg-purple-100 text-purple-700',
      shopping: 'bg-pink-100 text-pink-700',
      entertainment: 'bg-yellow-100 text-yellow-700',
      outdoor: 'bg-emerald-100 text-emerald-700'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-3">
            <SkeletonLoader count={4} type="list" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={error} onRetry={loadTripData} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          icon="Calendar"
          title="Trip not found"
          description="The requested trip could not be found"
        />
      </div>
    );
  }

  const tripDays = getTripDays();
  const currentDayItems = getItemsByDay(selectedDay);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
{trip.destination} Itinerary
        </h1>
        <p className="text-gray-600">
          {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Day Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h3 className="font-display font-semibold text-lg mb-4">Trip Days</h3>
            <div className="space-y-2">
              {tripDays.map((day) => (
                <button
                  key={day.number}
                  onClick={() => setSelectedDay(day.number)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedDay === day.number
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Day {day.number}</div>
                  <div className="text-sm opacity-90">{day.label}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {getItemsByDay(day.number).length} activities
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Itinerary Timeline */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Day {selectedDay} - {tripDays.find(d => d.number === selectedDay)?.label}
            </h2>
            <Button onClick={() => setShowAddModal(true)} variant="primary" icon="Plus">
              Add Activity
            </Button>
          </div>

          {currentDayItems.length === 0 ? (
            <EmptyState
              icon="Calendar"
              title="No activities planned"
              description="Start building your day by adding activities, meals, and experiences"
              actionLabel="Add First Activity"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            <div className="space-y-4">
              {currentDayItems.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  {index < currentDayItems.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200" />
                  )}
                  
                  <Card className="relative">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getActivityTypeColor(item.type)}`}>
                        <ApperIcon name={getActivityTypeIcon(item.type)} className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {item.activity}
                            </h3>
                            {item.location && (
                              <p className="text-gray-600 flex items-center mt-1">
                                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                                {item.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-sm font-medium">
                              {item.time}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Trash2"
                              onClick={() => handleDeleteItem(item.Id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            />
                          </div>
                        </div>
                        
                        {item.notes && (
                          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
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
                  Add Activity to Day {selectedDay}
                </h3>
                
                <div className="space-y-4">
                  <Input
                    label="Time"
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    required
                  />
                  
                  <Input
                    label="Activity"
                    value={newItem.activity}
                    onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                    placeholder="What are you doing?"
                    required
                  />
                  
                  <Input
                    label="Location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="Where is this happening?"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="dining">Dining</option>
                      <option value="transport">Transport</option>
                      <option value="culture">Culture</option>
                      <option value="shopping">Shopping</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="outdoor">Outdoor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newItem.notes}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      placeholder="Any additional details..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
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
                    onClick={handleAddItem}
                  >
                    Add Activity
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Itinerary;