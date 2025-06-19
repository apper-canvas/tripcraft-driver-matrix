import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SearchFilters from '@/components/molecules/SearchFilters';
import SearchResults from '@/components/organisms/SearchResults';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { destinationService } from '@/services';

const Search = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (activeTab === 'flights' && (!searchParams.departure || !searchParams.arrival)) {
      toast.error('Please enter departure and arrival locations');
      return;
    }
    
    if (activeTab === 'hotels' && !searchParams.location) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      let searchResults;
      if (activeTab === 'flights') {
        searchResults = await destinationService.searchFlights(searchParams);
      } else {
        searchResults = await destinationService.searchHotels(searchParams);
      }
      setResults(searchResults);
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (item) => {
    toast.success(`${activeTab === 'flights' ? 'Flight' : 'Hotel'} booking initiated!`);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderFlightSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Input
        label="From"
        value={searchParams.departure}
        onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
        placeholder="Departure city"
        icon="MapPin"
      />
      <Input
        label="To"
        value={searchParams.arrival}
        onChange={(e) => setSearchParams({ ...searchParams, arrival: e.target.value })}
        placeholder="Arrival city"
        icon="MapPin"
      />
      <Input
        label="Departure Date"
        type="date"
        value={searchParams.departureDate}
        onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
        icon="Calendar"
      />
      <Input
        label="Return Date"
        type="date"
        value={searchParams.returnDate}
        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
        icon="Calendar"
      />
      <div className="flex items-end">
        <Button onClick={handleSearch} variant="primary" className="w-full" icon="Search">
          Search Flights
        </Button>
      </div>
    </div>
  );

  const renderHotelSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Input
        label="Location"
        value={searchParams.location}
        onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
        placeholder="City or hotel name"
        icon="MapPin"
      />
      <Input
        label="Check-in Date"
        type="date"
        value={searchParams.checkIn}
        onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
        icon="Calendar"
      />
      <Input
        label="Check-out Date"
        type="date"
        value={searchParams.checkOut}
        onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
        icon="Calendar"
      />
      <div className="flex items-end">
        <Button onClick={handleSearch} variant="primary" className="w-full" icon="Search">
          Search Hotels
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Search & Book
        </h1>
        <p className="text-gray-600">
          Find the best flights and hotels for your next adventure
        </p>
      </div>

      {/* Search Tabs */}
      <div className="flex items-center space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'flights', label: 'Flights', icon: 'Plane' },
          { key: 'hotels', label: 'Hotels', icon: 'Building' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Form */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-card border border-surface-200 p-6 mb-6"
      >
        {activeTab === 'flights' ? renderFlightSearch() : renderHotelSearch()}
      </motion.div>

      {/* Filters */}
      {hasSearched && (
        <div className="mb-6">
          <SearchFilters
            type={activeTab}
            filters={filters}
            onFiltersChange={setFilters}
            onClear={clearFilters}
          />
        </div>
      )}

      {/* Results */}
      <div>
        {loading && (
          <SkeletonLoader count={5} type="list" />
        )}

        {error && (
          <ErrorState message={error} onRetry={handleSearch} />
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <EmptyState
            icon="Search"
            title="No results found"
            description={`No ${activeTab} found matching your search criteria. Try adjusting your search parameters.`}
            actionLabel="Modify Search"
            onAction={() => setHasSearched(false)}
          />
        )}

        {!loading && !error && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {results.length} {activeTab} found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Sort by price</span>
              </div>
            </div>
            <SearchResults
              results={results}
              type={activeTab}
              onBook={handleBooking}
            />
          </div>
        )}

        {!hasSearched && (
          <EmptyState
            icon={activeTab === 'flights' ? 'Plane' : 'Building'}
            title={`Search ${activeTab === 'flights' ? 'Flights' : 'Hotels'}`}
            description={`Enter your ${activeTab === 'flights' ? 'departure and arrival locations' : 'destination'} to find the best options`}
          />
        )}
      </div>
    </div>
  );
};

export default Search;