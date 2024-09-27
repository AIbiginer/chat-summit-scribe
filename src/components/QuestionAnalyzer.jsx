import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { analyzeQuestion, generateFollowUpResponse, summarizeQuestionAndAnswer } from '../utils/apiUtils';
import SummaryVisualizer from './SummaryVisualizer';
import DoubleCheckButton from './DoubleCheckButton';

export default function QuestionAnalyzer() {
  const [question, setQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [summary, setSummary] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, error, mutate } = useMutation({
    mutationFn: analyzeQuestion,
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.setQueryData(['analysisResult'], data);
    },
  });

  const followUpMutation = useMutation({
    mutationFn: generateFollowUpResponse,
    onSuccess: async (data) => {
      const updatedResult = {
        ...analysisResult,
        followUp: data
      };
      setAnalysisResult(updatedResult);
      
      // 質問と回答の要約を生成
      const summaryResult = await summarizeQuestionAndAnswer(question, data);
      setSummary(summaryResult);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      mutate(question);
    }
  };

  const handleOptionSelect = (item, action) => {
    const prompt = `${action}について: ${item.content.title || item.content}`;
    followUpMutation.mutate(prompt);
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
        {summary && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-purple-300">要約</h3>
            <p className="text-gray-300 mb-2"><strong>質問:</strong> {summary.questionSummary}</p>
            <p className="text-gray-300"><strong>回答:</strong> {summary.answerSummary}</p>
          </div>
        )}
        {analysisResult && (
          <>
            <SummaryVisualizer
              summary={analysisResult.summary}
              keyPoints={analysisResult.keyPoints}
              onOptionSelect={handleOptionSelect}
            />
            {analysisResult.followUp && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-purple-300">フォローアップ</h3>
                <p className="text-gray-300">{analysisResult.followUp}</p>
              </div>
            )}
            <DoubleCheckButton onDoubleCheck={() => mutate(question)} />
          </>
        )}
      </Card>
    </div>
  );
}