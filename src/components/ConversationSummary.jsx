import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const ConversationSummary = ({ currentTopic, summary }) => {
  return (
    <div className="h-full">
      <h3 className="text-md font-semibold mb-2">現在のトピック</h3>
      <p className="text-sm mb-4">{currentTopic}</p>
      <h3 className="text-md font-semibold mb-2">会話の要約</h3>
      <ScrollArea className="h-[calc(100%-8rem)]">
        <p className="text-sm">{summary}</p>
      </ScrollArea>
    </div>
  );
};

export default ConversationSummary;