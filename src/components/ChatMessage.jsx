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
        className={`max-w-[70%] p-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white'
            : isSystem
            ? 'bg-red-600 text-white'
            : 'bg-purple-800 text-white'
        } shadow-md`}
      >
        <p className="text-sm md:text-base">{message.text}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;