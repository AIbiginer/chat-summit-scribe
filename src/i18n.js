import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    resources: {
      en: {
        translation: {
          questionAnalyzer: "Question Analyzer",
          aiWarningTitle: "Caution with AI Responses",
          aiWarningDescription: "AI may sometimes generate incorrect information. Check hallucination results and use the double-check feature when necessary.",
          enterQuestion: "Enter your question...",
          error: "Error",
          doubleCheckStatus: "Double-check status",
          followUpResponse: "Follow-up Response",
          notChecked: "Not checked",
          checking: "Checking...",
          updated: "Updated",
          noChange: "No change",
          explainPrompt: "Please explain the following in more detail:\n{{content}}",
          examplePrompt: "Please provide specific examples related to the following:\n{{content}}",
          questionPrompt: "Please list 3 common questions and their answers about the following:\n{{content}}",
        }
      },
      ja: {
        translation: {
          questionAnalyzer: "質問分析ツール",
          aiWarningTitle: "AI回答に関する注意",
          aiWarningDescription: "AIは時として誤った情報を生成することがあります。ハルシネーションチェック結果を確認し、必要に応じてダブルチェック機能をお使いください。",
          enterQuestion: "質問を入力してください...",
          error: "エラー",
          doubleCheckStatus: "ダブルチェック状態",
          followUpResponse: "フォローアップ回答",
          notChecked: "未チェック",
          checking: "チェック中...",
          updated: "更新済み",
          noChange: "変更なし",
          explainPrompt: "以下の内容についてもっと詳しく説明してください：\n{{content}}",
          examplePrompt: "以下の内容に関連する具体的な例を挙げてください：\n{{content}}",
          questionPrompt: "以下の内容について、よくある質問とその回答を3つ挙げてください：\n{{content}}",
        }
      }
    }
  });

export default i18n;
