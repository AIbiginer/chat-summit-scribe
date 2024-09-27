import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatInput = ({ inputText, setInputText, handleSendMessage, error }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-b-lg">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-gray-500"
        />
        <Button onClick={handleSendMessage} className="bg-gray-600 text-white hover:bg-gray-500 transition-colors duration-200">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default ChatInput;