import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const ConversationSummary = ({ headline, summary }) => {
  return (
    <div className="h-full space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">見出し</h3>
        <p className="text-sm font-semibold text-gray-300">{headline}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">要約</h3>
        <ScrollArea className="h-[calc(100%-8rem)]">
          <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ConversationSummary;