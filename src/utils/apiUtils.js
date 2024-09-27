import axios from 'axios';
import rateLimit from 'express-rate-limit';
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

// APIリクエストの制限を設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100 // IPアドレスごとに100リクエスト
});

// 入力のバリデーションスキーマ
const promptSchema = z.string().min(1).max(1000);

export const callGPTAPI = async (prompt) => {
  try {
    // 入力のバリデーションとサニタイズ
    const sanitizedPrompt = sanitizeInput(prompt);
    validateInput(promptSchema, sanitizedPrompt);

    // レート制限の適用
    await new Promise((resolve) => limiter(null, null, resolve));

    const response = await axiosInstance.post('', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: sanitizedPrompt }],
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    // レスポンスのサニタイズ
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

    let prompt = `以下の質問を分析し、簡潔で正確な要約と重要ポイントを生成してください。結果は以下のJSON形式で返してください：

    {
      "summary": "質問の要約（200文字以内）",
      "keyPoints": [
        {"title": "重要ポイント1（30文字以内）", "description": "説明（50文字以内）"},
        {"title": "重要ポイント2（30文字以内）", "description": "説明（50文字以内）"},
        {"title": "重要ポイント3（30文字以内）", "description": "説明（50文字以内）"}
      ]
    }

    質問の内容を正確に理解し、適切な要約と重要ポイントを抽出してください。
    また、前回の分析とは異なる視点や新しい洞察を含めるよう努めてください。

    質問：
    ${sanitizedQuestion}`;

    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error analyzing question:', error);
    throw new Error('質問の分析中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};

export const compareAnalysis = async (oldResult, newResult) => {
  try {
    const sanitizedOldResult = sanitizeInput(JSON.stringify(oldResult));
    const sanitizedNewResult = sanitizeInput(JSON.stringify(newResult));

    const prompt = `以下の2つの分析結果を比較し、重要な違いがあるかどうかを判断してください。
    細かな表現の違いは無視し、内容に大きな齟齬がある場合のみ違いとして報告してください。
    結果はJSON形式で返してください。

    古い分析結果:
    ${sanitizedOldResult}

    新しい分析結果:
    ${sanitizedNewResult}

    返すべきJSON形式:
    {
      "hasDifferences": true/false,
      "differences": [
        {
          "type": "summary/keyPoint",
          "description": "重要な違いの説明"
        }
      ]
    }

    違いがない場合や、違いが軽微な場合は、"hasDifferences": false と "differences": [] を返してください。`;

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

    const result = await callGPTAPI(sanitizedPrompt);
    return result;
  } catch (error) {
    console.error('Error generating follow-up response:', error);
    throw new Error('フォローアップレスポンスの生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
  }
};
