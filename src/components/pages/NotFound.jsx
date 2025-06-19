import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full">
            <ApperIcon name="Compass" className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-display font-semibold text-gray-700 mb-4">
          Lost in Transit
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page took a wrong turn and ended up in the middle of nowhere. 
          Let's get you back on track to your next adventure!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            icon="Home"
          >
            Go Home
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-400">
            Need help? Contact our travel support team
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;