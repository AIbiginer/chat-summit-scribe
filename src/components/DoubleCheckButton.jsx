import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

const DoubleCheckButton = ({ onDoubleCheck }) => {
  return (
    <Button
      onClick={onDoubleCheck}
      className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      ダブルチェック
    </Button>
  );
};

export default DoubleCheckButton;