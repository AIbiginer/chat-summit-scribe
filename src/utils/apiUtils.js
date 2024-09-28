import axios from 'axios';
import { sanitizeInput, validateInput } from './securityUtils';
import { z } from 'zod';

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

const promptSchema = z.string().min(1).max(2000);

export const callGPTAPI = async (prompt) => {
  try {
    const sanitizedPrompt = sanitizeInput(prompt);
    validateInput(promptSchema, sanitizedPrompt);

    const response = await axiosInstance.post('', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: sanitizedPrompt }],
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const sanitizedResponse = sanitizeInput(response.data.choices[0].message.content.trim());
    return sanitizedResponse;
  } catch (error) {
    console.error('Error calling GPT API:', error);
    if (error.response) {
      throw new Error(`APIエラー: ${error.response.status} - ${error.response.data.error.message}`);
    } else if (error.request) {
      throw new Error('ネットワークエラー: サーバーに接続できません');
    } else {
      throw new Error('予期せぬエラーが発生しました');
    }
  }
};

export const analyzeQuestion = async (question) => {
  try {
    const sanitizedQuestion = sanitizeInput(question);
    validateInput(promptSchema, sanitizedQuestion);

    let prompt = `質問を分析し、以下の形式でJSONレスポンスを生成してください：
    1. 質問の要約（200文字以内）
    2. 3つの重要ポイント（各30文字以内のタイトルと50文字以内の説明）
    3. 新しい視点や洞察を含める

    質問: ${sanitizedQuestion}

    JSONフォーマット:
    {
      "summary": "質問の要約",
      "keyPoints": [
        {"title": "重要ポイント1", "description": "説明1"},
        {"title": "重要ポイント2", "description": "説明2"},
        {"title": "重要ポイント3", "description": "説明3"}
      ]
    }`;

    const result = await callGPTAPI(prompt);
    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError);
      console.log('解析できなかった結果:', result);
      throw new Error('APIからの応答を解析できませんでした。');
    }
  } catch (error) {
    console.error('Error analyzing question:', error);
    throw new Error('質問の分析中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};

export const compareAnalysis = async (oldResult, newResult) => {
  try {
    const sanitizedOldResult = sanitizeInput(JSON.stringify(oldResult));
    const sanitizedNewResult = sanitizeInput(JSON.stringify(newResult));

    const prompt = `2つの分析結果を比較し、重要な違いを特定してJSONで返してください。
    軽微な表現の違いは無視し、内容の大きな差異のみを報告してください。

    古い分析: ${sanitizedOldResult}
    新しい分析: ${sanitizedNewResult}

    JSONフォーマット:
    {
      "hasDifferences": true/false,
      "differences": [
        {
          "type": "summary/keyPoint",
          "description": "重要な違いの説明"
        }
      ]
    }

    違いがない場合は、"hasDifferences": false と空の "differences" 配列を返してください。`;

    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error comparing analysis:', error);
    throw new Error('分析結果の比較中にエラーが発生しました。');
  }
};

export const generateFollowUpResponse = async (prompt) => {
  try {
    const sanitizedPrompt = sanitizeInput(prompt);
    validateInput(promptSchema, sanitizedPrompt);

    const modifiedPrompt = `${sanitizedPrompt}\n\n回答は短く、端的に、わかりやすく補足してください。50文字以内で回答してください。`;

    const result = await callGPTAPI(modifiedPrompt);
    return result;
  } catch (error) {
    console.error('Error generating follow-up response:', error);
    throw new Error('フォローアップレスポンスの生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};
