import React from 'react';

const SummaryVisualizer = ({ topicData }) => {
  return (
    <div className="space-y-4">
      {topicData.map((topic, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">{topic.name}</h3>
          <p className="text-gray-300">関連度: {topic.value}%</p>
          <p className="text-sm text-gray-400 mt-2">{topic.description}</p>
          <div className="mt-3">
            <span className="text-xs font-semibold text-gray-500">関連キーワード: </span>
            {topic.keywords.map((keyword, idx) => (
              <span key={idx} className="inline-block bg-gray-700 text-gray-300 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryVisualizer;