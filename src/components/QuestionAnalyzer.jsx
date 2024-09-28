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
import { ScrollArea } from "@/components/ui/scroll-area";

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
              <ScrollArea className="h-24 rounded-md border p-4">
                <p className="text-gray-200">{followUpResponse}</p>
              </ScrollArea>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
