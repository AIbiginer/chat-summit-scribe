import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Maximize2, Minimize2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import ConversationSummary from './ConversationSummary'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default function EnhancedChat() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [headline, setHeadline] = useState('会話を開始してください')
  const [summary, setSummary] = useState('まだ会話が始まっていません')
  const [topicData, setTopicData] = useState([])
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)

  const callGPTAPI = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10秒のタイムアウトを設定
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling GPT API:', error);
      if (error.response) {
        throw new Error(`API エラー: ${error.response.status} - ${error.response.data.error.message}`);
      } else if (error.request) {
        throw new Error('APIからの応答がありません。インターネット接続を確認してください。');
      } else {
        throw new Error(`リクエスト設定エラー: ${error.message}`);
      }
    }
  }

  const generateHeadlineAndSummary = async (newMessages) => {
    const lastFiveMessages = newMessages.slice(-5);
    const conversationContext = lastFiveMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
    const headlinePrompt = `次の会話の見出しを10文字以内で作成:${conversationContext}`;
    const summaryPrompt = `次の会話の要約を50文字以内で作成:${conversationContext}`;
    const topicAnalysisPrompt = `次の会話から主要な話題を2つ抽出し、各話題の重要度（%）を算出。結果をJSON形式で返す:${conversationContext}`;

    try {
      const [newHeadline, newSummary, topicAnalysis] = await Promise.all([
        callGPTAPI(headlinePrompt),
        callGPTAPI(summaryPrompt),
        callGPTAPI(topicAnalysisPrompt)
      ]);

      setHeadline(newHeadline);
      setSummary(newSummary);

      // トピックデータの解析と設定
      const topics = JSON.parse(topicAnalysis);
      setTopicData(topics);

    } catch (error) {
      console.error('Error generating headline and summary:', error);
      setError('見出しと要約の生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: 'user' }
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputText('');
      setError(null);
      
      try {
        const aiResponse = await callGPTAPI(inputText);
        const aiMessage = { 
          id: Date.now(), 
          text: aiResponse, 
          sender: 'ai'
        }
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        
        // 会話の要約と分析を非同期で行う
        generateHeadlineAndSummary(finalMessages);
      } catch (error) {
        console.error('Error in message handling:', error);
        setError(error.message);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: `エラーが発生しました: ${error.message}`, sender: 'system' }])
      }
    }
  }, [inputText, messages])

  const handleRefresh = useCallback(() => {
    setMessages([]);
    setHeadline('会話を開始してください');
    setSummary('まだ会話が始まっていません');
    setTopicData([]);
    setError(null);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex h-screen bg-gradient-to-br from-gray-900 to-black text-white ${isFullscreen ? 'w-screen' : 'w-[1024px] mx-auto my-8 rounded-lg shadow-2xl'}`}
    >
      <div className="flex-1 flex flex-col max-w-[60%]">
        <motion.header 
          className="bg-gray-800 p-6 flex justify-between items-center rounded-t-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AI チャット</h1>
          <div className="flex space-x-3">
            <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </motion.header>

        <ScrollArea className="flex-1 p-6 space-y-6 bg-gray-900">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </ScrollArea>

        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          error={error}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-[40%] bg-gray-800 p-6 flex flex-col space-y-6 rounded-r-lg"
      >
        <Card className="p-6 h-full bg-gray-700 text-white border-none shadow-lg">
          <ConversationSummary headline={headline} summary={summary} topicData={topicData} />
        </Card>
      </motion.div>
    </motion.div>
  )
}