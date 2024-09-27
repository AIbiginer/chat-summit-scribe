const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('プロジェクトの更新を開始します...');

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

  // .env ファイルが存在しない場合は作成
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('.env ファイルが見つかりません。新しく作成します。');
    fs.writeFileSync(envPath, 'VITE_OPENAI_API_KEY=your_openai_api_key_here\n');
    console.log('.env ファイルを作成しました。OpenAI API キーを設定してください。');
  }

  console.log('プロジェクトの更新が完了しました。');
} catch (error) {
  console.error('更新中にエラーが発生しました:', error.message);
}