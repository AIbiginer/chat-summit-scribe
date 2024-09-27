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
  const conversationContext = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
  const headlinePrompt = `次の会話の見出しを、教科書の章タイトルのように簡潔かつ分かりやすく20文字以内で作成してください:\n${conversationContext}`;
  const summaryPrompt = `次の会話の要約を、以下の点に注意して100文字以内で作成してください:
1. 会話の主要なポイントを捉える
2. ユーザーとAIの対話の流れを反映する
3. 重要な情報や結論を強調する
4. 平易な言葉を使用する
会話内容:\n${conversationContext}`;
  const topicAnalysisPrompt = `次の会話から主要な話題を3つ抽出し、各話題の重要度（%）を算出してください。結果を以下の形式のJSONで返してください:
[
  {"name": "話題1", "value": 40, "description": "話題1の簡単な説明（15文字以内）"},
  {"name": "話題2", "value": 35, "description": "話題2の簡単な説明（15文字以内）"},
  {"name": "話題3", "value": 25, "description": "話題3の簡単な説明（15文字以内）"}
]
会話内容:\n${conversationContext}`;

  try {
    const [headline, summary, topicAnalysis] = await Promise.all([
      callGPTAPI(headlinePrompt),
      callGPTAPI(summaryPrompt),
      callGPTAPI(topicAnalysisPrompt)
    ]);

    let parsedTopicData;
    try {
      parsedTopicData = JSON.parse(topicAnalysis);
      if (!Array.isArray(parsedTopicData)) {
        parsedTopicData = Object.values(parsedTopicData);
      }
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