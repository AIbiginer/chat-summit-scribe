import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const SummaryVisualizer = ({ topicData }) => {
  if (!topicData || !Array.isArray(topicData) || topicData.length === 0) {
    return <div className="text-gray-400">トピックデータが利用できません。</div>;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-700 p-2 rounded shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p>重要度: {data.value}%</p>
          <p className="text-sm">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={topicData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {topicData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {topicData.map((topic, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3 shadow-md">
            <h4 className="text-lg font-semibold text-purple-300 mb-1">{topic.name}</h4>
            <p className="text-sm text-gray-300">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryVisualizer;