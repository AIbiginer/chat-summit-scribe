import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Maximize2, Minimize2, RefreshCw, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import ConversationSummary from './ConversationSummary'

export default function EnhancedChat() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [summaries, setSummaries] = useState([])
  const [conversationFlow, setConversationFlow] = useState([])
  const [currentTopic, setCurrentTopic] = useState('会話を開始してください')
  const [conversationSummary, setConversationSummary] = useState('まだ会話が始まっていません')
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
        }
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling GPT API:', error);
      if (error.response) {
        throw new Error(`API error: ${error.response.status} - ${error.response.data.error.message}`);
      } else if (error.request) {
        throw new Error('No response received from the API. Please check your internet connection.');
      } else {
        throw new Error(`Error setting up the request: ${error.message}`);
      }
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputText('')
      setError(null)
      
      try {
        const aiResponse = await callGPTAPI(inputText);
        const aiMessage = { 
          id: Date.now(), 
          text: aiResponse, 
          sender: 'ai'
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
        
        const topicPrompt = `Based on the following message, what is the main topic being discussed? Respond in 10 words or less: "${inputText}"`;
        const newTopic = await callGPTAPI(topicPrompt);
        setCurrentTopic(newTopic);

        const summaryPrompt = `Summarize the current state of the conversation, including this new message: "${inputText}"`;
        const newSummary = await callGPTAPI(summaryPrompt);
        setConversationSummary(newSummary);

        const guidancePrompt = `Based on the recent conversation, is the following message on topic? If not, suggest how to refocus: "${inputText}"`;
        const guidance = await callGPTAPI(guidancePrompt);
        if (guidance.toLowerCase().includes('not on topic')) {
          setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: guidance, sender: 'ai' }])
        }

        setConversationFlow(prevFlow => [...prevFlow, inputText.slice(0, 20)])
      } catch (error) {
        console.error('Error in message handling:', error);
        setError(error.message);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: `エラーが発生しました: ${error.message}`, sender: 'system' }])
      }
    }
  }, [inputText])

  return (
    <div className={`flex h-screen bg-gray-100 text-gray-800 ${isFullscreen ? 'w-screen' : 'w-[1024px] mx-auto my-8 shadow-xl'}`}>
      <div className="flex-1 flex flex-col max-w-2xl">
        <motion.header 
          className="bg-white border-b border-gray-200 p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-semibold">Enhanced Chat</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </motion.header>

        <ScrollArea className="flex-1 p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.sender === 'system'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200'
                }`}>
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </ScrollArea>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 flex flex-col space-y-4">
        <Card className="p-4 h-1/2">
          <ConversationSummary currentTopic={currentTopic} summary={conversationSummary} />
        </Card>

        <Card className="p-4 h-1/2">
          <h3 className="text-md font-semibold mb-2">会話の流れ</h3>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="flex flex-wrap gap-1">
              {conversationFlow.map((item, index) => (
                <span key={index} className="text-xs bg-gray-200 rounded px-1">{item}</span>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}