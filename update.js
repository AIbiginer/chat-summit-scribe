const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('プロジェクトの更新とインストールを開始します...');

try {
  // Git の変更をフェッチ
  console.log('リモートの変更をフェッチしています...');
  execSync('git fetch origin', { stdio: 'inherit' });

  // ローカルの main ブランチを更新
  console.log('ローカルの main ブランチを更新しています...');
  execSync('git pull origin main', { stdio: 'inherit' });

  // 依存関係を更新
  console.log('依存関係を更新しています...');
  execSync('npm install', { stdio: 'inherit' });

  // .env ファイルの確認と作成
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('.env ファイルが見つかりません。新しく作成します。');
    fs.writeFileSync(envPath, 'VITE_OPENAI_API_KEY=\n');
  }

  // OpenAI API キーの確認と設定
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = envContent.match(/VITE_OPENAI_API_KEY=(.*)/);
  const currentApiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

  rl.question(`現在のOpenAI APIキー: ${currentApiKey}\n新しいAPIキーを入力してください（変更しない場合は空欄）: `, (newApiKey) => {
    if (newApiKey.trim() !== '') {
      const updatedEnvContent = envContent.replace(
        /VITE_OPENAI_API_KEY=.*/,
        `VITE_OPENAI_API_KEY=${newApiKey.trim()}`
      );
      fs.writeFileSync(envPath, updatedEnvContent);
      console.log('OpenAI APIキーが更新されました。');
    } else {
      console.log('OpenAI APIキーは変更されませんでした。');
    }

    console.log('プロジェクトの更新とインストールが完了しました。');
    rl.close();
  });
} catch (error) {
  console.error('更新とインストール中にエラーが発生しました:', error.message);
  rl.close();
}