const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('Welcome to the InsightSphere setup!');

const promptApiKey = (currentApiKey = '') => {
  const currentKeyMessage = currentApiKey ? `現在のOpenAI APIキー: ${currentApiKey}\n` : '';
  rl.question(`${currentKeyMessage}OpenAI APIキーを入力してください（変更しない場合は空欄）: `, (apiKey) => {
    if (apiKey.trim() === '' && currentApiKey) {
      apiKey = currentApiKey;
    }
    const envContent = `VITE_OPENAI_API_KEY=${apiKey.trim()}\n`;

    fs.writeFile(envPath, envContent, (err) => {
      if (err) {
        console.error('Error writing to .env file:', err);
      } else {
        console.log('.env file has been created/updated successfully with your API key.');
      }
      rl.close();
    });
  });
};

if (fs.existsSync(envPath)) {
  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading .env file:', err);
      promptApiKey();
    } else {
      const match = data.match(/VITE_OPENAI_API_KEY=(.*)/);
      const currentApiKey = match ? match[1].trim() : '';
      promptApiKey(currentApiKey);
    }
  });
} else {
  promptApiKey();
}

rl.on('close', () => {
  console.log('Setup complete. You can now run the application.');
  process.exit(0);
});