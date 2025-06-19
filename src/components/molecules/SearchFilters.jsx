import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const SearchFilters = ({ type, filters, onFiltersChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  };

  const renderFlightFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
        <Input
          type="number"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          placeholder="$1000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
        <select
          value={filters.stops || ''}
          onChange={(e) => handleFilterChange('stops', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Any</option>
          <option value="0">Non-stop</option>
          <option value="1">1 stop</option>
          <option value="2+">2+ stops</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
        <select
          value={filters.departureTime || ''}
          onChange={(e) => handleFilterChange('departureTime', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Any time</option>
          <option value="morning">Morning (6AM - 12PM)</option>
          <option value="afternoon">Afternoon (12PM - 6PM)</option>
          <option value="evening">Evening (6PM - 12AM)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
        <Input
          value={filters.airline || ''}
          onChange={(e) => handleFilterChange('airline', e.target.value)}
          placeholder="Any airline"
        />
      </div>
    </div>
  );

  const renderHotelFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price per Night</label>
        <Input
          type="number"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          placeholder="$200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
        <select
          value={filters.starRating || ''}
          onChange={(e) => handleFilterChange('starRating', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Any rating</option>
          <option value="5">5 stars</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="space-y-2">
          {['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'].map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={(e) => {
                  const currentAmenities = filters.amenities || [];
                  const newAmenities = e.target.checked
                    ? [...currentAmenities, amenity]
                    : currentAmenities.filter(a => a !== amenity);
                  handleFilterChange('amenities', newAmenities);
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-600">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guest Rating</label>
        <select
          value={filters.guestRating || ''}
          onChange={(e) => handleFilterChange('guestRating', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Any rating</option>
          <option value="9">9.0+</option>
          <option value="8">8.0+</option>
          <option value="7">7.0+</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-card border border-surface-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
          <span>Filters</span>
          {getFilterCount() > 0 && (
            <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
              {getFilterCount()}
            </span>
          )}
          <ApperIcon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            className="w-4 h-4" 
          />
        </Button>
        
        {getFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200">
              {type === 'flights' ? renderFlightFilters() : renderHotelFilters()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;