import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Trash2, Send } from 'lucide-react';
import { generateTopicsAndSummary } from '../utils/apiUtils';
import TabSection from './TabSection';
import ChatHistory from './ChatHistory';

export default function EnhancedChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 0) {
        refetch();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [messages, refetch]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 overflow-y-auto">
      <Card className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI Chat Summary & Topics
        </h1>
        <div className="space-y-6">
          <ChatHistory messages={messages} />
          <TabSection
            headline={chatData?.headline}
            summary={chatData?.summary}
            mainTopics={chatData?.mainTopics}
            isLoading={isLoading || updateMutation.isLoading}
            error={error || updateMutation.error}
          />
          <div className="flex space-x-2">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
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
      </Card>
    </div>
  );
}