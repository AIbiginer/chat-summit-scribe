import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatInput = ({ inputText, setInputText, handleSendMessage, error }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-b-lg">
      <div className="flex space-x-3">
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
        <Button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors duration-200">
          <Send className="h-5 w-5" />
        </Button>
      </div>
      {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
    </div>
  );
};

export default ChatInput;