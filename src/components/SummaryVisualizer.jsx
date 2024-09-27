import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OptionSelector from './OptionSelector';

const SummaryVisualizer = ({ summary, keyPoints, hallucinationCheckResult, onOptionSelect }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item, type) => {
    setSelectedItem({ content: item, type });
  };

  const renderHallucinationStatus = (status, explanation) => (
    <span className={`ml-2 ${status === '✅' ? 'text-green-500' : 'text-red-500'}`}>
      {status}
      {status === '❌' && (
        <span className="text-xs ml-2 text-red-300">{explanation}</span>
      )}
    </span>
  );

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
          {hallucinationCheckResult && renderHallucinationStatus(
            hallucinationCheckResult.summary.status,
            hallucinationCheckResult.summary.explanation
          )}
        </h2>
        <p 
          className="text-gray-300 leading-relaxed cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => handleItemClick(summary, 'summary')}
        >
          {summary}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-purple-300">重要ポイント</h3>
        {keyPoints && keyPoints.length > 0 ? (
          <div className="space-y-4">
            {keyPoints.map((point, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                onClick={() => handleItemClick(point, 'keyPoint')}
              >
                <h4 className="text-lg font-medium text-pink-400 mb-1">
                  {point.title}
                  {hallucinationCheckResult && renderHallucinationStatus(
                    hallucinationCheckResult.keyPoints[index].status,
                    hallucinationCheckResult.keyPoints[index].explanation
                  )}
                </h4>
                <p className="text-sm text-gray-300">{point.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">重要ポイントが見つかりませんでした。</p>
        )}
      </motion.div>

      {selectedItem && (
        <OptionSelector 
          item={selectedItem} 
          onOptionSelect={onOptionSelect}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </motion.div>
  );
};

export default SummaryVisualizer;