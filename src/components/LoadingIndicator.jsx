import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      <p className="mt-2 text-gray-300">分析中です。しばらくお待ちください...</p>
    </div>
  );
};

export default LoadingIndicator;