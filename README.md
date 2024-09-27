# 拡張チャットアプリケーション

このプロジェクトは、会話の要約やトピック追跡などの高度な機能を備えたAI駆動のチャットアプリケーションです。

## インストールとセットアップ

以下の手順に従って、プロジェクトをローカルで設定してください：

1. リポジトリをクローンします：
   ```
   git clone https://github.com/Shintar00/chat-summit-scribe.git
   cd chat-summit-scribe
   ```

2. 依存関係をインストールします：
   ```
   npm install
   ```

3. ルートディレクトリに`.env`ファイルを作成し、OpenAI APIキーを追加します：
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. 開発サーバーを起動します：
   ```
   npm run dev
   ```

5. コマンドプロンプトに表示されたURLをクリックしてブラウザで開き、アプリケーションを表示します。

## 使用方法

- ランディングページの「チャットを開始」をクリックしてチャットページに移動します。
- 入力フィールドにメッセージを入力し、Enterキーを押すか送信ボタンをクリックします。
- AIが応答し、会話の要約と現在のトピックがリアルタイムで更新されます。

## アップデート方法

1. 最新の変更を取得します：
   ```
   git pull origin main
   ```

2. 依存関係を更新します：
   ```
   npm install
   ```

3. 環境変数を確認し、必要に応じて`.env`ファイルを更新します。

4. 開発サーバーを再起動します：
   ```
   npm run dev
   ```

5. アプリケーションが正常に動作することを確認します。

## 機能

- リアルタイムAI駆動チャット
- 会話の要約
- 現在のトピック追跡
- レスポンシブデザイン

## 貢献

貢献は歓迎します！お気軽にプルリクエストを提出してください。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。