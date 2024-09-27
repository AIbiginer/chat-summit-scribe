import { z } from 'zod';

export const sanitizeInput = (input) => {
  return input.replace(/[&<>"']/g, (match) => {
    const replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return replacements[match];
  });
};

export const validateInput = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error.errors);
    throw new Error('入力が無効です。');
  }
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // サーバーからのレスポンスがあるエラー
    return '申し訳ありませんが、サーバーエラーが発生しました。';
  } else if (error.request) {
    // リクエストは送信されたがレスポンスがない
    return 'サーバーに接続できません。インターネット接続を確認してください。';
  } else {
    // リクエストの設定中に何らかのエラーが発生
    return '予期せぬエラーが発生しました。もう一度お試しください。';
  }
};