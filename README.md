# AI-Powered Chat Application

リアルタイムの会話要約と話題追跡機能を備えた先進的なAI駆動チャットアプリケーションです。このアプリケーションはローカル環境でのみ動作します。

## 主な機能

- リアルタイムAIチャット
- 動的な会話要約
- 現在の話題追跡
- レスポンシブデザイン（ローカル環境のみ）

## 前提条件

- Node.js (バージョン14以上)
- npm または yarn
- OpenAI APIキー
- Git

## クイックスタート

1. リポジトリをクローン：
   ```
   git clone https://github.com/Shintar00/chat-summit-scribe.git
   cd chat-summit-scribe
   ```

2. 依存関係をインストール：
   ```
   npm install
   ```

3. セットアップスクリプトを実行してOpenAI APIキーを設定：
   ```
   node setup.js
   ```
   プロンプトに従ってOpenAI APIキーを入力してください。

4. 開発サーバーを起動：
   ```
   npm run dev
   ```

5. ブラウザで`http://localhost:5173`を開いてアプリケーションにアクセス。

## プロジェクトの更新

プロジェクトを最新の状態に保つには、以下の手順に従ってください：

1. ローカルの変更をコミット：
   ```
   git add .
   git commit -m "ローカルの変更内容を説明するメッセージ"
   ```

2. リモートの変更を取得：
   ```
   git fetch origin
   ```

3. ローカルの main ブランチを更新：
   ```
   git pull origin main
   ```

4. 依存関係を更新：
   ```
   npm install
   ```

5. 開発サーバーを再起動：
   ```
   npm run dev
   ```

## 使用方法

1. ランディングページの「チャットを開始」をクリックしてチャットインターフェースに入る。
2. メッセージを入力してEnterキーを押すか、送信ボタンをクリック。
3. AIが応答し、会話の要約と現在の話題がリアルタイムで更新されます。

## セキュリティ注意事項

このアプリケーションはローカル環境でのみ動作するように設計されています。公開されたURLからのアクセスは制限されています。より堅牢なセキュリティを実装する場合は、バックエンドでの認証システムの導入を検討してください。

## 貢献

貢献は大歓迎です！プルリクエストを送る前に、必ずローカル環境でテストしてください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。