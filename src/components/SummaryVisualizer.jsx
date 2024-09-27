import React from 'react';
import { motion } from 'framer-motion';

const SummaryVisualizer = ({ summary, mainTopics }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          要約
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {summary}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-purple-300">主要な話題</h3>
        {mainTopics && mainTopics.length > 0 ? (
          <div className="space-y-4">
            {mainTopics.map((topic, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 rounded-lg p-4 shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <h4 className="text-lg font-medium text-pink-400 mb-1">{topic.title}</h4>
                <p className="text-sm text-gray-300">{topic.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">トピックデータが利用できません。</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SummaryVisualizer;