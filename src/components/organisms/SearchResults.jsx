import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const SearchResults = ({ results, type, onBook }) => {
  const renderFlightResult = (flight) => (
    <Card key={flight.Id} className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-lg">{flight.airline}</div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">${flight.price}</div>
              <div className="text-sm text-gray-500">{flight.type}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mb-3">
            <div className="text-center">
              <div className="font-semibold">{flight.departureTime}</div>
              <div className="text-sm text-gray-500">{flight.departure}</div>
            </div>
            
            <div className="flex-1 relative">
              <div className="border-t-2 border-gray-200"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <ApperIcon name="Plane" className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-semibold">{flight.arrivalTime}</div>
              <div className="text-sm text-gray-500">{flight.arrival}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{flight.duration}</span>
              <span>
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </span>
            </div>
            <Button onClick={() => onBook(flight)} variant="primary">
              Book Flight
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderHotelResult = (hotel) => (
    <Card key={hotel.Id} className="mb-4">
      <div className="flex space-x-4">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <p className="text-gray-600">{hotel.location}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      className={`w-4 h-4 ${
                        i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {hotel.rating} ({hotel.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">${hotel.price}</div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" size="sm">
                {amenity}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-primary hover:text-primary-600 text-sm font-medium">
                View Details
              </button>
              <button className="text-primary hover:text-primary-600 text-sm font-medium">
                Reviews
              </button>
            </div>
            <Button onClick={() => onBook(hotel)} variant="primary">
              Book Hotel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {results.map((result) => (
        <motion.div key={result.Id} variants={itemVariants}>
          {type === 'flights' ? renderFlightResult(result) : renderHotelResult(result)}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SearchResults;