import React from 'react';

const ConversationSummary = ({ headline, summary, topicData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">会話の見出し</h3>
        <p className="text-lg font-semibold text-gray-300">{headline || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">会話の要約</h3>
        <p className="text-base text-gray-300 leading-relaxed">{summary || 'データがありません'}</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">主要な話題</h3>
        {topicData && topicData.length > 0 ? (
          <div className="space-y-2 mt-4">
            {topicData.map((topic, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 shadow-md">
                <h4 className="text-lg font-semibold text-purple-300 mb-1">{topic.name}</h4>
                <p className="text-sm text-gray-300">{topic.description}</p>
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