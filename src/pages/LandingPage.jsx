import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center"
      >
        <h1 className="text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI駆動の対話と洞察
        </h1>
        <p className="text-2xl mb-12 leading-relaxed text-gray-300">
          AIとチャットし、リアルタイムで会話の要約と洞察を得る。<br />
          あなたの対話を次のレベルへ。
        </p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 mb-12 shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-6 text-purple-300">主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MessageSquare className="w-12 h-12 mb-4 text-purple-400" />, text: "AIとのインテリジェントな対話" },
              { icon: <FileText className="w-12 h-12 mb-4 text-pink-400" />, text: "リアルタイムの会話要約" },
              { icon: <Zap className="w-12 h-12 mb-4 text-yellow-400" />, text: "主要な話題の可視化" }
            ].map(({ icon, text }, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                {icon}
                <p className="text-lg text-gray-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 text-xl px-12 py-4 rounded-full shadow-lg"
          >
            チャットを始める
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;