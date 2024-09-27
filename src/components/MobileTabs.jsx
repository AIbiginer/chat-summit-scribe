import React from 'react';
import { Button } from "@/components/ui/button";

const MobileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-around bg-gray-800 p-2 z-10">
      <Button
        variant={activeTab === 'chat' ? 'default' : 'outline'}
        onClick={() => setActiveTab('chat')}
        className={`flex-1 mr-1 ${activeTab === 'chat' ? 'border-2 border-purple-500 bg-purple-700 text-white' : 'text-gray-300'}`}
      >
        チャット
      </Button>
      <Button
        variant={activeTab === 'summary' ? 'default' : 'outline'}
        onClick={() => setActiveTab('summary')}
        className={`flex-1 ml-1 ${activeTab === 'summary' ? 'border-2 border-purple-500 bg-purple-700 text-white' : 'text-gray-300'}`}
      >
        要約・トピック
      </Button>
    </div>
  );
};

export default MobileTabs;