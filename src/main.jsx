import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import forceHttps from './middleware/forceHttps';
import authMiddleware from './middleware/auth';

// Express.jsを使用している場合の例
import express from 'express';
const app = express();

// HTTPSの強制
app.use(forceHttps);

// 認証が必要なルートに対して認証ミドルウェアを適用
app.use('/api', authMiddleware);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Express.jsサーバーの起動（本番環境の場合）
if (process.env.NODE_ENV === 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}