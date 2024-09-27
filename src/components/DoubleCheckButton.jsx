import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

const DoubleCheckButton = ({ onDoubleCheck, disabled }) => {
  return (
    <Button
      onClick={onDoubleCheck}
      disabled={disabled}
      className={`mt-4 ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      ダブルチェック
    </Button>
  );
};

export default DoubleCheckButton;