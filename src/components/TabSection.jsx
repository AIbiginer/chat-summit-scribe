import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

const TabSection = ({ headline, summary, mainTopics, isLoading, error }) => {
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  );
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CollapsibleSection title="会話の要約">
          <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {headline || '会話の見出し'}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {summary || '会話の要約がここに表示されます。'}
          </p>
        </CollapsibleSection>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CollapsibleSection title="主要な話題">
          {mainTopics && mainTopics.length > 0 ? (
            <div className="space-y-4">
              {mainTopics.map((topic, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md">
                  <h4 className="text-lg font-medium text-pink-400 mb-1">{topic.topic}</h4>
                  <p className="text-sm text-gray-300">{topic.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">トピックデータが利用できません。</p>
          )}
        </CollapsibleSection>
      </motion.div>
    </div>
  );
};

export default TabSection;