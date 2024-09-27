import { callGPTAPI } from './apiUtils';

export const performHallucinationCheck = async (analysisResult) => {
  const prompt = `以下の分析結果をチェックし、各項目が適切かどうかを判断してください。
結果はJSON形式で返してください。各項目に✅（正しい）または❌（おかしい）をつけ、おかしい項目には簡単な説明を加えてください。
問題がない場合でも、その旨を明記してください。

分析結果:
${JSON.stringify(analysisResult, null, 2)}

返すべきJSON形式:
{
  "summary": {
    "status": "✅" or "❌",
    "explanation": "説明（問題がない場合は「問題なし」と記載）"
  },
  "keyPoints": [
    {
      "title": "重要ポイント1のタイトル",
      "status": "✅" or "❌",
      "explanation": "説明（問題がない場合は「問題なし」と記載）"
    },
    // 他の重要ポイントも同様に
  ],
  "overallStatus": "問題なし" or "要注意"
}`;

  try {
    const result = await callGPTAPI(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error performing hallucination check:', error);
    throw new Error('ハルシネーションチェック中にエラーが発生しました。');
  }
};