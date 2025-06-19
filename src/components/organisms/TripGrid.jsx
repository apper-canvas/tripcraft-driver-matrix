import { motion } from 'framer-motion';
import TripCard from '@/components/molecules/TripCard';

const TripGrid = ({ trips, onViewTrip, onEditTrip, onDeleteTrip }) => {
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {trips.map((trip) => (
        <motion.div key={trip.Id} variants={itemVariants}>
          <TripCard
            trip={trip}
            onView={onViewTrip}
            onEdit={onEditTrip}
            onDelete={onDeleteTrip}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TripGrid;