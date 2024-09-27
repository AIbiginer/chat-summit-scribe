import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const ConversationSummary = ({ headline, summary }) => {
  return (
    <div className="h-full">
      <h3 className="text-lg font-bold mb-2">見出し</h3>
      <p className="text-sm mb-4 font-semibold">{headline}</p>
      <h3 className="text-lg font-bold mb-2">要約</h3>
      <ScrollArea className="h-[calc(100%-8rem)]">
        <p className="text-sm">{summary}</p>
      </ScrollArea>
    </div>
  );
};

export default ConversationSummary;