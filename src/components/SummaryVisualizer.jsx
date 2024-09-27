import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const SummaryVisualizer = ({ topicData }) => {
  if (!topicData || !Array.isArray(topicData) || topicData.length === 0) {
    return <div className="text-gray-400">トピックデータが利用できません。</div>;
  }

  const chartData = topicData.map((topic, index) => ({
    name: topic.name,
    value: topic.value,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {topicData.map((topic, index) => (
        <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">{topic.name}</h3>
          <p className="text-gray-300">関連度: {topic.value}%</p>
          <p className="text-sm text-gray-400 mt-2">{topic.description}</p>
          {topic.keywords && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-gray-500">関連キーワード: </span>
              {topic.keywords.map((keyword, idx) => (
                <span key={idx} className="inline-block bg-gray-600 text-gray-300 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryVisualizer;