import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">AI チャットアシスタントへようこそ</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        AIとの対話を通じて、新しい発見と洞察を得ましょう。
        会話の要約と見出しがリアルタイムで生成され、対話の本質を捉えます。
      </p>
      <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">使い方</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>「チャットを開始」ボタンをクリックしてチャット画面に移動</li>
          <li>メッセージを入力して送信</li>
          <li>AIからの返答を受け取り、会話を続ける</li>
          <li>画面右側で自動生成される見出しと要約を確認</li>
          <li>会話を重ねるごとに更新される要約で、対話の流れを把握</li>
        </ol>
      </div>
      <Button 
        onClick={() => navigate('/chat')}
        className="bg-white text-blue-600 hover:bg-blue-100 transition-colors text-lg px-8 py-3"
      >
        チャットを開始
      </Button>
    </div>
  );
};

export default LandingPage;