import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, ChevronLeft, ChevronRight, Maximize2, Minimize2, X, RefreshCw, Search, AlertCircle, Trash2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import ConversationMindMap from './ConversationMindMap'

export default function EnhancedChat() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState('')
  const [summaries, setSummaries] = useState([])
  const [conversationFlow, setConversationFlow] = useState([])
  const [mindMapData, setMindMapData] = useState({ name: 'Conversation', children: [] })
  const chatEndRef = useRef(null)

  const callGPTAPI = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4-mini",
        messages: [{ role: "user", content: prompt }],
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
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling GPT API:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputText('')
      
      try {
        const aiResponse = await callGPTAPI(inputText);
        const aiMessage = { 
          id: Date.now(), 
          text: aiResponse, 
          sender: 'ai'
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
        
        const summaryPrompt = `Summarize the following message in one sentence: "${inputText}"`;
        const summary = await callGPTAPI(summaryPrompt);
        const newSummary = {
          id: Date.now(),
          text: summary,
          theme
        }
        setSummaries(prevSummaries => [...prevSummaries, newSummary])

        const guidancePrompt = `Based on the recent conversation, is the following message on topic? If not, suggest how to refocus: "${inputText}"`;
        const guidance = await callGPTAPI(guidancePrompt);
        if (guidance.toLowerCase().includes('not on topic')) {
          setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: guidance, sender: 'ai' }])
        }

        setConversationFlow(prevFlow => [...prevFlow, inputText.slice(0, 20)])
        updateMindMap(summary, theme)
      } catch (error) {
        console.error('Error in message handling:', error);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Sorry, an error occurred while processing your message.', sender: 'ai' }])
      }
    }
  }, [inputText, theme])

  const updateMindMap = (summary, theme) => {
    setMindMapData(prevData => {
      const newData = { ...prevData };
      const themeNode = newData.children.find(child => child.name === theme);
      if (themeNode) {
        themeNode.children = [...(themeNode.children || []), { name: summary }];
      } else {
        newData.children.push({ name: theme, children: [{ name: summary }] });
      }
      return newData;
    });
  };

  const handleMindMapUpdate = () => {
    setMindMapData(prevData => ({ ...prevData }));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`flex h-screen bg-gray-100 text-gray-800 ${isFullscreen ? 'w-screen' : 'w-[1280px] mx-auto my-8 shadow-xl'}`}>
      <div className="flex-1 flex flex-col">
        <motion.header 
          className="bg-white border-b border-gray-200 p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">Enhanced Chat</h1>
            <Input 
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter theme..."
              className="w-48"
            />
          </div>
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
                <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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
        </div>
      </div>

      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Summaries</h2>
        <ScrollArea className="flex-1">
          {summaries.map(summary => (
            <div key={summary.id} className="mb-2 p-2 bg-white rounded shadow">
              <span className="text-xs font-semibold text-blue-500">{summary.theme}</span>
              <p className="text-sm">{summary.text}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Conversation Flow</h3>
          <div className="flex flex-wrap gap-1">
            {conversationFlow.map((item, index) => (
              <span key={index} className="text-xs bg-gray-200 rounded px-1">{item}</span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Mind Map</h3>
          <ConversationMindMap data={mindMapData} onUpdate={handleMindMapUpdate} />
        </div>
      </div>
    </div>
  )
}