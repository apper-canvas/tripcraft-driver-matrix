import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  const baseClasses = `bg-white rounded-lg border border-surface-200 transition-all duration-200 ${padding}`;
  const cardClasses = `${baseClasses} ${hover ? 'hover:shadow-lift cursor-pointer' : 'shadow-card'} ${className}`;

  const cardContent = (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default Card;