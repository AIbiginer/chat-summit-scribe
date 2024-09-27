import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Trash2, Send, MessageSquare } from 'lucide-react';
import { generateTopicsAndSummary } from '../utils/apiUtils';
import TabSection from './TabSection';
import ChatPanel from './ChatPanel';
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function EnhancedChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const queryClient = useQueryClient();

  const { data: chatData, isLoading, error, refetch } = useQuery({
    queryKey: ['chatData', messages],
    queryFn: () => generateTopicsAndSummary(messages),
    enabled: messages.length > 0,
    staleTime: 30000,
    cacheTime: 300000,
  });

  const updateMutation = useMutation({
    mutationFn: () => generateTopicsAndSummary(messages),
    onSuccess: (data) => {
      queryClient.setQueryData(['chatData', messages], data);
    },
  });

  const handleUpdate = useCallback(() => {
    updateMutation.mutate();
  }, [updateMutation]);

  const handleClear = useCallback(() => {
    setMessages([]);
    queryClient.removeQueries(['chatData']);
  }, [queryClient]);

  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), sender: 'user', text: inputText.trim() };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
    }
  }, [inputText]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 overflow-y-auto">
      <Card className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI Chat Summary & Topics
        </h1>
        <Button
          onClick={toggleChat}
          className="mb-4 bg-purple-600 hover:bg-purple-700"
        >
          {showChat ? 'Hide Chat' : 'Show Chat'}
          <MessageSquare className="ml-2 h-4 w-4" />
        </Button>
        <ResizablePanelGroup direction="horizontal">
          {showChat && (
            <ResizablePanel defaultSize={50} minSize={30}>
              <ChatPanel
                messages={messages}
                inputText={inputText}
                setInputText={setInputText}
                handleSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          )}
          <ResizablePanel defaultSize={showChat ? 50 : 100} minSize={30}>
            <div className="space-y-6">
              <TabSection
                headline={chatData?.headline}
                summary={chatData?.summary}
                mainTopics={chatData?.mainTopics}
                isLoading={isLoading || updateMutation.isLoading}
                error={error || updateMutation.error}
              />
              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  onClick={handleUpdate}
                  disabled={isLoading || updateMutation.isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {(isLoading || updateMutation.isLoading) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Update
                </Button>
                <Button
                  onClick={handleClear}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
}