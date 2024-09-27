import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { analyzeQuestion, compareAnalysis } from '../utils/apiUtils';
import SummaryVisualizer from './SummaryVisualizer';
import DoubleCheckButton from './DoubleCheckButton';
import LoadingIndicator from './LoadingIndicator';

export default function QuestionAnalyzer() {
  const [question, setQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDoubleChecked, setIsDoubleChecked] = useState(false);
  const [doubleCheckStatus, setDoubleCheckStatus] = useState('未チェック');
  const queryClient = useQueryClient();

  const { isLoading, error, mutate } = useMutation({
    mutationFn: async (q) => {
      const result = await analyzeQuestion(q);
      setIsDoubleChecked(false);
      setDoubleCheckStatus('未チェック');
      return result;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.setQueryData(['analysisResult'], data);
    },
  });

  const doubleCheckMutation = useMutation({
    mutationFn: async () => {
      setDoubleCheckStatus('チェック中...');
      const newResult = await analyzeQuestion(question);
      const comparison = await compareAnalysis(analysisResult, newResult);
      return { newResult, comparison };
    },
    onSuccess: ({ newResult, comparison }) => {
      if (comparison.hasDifferences) {
        setAnalysisResult(newResult);
        queryClient.setQueryData(['analysisResult'], newResult);
        setDoubleCheckStatus('更新済み');
      } else {
        setDoubleCheckStatus('変更なし');
      }
      setIsDoubleChecked(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      mutate(question);
    }
  };

  const handleDoubleCheck = () => {
    if (question.trim() && analysisResult) {
      doubleCheckMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 overflow-y-auto">
      <Card className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Question Analyzer
        </h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="質問を入力してください..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500"
            />
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mb-4">エラー: {error.message}</p>}
        {isLoading && <LoadingIndicator />}
        {analysisResult && (
          <>
            <SummaryVisualizer
              summary={analysisResult.summary}
              keyPoints={analysisResult.keyPoints}
            />
            <div className="mt-4 flex items-center justify-between">
              <DoubleCheckButton onDoubleCheck={handleDoubleCheck} disabled={doubleCheckMutation.isLoading} />
              <span className="text-sm text-gray-400">
                ダブルチェック状態: {doubleCheckStatus}
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}