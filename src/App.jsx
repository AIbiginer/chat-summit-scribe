import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { isLocalEnvironment } from "./utils/environmentCheck";
import LoadingIndicator from "./components/LoadingIndicator";
import { useTranslation } from 'react-i18next';
import './i18n';

const LandingPage = lazy(() => import("./pages/LandingPage"));
const QuestionAnalyzer = lazy(() => import("./components/QuestionAnalyzer"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      cacheTime: 300000,
    },
  },
});

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // 言語設定を保存
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button onClick={() => changeLanguage('en')} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">EN</button>
      <button onClick={() => changeLanguage('ja')} className="px-2 py-1 bg-red-500 text-white rounded">JP</button>
    </div>
  );
};

const App = () => {
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  if (!isLocalEnvironment()) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">{t('localOnly')}</h1>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <LanguageSwitcher />
            <Suspense fallback={<LoadingIndicator />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/analyzer" element={<QuestionAnalyzer />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

次に、QuestionAnalyzer.jsxを更新してフォローアップ回答を改善します：


src/components/QuestionAnalyzer.jsx
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { analyzeQuestion, compareAnalysis, generateFollowUpResponse } from '../utils/apiUtils';
import { performHallucinationCheck } from '../utils/hallucinationCheck';
import SummaryVisualizer from './SummaryVisualizer';
import DoubleCheckButton from './DoubleCheckButton';
import LoadingIndicator from './LoadingIndicator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { sanitizeInput, validateInput, handleApiError } from '../utils/securityUtils';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const questionSchema = z.string().min(1).max(500);

export default function QuestionAnalyzer() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [hallucinationCheckResult, setHallucinationCheckResult] = useState(null);
  const [isDoubleChecked, setIsDoubleChecked] = useState(false);
  const [doubleCheckStatus, setDoubleCheckStatus] = useState(t('notChecked'));
  const [followUpResponse, setFollowUpResponse] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, error, mutate } = useMutation({
    mutationFn: async (q) => {
      const sanitizedQuestion = sanitizeInput(q);
      validateInput(questionSchema, sanitizedQuestion);
      const result = await analyzeQuestion(sanitizedQuestion);
      setIsDoubleChecked(false);
      setDoubleCheckStatus(t('notChecked'));
      return result;
    },
    onSuccess: async (data) => {
      setAnalysisResult(data);
      queryClient.setQueryData(['analysisResult'], data);
      const checkResult = await performHallucinationCheck(data);
      setHallucinationCheckResult(checkResult);
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      alert(handleApiError(error));
    },
  });

  const doubleCheckMutation = useMutation({
    mutationFn: async () => {
      setDoubleCheckStatus(t('checking'));
      const sanitizedQuestion = sanitizeInput(question);
      validateInput(questionSchema, sanitizedQuestion);
      const newResult = await analyzeQuestion(sanitizedQuestion);
      const comparison = await compareAnalysis(analysisResult, newResult);
      return { newResult, comparison };
    },
    onSuccess: ({ newResult, comparison }) => {
      if (comparison.hasDifferences) {
        setAnalysisResult(prevResult => ({
          ...prevResult,
          ...comparison.differences.reduce((acc, diff) => {
            if (diff.type === 'summary') {
              acc.summary = newResult.summary;
            } else if (diff.type === 'keyPoint') {
              acc.keyPoints = newResult.keyPoints;
            }
            return acc;
          }, {})
        }));
        setDoubleCheckStatus(t('updated'));
      } else {
        setDoubleCheckStatus(t('noChange'));
      }
      setIsDoubleChecked(true);
    },
    onError: (error) => {
      console.error('Error in double check:', error);
      alert(handleApiError(error));
    },
  });

  const followUpMutation = useMutation({
    mutationFn: async ({ item, action }) => {
      let prompt = '';
      switch (action) {
        case 'explain':
          prompt = t('explainPrompt', { content: item.content.title || item.content });
          break;
        case 'example':
          prompt = t('examplePrompt', { content: item.content.title || item.content });
          break;
        case 'question':
          prompt = t('questionPrompt', { content: item.content.title || item.content });
          break;
        default:
          throw new Error('Invalid action');
      }
      return await generateFollowUpResponse(prompt);
    },
    onSuccess: (data) => {
      setFollowUpResponse(data);
    },
    onError: (error) => {
      console.error('Error in follow-up:', error);
      alert(handleApiError(error));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      mutate(question);
    }
  };

  const handleDoubleCheck = () => {
    if (question.trim() && analysisResult && !isDoubleChecked) {
      doubleCheckMutation.mutate();
    }
  };

  const handleOptionSelect = (item, action) => {
    followUpMutation.mutate({ item, action });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500">
            {t('questionAnalyzer')}
          </h1>
          <Alert className="mb-4 bg-indigo-900 border-indigo-700">
            <InfoIcon className="h-4 w-4 text-indigo-400" />
            <AlertTitle className="text-indigo-300">{t('aiWarningTitle')}</AlertTitle>
            <AlertDescription className="text-gray-300">
              {t('aiWarningDescription')}
            </AlertDescription>
          </Alert>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('enterQuestion')}
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500 mb-4">{t('error')}: {error.message}</p>}
          {isLoading && <LoadingIndicator />}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SummaryVisualizer
                summary={analysisResult.summary}
                keyPoints={analysisResult.keyPoints}
                hallucinationCheckResult={hallucinationCheckResult}
                onOptionSelect={handleOptionSelect}
              />
              <div className="mt-4 flex items-center justify-between">
                <DoubleCheckButton 
                  onDoubleCheck={handleDoubleCheck} 
                  disabled={doubleCheckMutation.isLoading || isDoubleChecked}
                />
                <span className="text-sm text-gray-400">
                  {t('doubleCheckStatus')}: {doubleCheckStatus}
                </span>
              </div>
            </motion.div>
          )}
          {followUpResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-gray-700 p-4 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-indigo-300">{t('followUpResponse')}</h3>
              <p className="text-gray-200">{followUpResponse}</p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

最後に、i18n.jsファイルを更新して、新しい翻訳キーを追加します：


src/i18n.js
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
