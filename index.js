const { createClient } = require('bedrock-protocol');
const behaviorManager = require('./behaviors/behaviorManager');

// Create bot
const bot = createClient({
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  version: '1.21.120',   // Minecraft Bedrock version
});

// Bot spawned
bot.on('spawn', () => {
  console.log('Bot spawned! Starting AI behaviors...');
  behaviorManager(bot);
});

// Optional server logging
bot.on('text', packet => console.log(`[Server] ${packet.message}`));
bot.on('error', err => console.log('Bot error:', err));
bot.on('kick', packet => console.log('Kicked:', packet.reason));
