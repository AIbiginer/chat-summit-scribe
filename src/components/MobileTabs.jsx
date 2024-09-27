import React from 'react';
import { Button } from "@/components/ui/button";

const MobileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-around bg-gray-800 p-2">
      <Button
        variant={activeTab === 'chat' ? 'default' : 'outline'}
        onClick={() => setActiveTab('chat')}
        className="flex-1 mr-1"
      >
        チャット
      </Button>
      <Button
        variant={activeTab === 'summary' ? 'default' : 'outline'}
        onClick={() => setActiveTab('summary')}
        className="flex-1 mx-1"
      >
        要約
      </Button>
      <Button
        variant={activeTab === 'topics' ? 'default' : 'outline'}
        onClick={() => setActiveTab('topics')}
        className="flex-1 ml-1"
      >
        トピック
      </Button>
    </div>
  );
};

export default MobileTabs;