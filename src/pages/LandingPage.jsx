import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Zap, LayoutDashboard } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import AnimatedBackground from '../components/AnimatedBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FileText className="w-10 h-10 text-indigo-400" />, title: "リアルタイム要約", description: "会話の本質を瞬時に把握" },
    { icon: <Zap className="w-10 h-10 text-fuchsia-400" />, title: "トピック分析", description: "重要ポイントを自動抽出" },
    { icon: <LayoutDashboard className="w-10 h-10 text-amber-400" />, title: "直感的ダッシュボード", description: "情報を効率的に管理" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl w-full text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500">
          インサイトスフィア
        </h1>
        <p className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-200">
          AI駆動の会話分析＆洞察抽出ツール
        </p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
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
            onClick={() => navigate('/analyzer')}
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white transition-all duration-300 text-xl px-12 py-4 rounded-full shadow-lg"
          >
            分析を始める
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;