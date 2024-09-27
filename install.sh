#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Setting up OpenAI API key..."
node setup.js

echo "Installation complete. You can now run the app with 'npm run dev'"