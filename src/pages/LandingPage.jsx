import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Enhanced Chat</h1>
      <p className="text-xl mb-8">Experience the power of AI-driven conversations</p>
      <Button 
        onClick={() => navigate('/chat')}
        className="bg-white text-blue-600 hover:bg-blue-100 transition-colors"
      >
        Start Chatting
      </Button>
    </div>
  );
};

export default LandingPage;