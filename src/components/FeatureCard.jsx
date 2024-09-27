import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg flex flex-col items-center text-center"
    >
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;