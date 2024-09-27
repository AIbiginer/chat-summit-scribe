# Chat Summit Scribe

AIを活用したリアルタイム会話要約と話題追跡機能を備えた先進的なチャットアプリケーションです。

## 主な機能

- リアルタイムAIチャット
- 動的な会話要約
- 現在の話題追跡
- レスポンシブデザイン

## 必要条件

- Node.js (バージョン14以上)
- npm または yarn
- OpenAI APIキー

## セットアップ

1. リポジトリをクローン：
   ```
   git clone https://github.com/Shintar00/chat-summit-scribe.git
   cd chat-summit-scribe
   ```

2. 依存関係のインストールとセットアップ：

   Windows:
   ```
   install.bat
   ```

   Mac/Linux:
   ```
   chmod +x install.sh
   ./install.sh
   ```

3. プロンプトに従ってOpenAI APIキーを入力。

## アプリケーションの起動

開発モード：
```
npm run dev
```

本番モード：
Windows: `run_production.bat`
Mac/Linux: `./run_production.sh`

ブラウザで`http://localhost:5173`を開いてアクセス。

## 使用方法

1. ランディングページの「チャットを開始」をクリック。
2. メッセージを入力して送信。
3. AIの応答と会話の要約をリアルタイムで確認。

## 注意事項

- このアプリケーションはローカル環境での使用を想定しています。
- APIキーは安全に管理してください。

## 貢献

プルリクエストは歓迎です。大きな変更を行う場合は、まず問題を開いて議論してください。

## ライセンス

[MIT](https://choosealicense.com/licenses/mit/)