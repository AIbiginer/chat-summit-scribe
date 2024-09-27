'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, ChevronLeft, ChevronRight, Maximize2, Minimize2, X, RefreshCw, Search, AlertCircle, Trash2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// ... (既存のインターフェースはそのまま)

const themes: Theme[] = [
  { name: 'General Conversation', categories: ['Topics', 'Questions', 'Insights'] },
  { name: 'Technical Support', categories: ['Issues', 'Solutions', 'Follow-ups'] },
  { name: 'Creative Writing', categories: ['Characters', 'Plot Points', 'Settings'] },
  { name: 'Project Management', categories: ['Tasks', 'Deadlines', 'Resources'] },
]

export default function EnhancedChat() {
  // ... (既存のstate定義はそのまま)

  const callGPTAPI = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: prompt,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error calling GPT API:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim()) {
      const newMessage: Message = { id: Date.now(), text: inputText, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputText('')
      
      try {
        const aiResponse = await callGPTAPI(inputText);
        const aiMessage: Message = { 
          id: Date.now(), 
          text: aiResponse, 
          sender: 'ai'
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
        
        const summaryPrompt = `Summarize the following message in one sentence: "${inputText}"`;
        const summary = await callGPTAPI(summaryPrompt);
        const category = selectedTheme ? selectedTheme.categories[Math.floor(Math.random() * selectedTheme.categories.length)] : 'General'
        const newSummary = {
          id: Date.now(),
          text: summary,
          category
        }
        setSummaries(prevSummaries => [...prevSummaries, newSummary])

        const guidancePrompt = `Based on the recent conversation, is the following message on topic? If not, suggest how to refocus: "${inputText}"`;
        const guidance = await callGPTAPI(guidancePrompt);
        if (guidance.toLowerCase().includes('not on topic')) {
          setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: guidance, sender: 'ai' }])
        }

        setConversationFlow(prevFlow => [...prevFlow, inputText.slice(0, 20)])
      } catch (error) {
        console.error('Error in message handling:', error);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Sorry, an error occurred while processing your message.', sender: 'ai' }])
      }
    }
  }, [inputText, selectedTheme])

  // ... (残りの関数とJSXはそのまま)

  return (
    <div className={`flex h-screen bg-gray-100 text-gray-800 ${isFullscreen ? 'w-screen' : 'w-[1280px] mx-auto my-8 shadow-xl'}`}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          className="bg-white border-b border-gray-200 p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">Enhanced Chat</h1>
            {/* ... (残りのヘッダー内容) */}
          </div>
          {/* ... (残りのヘッダー内容) */}
        </motion.header>

        {/* ... (残りのJSXコンテンツ) */}
      </div>

      {/* ... (サイドバーと他のコンポーネント) */}
    </div>
  )
}