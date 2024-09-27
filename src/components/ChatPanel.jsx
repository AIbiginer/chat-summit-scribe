import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const ChatPanel = ({ messages, inputText, setInputText, handleSendMessage }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-700 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default ChatPanel;