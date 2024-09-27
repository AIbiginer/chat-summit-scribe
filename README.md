2024/9　現在多言語が機能していません。インタフェースは日本語のみ対応しています。

# インサイトスフィア (InsightSphere)

AIを活用したリアルタイム会話要約と話題追跡機能を備えた先進的なチャットアプリケーションです。

## 主な機能

- リアルタイムAIチャット
- 動的な会話要約
- 現在の話題追跡
- ハルシネーションチェック機能
- フォローアップ質問生成
- レスポンシブデザイン
- 多言語対応

## 非営利プロジェクト

このプロジェクトは非営利目的で開発されており、マネタイズの意図はありません。教育目的や研究目的での利用を想定しています。

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

## コントリビューション

プロジェクトへの貢献を歓迎します！フォークを作成し、改善案やバグ修正を提案してください。
大きな変更を行う場合は、まずIssueを開いて議論することをお勧めします。

## コミュニケーション

質問、提案、バグ報告は、GitHubのIssueを通じて行ってください。
プロジェクトに関するディスカッションはGitHub Discussionsを活用してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 開発状況

このプロジェクトは現在開発中です。バグや未実装の機能がある可能性があります。問題を発見した場合は、Issueを開いてご報告ください。

---

September 2024: The multilingual function is currently not working. The interface is only available in Japanese.

# InsightSphere

An advanced chat application featuring AI-powered real-time conversation summarization and topic tracking.

## Key Features

- Real-time AI chat
- Dynamic conversation summarization
- Current topic tracking
- Hallucination check functionality
- Follow-up question generation
- Responsive design
- Multi-language support

## Non-Profit Project

This project is developed for non-profit purposes and is not intended for monetization. It is designed for educational and research purposes.

## Requirements

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/insightsphere.git
   cd insightsphere
   ```

2. Install dependencies and set up:

   Windows:
   ```
   install.bat
   ```

   Mac/Linux:
   ```
   chmod +x install.sh
   ./install.sh
   ```

3. Create a `.env` file and set your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   **Important**: Do not commit the `.env` file to Git. It contains sensitive information.

## Running the Application

Development mode:
```
npm run dev
```

Production mode:
Windows: `run_production.bat`
Mac/Linux: `./run_production.sh`

Access the application by opening `http://localhost:5173` in your browser.

## Usage

1. Click "Start Analysis" on the landing page.
2. Enter a question or topic for analysis.
3. View AI responses, summaries, and key points in real-time.
4. Select follow-up options as needed for more detailed information.

## Updating

To keep the project up-to-date:

Windows: `update.bat`
Mac/Linux: `./update.sh`

This script performs a Git repository pull, updates dependencies, and checks the OpenAI API key.

## Security Notes

- Do not commit the `.env` file to the Git repository.
- Manage API keys securely and update them regularly.
- Implement appropriate security measures when deploying to a public environment.

## Important Notes

- This application is intended for use in a local environment.
- Always approach AI responses critically and use the double-check feature when necessary.

## Contributing

Contributions to the project are welcome! Feel free to fork the repository and propose improvements or bug fixes.
For major changes, please open an Issue first to discuss what you would like to change.

## Communication

For questions, suggestions, or bug reports, please open an Issue on GitHub.
Use GitHub Discussions for project-related discussions.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Development Status

This project is currently under development. There may be bugs or unimplemented features. If you encounter any issues, please open an Issue to report them.
