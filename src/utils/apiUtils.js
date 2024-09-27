import axios from 'axios';

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000 // タイムアウトを30秒に延長
});

export const callGPTAPI = async (prompt) => {
  try {
    const response = await axiosInstance.post('', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500, // トークン数を増やして、より詳細な回答を得る
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling GPT API:', error);
    throw new Error('APIエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};

export const generateTopicsAndSummary = async (messages) => {
  const conversationContext = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `以下の会話を分析し、教科書レベルの高品質な要約と話題を生成してください。結果は以下のJSON形式で返してください：

1. 見出し：会話の核心を捉えた印象的な見出しを30文字以内で
2. 要約：会話の本質を簡潔かつ洞察力に富んだ形で要約し、200文字以内で
3. 主要な話題：会話から抽出した3つの重要な話題を、各30文字以内で。それぞれの話題に対して、50文字以内の簡潔な説明を付け加えてください。

{
  "headline": "見出し",
  "summary": "要約",
  "mainTopics": [
    {"topic": "話題1", "description": "説明1"},
    {"topic": "話題2", "description": "説明2"},
    {"topic": "話題3", "description": "説明3"}
  ]
}

会話内容：
${conversationContext}`;

  try {
    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error generating topics and summary:', error);
    throw new Error('トピックと要約の生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};