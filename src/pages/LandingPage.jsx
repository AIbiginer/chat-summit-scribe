import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Zap, LayoutDashboard } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FileText className="w-10 h-10 text-purple-400" />, title: "リアルタイム要約", description: "会話の要点を即座に把握" },
    { icon: <Zap className="w-10 h-10 text-pink-400" />, title: "トピック分析", description: "重要な話題を自動で抽出" },
    { icon: <LayoutDashboard className="w-10 h-10 text-yellow-400" />, title: "インタラクティブダッシュボード", description: "直感的な情報管理" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          SummitScribe
        </h1>
        <p className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-300">
          AIパワードの会話要約＆トピック分析ツール
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
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 text-xl px-12 py-4 rounded-full shadow-lg"
          >
            始める
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;