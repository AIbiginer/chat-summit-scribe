import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { callGPTAPI, generateTopicsAndSummary } from '../utils/apiUtils';
import ChatHistory from './ChatHistory';
import CollapsibleSection from './CollapsibleSection';
import TabSection from './TabSection';

const ChatInput = lazy(() => import('./ChatInput'));

export default function EnhancedChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const queryClient = useQueryClient();

  const { data: chatData, isLoading, error, refetch } = useQuery({
    queryKey: ['chatData', messages],
    queryFn: () => generateTopicsAndSummary(messages),
    enabled: messages.length > 0,
    staleTime: 30000,
    cacheTime: 300000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (newMessage) => callGPTAPI(newMessage),
    onSuccess: (aiResponse) => {
      const aiMessage = { id: Date.now(), text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
      refetch();
    },
  });

  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      sendMessageMutation.mutate(inputText);
    }
  }, [inputText, sendMessageMutation]);

  const handleRefresh = useCallback(() => {
    setMessages([]);
    queryClient.invalidateQueries(['chatData']);
  }, [queryClient]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col lg:flex-row h-screen bg-gradient-to-br from-gray-900 to-black text-white ${isFullscreen ? 'w-screen' : 'w-full lg:w-[1024px] mx-auto my-8 rounded-lg shadow-2xl'}`}
    >
      <div className="flex-1 flex flex-col lg:max-w-[60%]">
        <motion.header 
          className="bg-gray-800 p-4 lg:p-6 flex justify-between items-center rounded-t-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AI チャット</h1>
          <div className="flex space-x-2 lg:space-x-3">
            <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
              {isFullscreen ? <Minimize2 className="h-4 w-4 lg:h-5 lg:w-5" /> : <Maximize2 className="h-4 w-4 lg:h-5 lg:w-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
              <RefreshCw className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </div>
        </motion.header>

        <ChatHistory messages={messages} />

        <Suspense fallback={<div>Loading...</div>}>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
            error={sendMessageMutation.error ? sendMessageMutation.error.message : null}
          />
        </Suspense>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-[40%] bg-gray-800 p-4 lg:p-6 flex flex-col space-y-4 lg:space-y-6 rounded-b-lg lg:rounded-r-lg overflow-y-auto"
      >
        <TabSection
          headline={chatData?.headline}
          summary={chatData?.summary}
          mainTopics={chatData?.mainTopics}
          isLoading={isLoading}
          error={error}
        />
      </motion.div>
    </motion.div>
  );
}