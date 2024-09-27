import axios from 'axios';

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

export const callGPTAPI = async (prompt) => {
  try {
    const response = await axiosInstance.post('', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
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
  const prompt = `次の会話を分析し、以下の形式で結果を返してください：

1. 現在のトピック：会話の最新のトピックを1つ、15文字以内で
2. 会話の要約：会話全体の要約を、100文字以内で
3. 主要な話題：会話から抽出した3つの主要な話題を、各15文字以内で

結果は以下のJSON形式で返してください：
{
  "currentTopic": "現在のトピック",
  "summary": "会話の要約",
  "mainTopics": ["話題1", "話題2", "話題3"]
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