// Simple YT Notifier - Basic checker to ensure npm app is working correctly with the dependencies
// Created on April 9th, 2026

const { spawn } = require('child_process');

// Dummy variables to prevent startup crashes
process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/123/abc';
process.env.HUB_SECRET = 'lab_test_secret';
process.env.PORT = '3001';

console.log('Starting basic test of npm application.');

const server = spawn('node', ['index.js'], {env: process.env});

// condition: Application stays alive for 5 seconds
const timer = setTimeout(() => {
  console.log('Success: Application started and remained stable.');
  server.kill();
  process.exit(0);
}, 5000);

// condition: Application crashes/errors before 5 seconds uptime
server.stderr.on('data', (data) => {
  const output = data.toString();
  console.error(`Application Error Output: ${output}`);
  if (output.toLowerCase().includes('error')) {
    clearTimeout(timer);
    server.kill();
    process.exit(1);
  }
});

server.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`Application exited unexpectedly with code ${code}`);
    clearTimeout(timer);
    process.exit(1);
  }
});