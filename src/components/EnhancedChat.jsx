import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { callGPTAPI, generateTopicsAndSummary } from '../utils/apiUtils';
import ChatHistory from './ChatHistory';
import TabSection from './TabSection';
import MobileTabs from './MobileTabs';

const ChatInput = lazy(() => import('./ChatInput'));

export default function EnhancedChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          <div className={`flex-1 ${activeTab === 'chat' ? 'block' : 'hidden lg:block'} lg:max-w-[60%]`}>
            <ChatHistory messages={messages} />
          </div>
          <div className={`lg:w-[40%] ${activeTab !== 'chat' ? 'block' : 'hidden lg:block'}`}>
            <TabSection
              headline={chatData?.headline}
              summary={chatData?.summary}
              mainTopics={chatData?.mainTopics}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="p-4 bg-gray-800">
        <Suspense fallback={<div>Loading...</div>}>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
            error={sendMessageMutation.error ? sendMessageMutation.error.message : null}
          />
        </Suspense>
      </div>
    </div>
  );
}