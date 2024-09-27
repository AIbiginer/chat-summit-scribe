import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6 tracking-tight">AI チャットの新時代</h1>
        <p className="text-2xl mb-12 leading-relaxed">
          会話を通じて、新しい発見と洞察を。<br />
          リアルタイムで生成される要約が、対話の本質を捉えます。
        </p>
        <div className="bg-white bg-opacity-10 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6">簡単3ステップ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-4 bg-white text-purple-600 rounded-full w-16 h-16 flex items-center justify-center">1</div>
              <p className="text-lg">チャットを開始</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-4 bg-white text-purple-600 rounded-full w-16 h-16 flex items-center justify-center">2</div>
              <p className="text-lg">AIと会話</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-4 bg-white text-purple-600 rounded-full w-16 h-16 flex items-center justify-center">3</div>
              <p className="text-lg">要約を確認</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/chat')}
          className="bg-white text-purple-600 hover:bg-purple-100 transition-colors text-xl px-12 py-4 rounded-full shadow-lg"
        >
          チャットを始める
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;