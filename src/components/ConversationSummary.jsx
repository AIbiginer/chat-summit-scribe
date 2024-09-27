import React from 'react';

const ConversationSummary = ({ currentTopic, summary, mainTopics }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">現在のトピック</h3>
        <p className="text-lg font-semibold text-gray-300">{currentTopic || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">会話の要約</h3>
        <p className="text-base text-gray-300 leading-relaxed">{summary || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">主要な話題</h3>
        {mainTopics && mainTopics.length > 0 ? (
          <div className="space-y-2 mt-4">
            {mainTopics.map((topic, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 shadow-md">
                <p className="text-sm text-gray-300">{topic}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">トピックデータが利用できません。</p>
        )}
      </div>
    </div>
  );
};

export default ConversationSummary;