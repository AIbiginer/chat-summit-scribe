# インサイトスフィア (InsightSphere)

AIを活用したリアルタイム会話要約と話題追跡機能を備えた先進的なチャットアプリケーションです。

## 主な機能

- リアルタイムAIチャット
- 動的な会話要約
- 現在の話題追跡
- ハルシネーションチェック機能
- フォローアップ質問生成
- レスポンシブデザイン

## 必要条件

- Node.js (バージョン14以上)
- npm または yarn
- OpenAI APIキー

## セットアップ

1. リポジトリをクローン：
   ```
   git clone https://github.com/yourusername/insightsphere.git
   cd insightsphere
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

3. `.env`ファイルを作成し、OpenAI APIキーを設定：
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   **重要**: `.env`ファイルをGitにコミットしないでください。このファイルには機密情報が含まれています。

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

1. ランディングページの「分析を始める」をクリック。
2. 質問や話題を入力して分析。
3. AIの応答、要約、重要ポイントをリアルタイムで確認。
4. 必要に応じてフォローアップオプションを選択し、詳細情報を取得。

## 更新

プロジェクトを最新の状態に保つには：

Windows: `update.bat`
Mac/Linux: `./update.sh`

このスクリプトは、GitリポジトリのPull、依存関係の更新、OpenAI APIキーの確認を行います。

## セキュリティに関する注意

- `.env`ファイルをGitリポジトリにコミットしないでください。
- APIキーは安全に管理し、定期的に更新することをお勧めします。
- 公開環境にデプロイする際は、適切なセキュリティ対策を講じてください。

## 注意事項

- このアプリケーションはローカル環境での使用を想定しています。
- AIの回答には常に批判的な目を向け、必要に応じてダブルチェック機能を使用してください。

## 貢献

プルリクエストは歓迎です。大きな変更を行う場合は、まず問題を開いて議論してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 開発状況

このプロジェクトは現在開発中です。バグや未実装の機能がある可能性があります。問題を発見した場合は、Issueを開いてご報告ください。

## 連絡先

質問や提案がある場合は、[Issueを開く](https://github.com/yourusername/insightsphere/issues)か、[メール](mailto:your.email@example.com)でお問い合わせください。