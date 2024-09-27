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

export const generateHeadlineAndSummary = async (messages) => {
  const lastFiveMessages = messages.slice(-5);
  const conversationContext = lastFiveMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
  const headlinePrompt = `次の会話の見出しを10文字以内で作成:${conversationContext}`;
  const summaryPrompt = `次の会話の要約を50文字以内で作成:${conversationContext}`;
  const topicAnalysisPrompt = `次の会話から主要な話題を2つ抽出し、各話題の重要度（%）を算出。結果をJSON形式で返す:${conversationContext}`;

  try {
    const [headline, summary, topicAnalysis] = await Promise.all([
      callGPTAPI(headlinePrompt),
      callGPTAPI(summaryPrompt),
      callGPTAPI(topicAnalysisPrompt)
    ]);

    let parsedTopicData;
    try {
      parsedTopicData = JSON.parse(topicAnalysis);
    } catch (error) {
      console.error('Error parsing topic analysis:', error);
      parsedTopicData = []; // Fallback to empty array if parsing fails
    }

    return {
      headline,
      summary,
      topicData: parsedTopicData
    };
  } catch (error) {
    console.error('Error generating headline and summary:', error);
    throw new Error('見出しと要約の生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};