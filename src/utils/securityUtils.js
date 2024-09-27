import { z } from 'zod';
import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
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
    return `APIエラー: ${error.response.status} - ${error.response.data.error.message}`;
  } else if (error.request) {
    return 'ネットワークエラー: サーバーに接続できません';
  } else {
    return '予期せぬエラーが発生しました';
  }
};