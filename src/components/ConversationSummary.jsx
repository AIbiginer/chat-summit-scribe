import React from 'react';
import SummaryVisualizer from './SummaryVisualizer';

const ConversationSummary = ({ headline, summary, topicData }) => {
  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">見出し</h3>
        <p className="text-sm font-semibold text-gray-300">{headline || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">要約</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{summary || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">話題分析</h3>
        <SummaryVisualizer topicData={topicData} />
      </div>
    </div>
  );
};

export default ConversationSummary;