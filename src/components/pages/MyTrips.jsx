import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TripGrid from '@/components/organisms/TripGrid';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { tripService } from '@/services';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tripService.getAll();
      setTrips(result);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = (tripId) => {
    navigate(`/itinerary?tripId=${tripId}`);
  };

  const handleEditTrip = (tripId) => {
    toast.info('Edit trip functionality would open a modal or navigate to edit page');
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await tripService.delete(tripId);
      setTrips(trips.filter(trip => trip.Id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (err) {
      toast.error('Failed to delete trip');
    }
  };

  const handleCreateTrip = () => {
    toast.info('Create trip functionality would open a form modal');
  };

const filteredTrips = trips.filter(trip => {
    if (filterStatus === 'all') return true;
    return trip.status === filterStatus;
  });

  const getStatsCards = () => {
const upcoming = trips.filter(t => t.status === 'upcoming').length;
    const planning = trips.filter(t => t.status === 'planning').length;
    const completed = trips.filter(t => t.status === 'completed').length;
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    return [
      { label: 'Upcoming Trips', value: upcoming, icon: 'Calendar', color: 'text-accent' },
      { label: 'Planning', value: planning, icon: 'Clock', color: 'text-yellow-600' },
      { label: 'Completed', value: completed, icon: 'CheckCircle', color: 'text-green-600' },
      { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: 'DollarSign', color: 'text-primary' }
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-card animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
        <SkeletonLoader count={6} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={error} onRetry={loadTrips} />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          icon="MapPin"
          title="No trips yet"
          description="Start planning your next adventure by creating your first trip"
          actionLabel="Create Trip"
          onAction={handleCreateTrip}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            My Trips
          </h1>
          <p className="text-gray-600">
            Manage and track all your travel adventures
          </p>
        </div>
        <Button onClick={handleCreateTrip} variant="primary" icon="Plus">
          Create Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {getStatsCards().map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-card border border-surface-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All Trips' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'planning', label: 'Planning' },
          { key: 'completed', label: 'Completed' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              filterStatus === filter.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <EmptyState
          icon="Filter"
          title="No trips found"
          description={`No trips match the selected filter: ${filterStatus}`}
          actionLabel="View All Trips"
          onAction={() => setFilterStatus('all')}
        />
      ) : (
        <TripGrid
          trips={filteredTrips}
          onViewTrip={handleViewTrip}
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      )}
    </div>
  );
};

export default MyTrips;