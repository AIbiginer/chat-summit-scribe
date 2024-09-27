const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('Welcome to the InsightSphere setup!');

rl.question('Please enter your OpenAI API key: ', (apiKey) => {
  const envContent = `VITE_OPENAI_API_KEY=${apiKey}\n`;

  fs.writeFile(envPath, envContent, (err) => {
    if (err) {
      console.error('Error writing to .env file:', err);
    } else {
      console.log('.env file has been created successfully with your API key.');
    }
    rl.close();
  });
});

rl.on('close', () => {
  console.log('Setup complete. You can now run the application.');
  process.exit(0);
});