import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
          次世代AI対話体験
        </h1>
        <p className="text-2xl mb-12 leading-relaxed text-gray-300">
          洗練された会話を通じて、新たな知見と洞察を獲得。<br />
          リアルタイムで生成される要約が、対話の本質を捉えます。
        </p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 mb-12 shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-6 text-purple-300">3ステップで始める</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, text: "チャットを開始" },
              { step: 2, text: "AIと対話" },
              { step: 3, text: "洞察を得る" }
            ].map(({ step, text }) => (
              <motion.div 
                key={step}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text rounded-full w-16 h-16 flex items-center justify-center border-2 border-purple-500">
                  {step}
                </div>
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
            対話を始める
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;