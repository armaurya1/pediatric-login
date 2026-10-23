const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 1. Read .env file if present
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// 2. Check EXPO_TOKEN
const token = process.env.EXPO_TOKEN;
if (!token || token === 'paste_your_expo_access_token_here' || token.trim() === '') {
  console.warn('\x1b[33m%s\x1b[0m', '⚠ WARNING: EXPO_TOKEN is empty in your .env file!');
  console.log('👉 Create or copy your Expo access token from: https://expo.dev/settings/access-tokens');
  console.log('👉 Paste it into the .env file: EXPO_TOKEN=your_token_here\n');
  console.log('Proceeding with interactive EAS login...\n');
} else {
  console.log('\x1b[32m%s\x1b[0m', '✓ EXPO_TOKEN loaded safely from .env.');
}

console.log('\x1b[36m%s\x1b[0m', '🚀 Submitting Android APK build to EAS (profile: preview)...');

// 3. Run EAS build
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';
const fullCommand = `${npxCmd} eas-cli build --platform android --profile preview`;

const child = spawn(fullCommand, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
