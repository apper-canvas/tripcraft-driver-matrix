import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { destinationService } from '@/services';

const Guides = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await destinationService.getAll();
      setDestinations(result);
    } catch (err) {
      setError(err.message || 'Failed to load destinations');
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
  };

const filteredDestinations = destinations.filter(dest =>
    (dest.name || dest.Name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dest.country || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDestinationGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDestinations.map((destination, index) => (
        <motion.div
          key={destination.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            hover 
            className="overflow-hidden cursor-pointer"
            onClick={() => handleDestinationSelect(destination)}
          >
            <div className="relative h-48 mb-4 -m-6 mb-4">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-display font-bold text-xl mb-1">
                  {destination.name}
                </h3>
                <p className="text-sm opacity-90">{destination.country}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-2">
                {destination.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
<ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>{destination.bestTimeToVisit || destination.best_time_to_visit}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{destination.attractions?.length || 0} attractions</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" size="sm">
{destination.currency || destination.currency1}
                  </Badge>
                  <Badge variant="primary" size="sm">
{destination.language}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" icon="ArrowRight">
                  Explore
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderDestinationDetail = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => setSelectedDestination(null)}
        >
          Back to Destinations
        </Button>
        <Button variant="primary" icon="Plus">
          Add to Trip
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <img
          src={selectedDestination.image}
          alt={selectedDestination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-display font-bold mb-2">
            {selectedDestination.name}
          </h1>
          <p className="text-xl opacity-90">{selectedDestination.country}</p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <ApperIcon name="Calendar" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Best Time</h3>
          <p className="text-sm text-gray-600">{selectedDestination.bestTimeToVisit}</p>
        </Card>
        <Card className="text-center">
          <ApperIcon name="DollarSign" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Currency</h3>
          <p className="text-sm text-gray-600">{selectedDestination.currency}</p>
        </Card>
        <Card className="text-center">
          <ApperIcon name="MessageSquare" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Language</h3>
          <p className="text-sm text-gray-600">{selectedDestination.language}</p>
        </Card>
        <Card className="text-center">
          <ApperIcon name="MapPin" className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Attractions</h3>
          <p className="text-sm text-gray-600">{selectedDestination.attractions?.length || 0} places</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attractions */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Top Attractions
          </h2>
          <div className="space-y-4">
            {selectedDestination.attractions?.map((attraction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {attraction.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {attraction.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <ApperIcon
                                key={i}
                                name="Star"
                                className={`w-4 h-4 ${
                                  i < Math.floor(attraction.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {attraction.rating}
                          </span>
                        </div>
                        <Badge variant="accent" size="sm">
                          {attraction.price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Local Cuisine
          </h2>
          <div className="space-y-4">
            {selectedDestination.restaurants?.map((restaurant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {restaurant.cuisine} cuisine
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <ApperIcon
                                key={i}
                                name="Star"
                                className={`w-4 h-4 ${
                                  i < Math.floor(restaurant.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {restaurant.rating}
                          </span>
                        </div>
                        <Badge variant="secondary" size="sm">
                          {restaurant.priceRange}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <Card className="mt-8">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          About {selectedDestination.name}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {selectedDestination.description}
        </p>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <SkeletonLoader count={6} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={error} onRetry={loadDestinations} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {selectedDestination ? (
        renderDestinationDetail()
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Destination Guides
            </h1>
            <p className="text-gray-600">
              Discover amazing destinations with insider tips and recommendations
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              icon="Search"
              className="max-w-md"
            />
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length === 0 ? (
            <EmptyState
              icon="Search"
              title="No destinations found"
              description={
                searchQuery 
                  ? `No destinations match "${searchQuery}". Try a different search term.`
                  : "No destination guides available at the moment."
              }
            />
          ) : (
            renderDestinationGrid()
          )}
        </>
      )}
    </div>
  );
};

export default Guides;