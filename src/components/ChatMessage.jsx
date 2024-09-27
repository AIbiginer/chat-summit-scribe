import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : isSystem
            ? 'bg-red-900 text-white'
            : 'bg-gray-800 text-white'
        } shadow-lg`}
      >
        <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;