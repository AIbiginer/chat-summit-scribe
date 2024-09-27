import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatInput = ({ inputText, setInputText, handleSendMessage, error }) => {
  return (
    <div className="p-4 bg-black bg-opacity-30 rounded-b-lg">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="メッセージを入力..."
          className="flex-1 bg-white bg-opacity-20 text-white placeholder-gray-300 border-none focus:ring-2 focus:ring-white"
        />
        <Button onClick={handleSendMessage} className="bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-200">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-red-300 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default ChatInput;