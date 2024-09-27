import React from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';

const ChatHistory = ({ messages }) => {
  return (
    <div className="flex-1 p-4 space-y-4 bg-gray-900 rounded-lg overflow-y-auto max-h-[50vh]">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ChatMessage message={message} />
        </motion.div>
      ))}
    </div>
  );
};

export default ChatHistory;