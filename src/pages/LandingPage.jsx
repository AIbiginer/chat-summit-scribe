import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Zap, LayoutDashboard, Smartphone, Sparkles } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <MessageSquare className="w-10 h-10 text-purple-400" />, title: "AIとスマートな会話", description: "高度なAIとリアルタイムで対話" },
    { icon: <FileText className="w-10 h-10 text-pink-400" />, title: "リアルタイム会話要約", description: "会話の要点を即座に把握" },
    { icon: <Zap className="w-10 h-10 text-yellow-400" />, title: "話題の可視化", description: "重要なトピックを視覚的に表示" },
    { icon: <LayoutDashboard className="w-10 h-10 text-green-400" />, title: "ダッシュボード機能", description: "情報を整理して効率的に表示" },
    { icon: <Smartphone className="w-10 h-10 text-blue-400" />, title: "レスポンシブデザイン", description: "あらゆるデバイスで快適に利用可能" },
    { icon: <Sparkles className="w-10 h-10 text-indigo-400" />, title: "インタラクティブUI", description: "直感的で使いやすいインターフェース" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          次世代AIチャット＆分析
        </h1>
        <p className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-300">
          AIとのインテリジェントな対話、リアルタイム要約、そして洞察に満ちた分析。<br />
          あなたのコミュニケーションを革新的なレベルへ。
        </p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 text-xl px-12 py-4 rounded-full shadow-lg"
          >
            今すぐ体験する
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;