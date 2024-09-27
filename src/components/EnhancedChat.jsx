import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Maximize2, Minimize2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)

  const callGPTAPI = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        n: 1,
        stop: null,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
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
    const conversationContext = newMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
    const headlinePrompt = `以下の会話の見出しを、新聞の見出しのように簡潔に作成してください（15文字以内）:\n${conversationContext}\n前回の見出し: ${headline}`;
    const summaryPrompt = `以下の会話の要約を、新聞の要約のように簡潔に作成してください（50文字以内）:\n${conversationContext}\n前回の要約: ${summary}`;

    try {
      const newHeadline = await callGPTAPI(headlinePrompt);
      const newSummary = await callGPTAPI(summaryPrompt);
      setHeadline(newHeadline);
      setSummary(newSummary);
    } catch (error) {
      console.error('Error generating headline and summary:', error);
      setError('見出しと要約の生成中にエラーが発生しました。');
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
        
        await generateHeadlineAndSummary(finalMessages);
      } catch (error) {
        console.error('Error in message handling:', error);
        setError(error.message);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: `エラーが発生しました: ${error.message}`, sender: 'system' }])
      }
    }
  }, [inputText, messages, headline, summary])

  const handleRefresh = useCallback(() => {
    setMessages([]);
    setHeadline('会話を開始してください');
    setSummary('まだ会話が始まっていません');
    setError(null);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex h-screen bg-gradient-to-br from-gray-900 to-black text-white ${isFullscreen ? 'w-screen' : 'w-[1024px] mx-auto my-8 rounded-lg shadow-2xl'}`}>
      <div className="flex-1 flex flex-col max-w-2xl">
        <motion.header 
          className="bg-gray-800 p-4 flex justify-between items-center rounded-t-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">AI チャット</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh} className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </motion.header>

        <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-900">
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

      <div className="w-64 bg-gray-800 p-4 flex flex-col space-y-4 rounded-r-lg">
        <Card className="p-4 h-full bg-gray-700 text-white border-none">
          <ConversationSummary headline={headline} summary={summary} />
        </Card>
      </div>
    </div>
  )
}