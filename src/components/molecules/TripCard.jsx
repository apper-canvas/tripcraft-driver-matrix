import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TripCard = ({ trip, onView, onEdit, onDelete }) => {
const startDate = trip?.start_date ? new Date(trip.start_date) : null;
  const endDate = trip?.end_date ? new Date(trip.end_date) : null;
  const duration = startDate && endDate && !isNaN(startDate) && !isNaN(endDate) ? 
    differenceInDays(endDate, startDate) : 0;
  const budgetProgress = (trip?.spent || 0) / (trip?.budget || 1) * 100;
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'upcoming': return 'accent';
      case 'planning': return 'warning';
      default: return 'default';
    }
  };

const getDaysUntil = () => {
    if (!startDate || isNaN(startDate)) return 'Date TBD';
    const today = new Date();
    const daysUntil = differenceInDays(startDate, today);
    if (daysUntil > 0) return `${daysUntil} days until departure`;
    if (daysUntil === 0) return 'Departing today!';
    return 'Trip in progress';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="overflow-hidden">
        <div className="relative h-48 mb-4 -m-6 mb-4">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant={getStatusColor(trip.status)} className="capitalize">
              {trip.status}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-display font-bold text-xl mb-1">{trip.destination}</h3>
<p className="text-sm opacity-90">
              {startDate && endDate && !isNaN(startDate) && !isNaN(endDate) 
                ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
                : 'Date TBD'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>{duration} days</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Users" className="w-4 h-4" />
                <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
              </div>
            </div>
            {trip.status === 'upcoming' && (
              <span className="text-accent font-medium">
                {getDaysUntil()}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Budget Progress</span>
              <span className="text-sm text-gray-600">
                ${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-yellow-500' : 'bg-secondary'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">{trip.description}</p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Button variant="ghost" size="sm" onClick={() => onView(trip.Id)}>
              View Details
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon="Edit"
                onClick={() => onEdit(trip.Id)}
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={() => onDelete(trip.Id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TripCard;