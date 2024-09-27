import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const OptionSelector = ({ item, onOptionSelect, onClose }) => {
  const options = [
    { text: 'もっと詳しく説明して', action: 'explain' },
    { text: '関連する例を挙げて', action: 'example' },
    { text: 'この点について質問がある', action: 'question' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-300">オプションを選択</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-4">{item.content.title || '選択された項目'}</p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <Button
              key={index}
              className="w-full text-left justify-start p-2 bg-gray-700 hover:bg-indigo-600 rounded text-white"
              onClick={() => onOptionSelect(item, option.action)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OptionSelector;