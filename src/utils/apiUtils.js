import axios from 'axios';

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000
});

export const callGPTAPI = async (prompt) => {
  try {
    const response = await axiosInstance.post('', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
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

export const analyzeQuestion = async (question) => {
  const prompt = `以下の質問を分析し、簡潔な要約と重要ポイントを生成してください。結果は以下のJSON形式で返してください：

{
  "summary": "質問の要約（200文字以内）",
  "keyPoints": [
    {"title": "重要ポイント1（30文字以内）", "description": "説明（50文字以内）"},
    {"title": "重要ポイント2（30文字以内）", "description": "説明（50文字以内）"},
    {"title": "重要ポイント3（30文字以内）", "description": "説明（50文字以内）"}
  ]
}

質問：
${question}`;

  try {
    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error analyzing question:', error);
    throw new Error('質問の分析中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};

export const generateFollowUpResponse = async (prompt) => {
  try {
    const result = await callGPTAPI(prompt);
    return result;
  } catch (error) {
    console.error('Error generating follow-up response:', error);
    throw new Error('フォローアップレスポンスの生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};

export const summarizeQuestionAndAnswer = async (question, answer) => {
  const prompt = `以下の質問と回答を要約してください。要約は簡潔で、すぐに読める程度の詳細さにしてください。結果は以下のJSON形式で返してください：

{
  "questionSummary": "質問の要約（100文字以内）",
  "answerSummary": "回答の要約（200文字以内）"
}

質問：
${question}

回答：
${answer}`;

  try {
    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error summarizing question and answer:', error);
    throw new Error('要約の生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};