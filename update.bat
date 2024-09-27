@echo off
echo Updating project...
git pull
npm install
node update.js

echo Update complete. You can now run the app with 'npm run dev'
pause