const { createClient } = require('bedrock-protocol');
const behaviorManager = require('./behaviors/behaviorManager');

const bot = createClient({
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  offline: true,
  version: '1.21.120',
  default_command_permission: 0, // optional
  gamemode: 0 // 0 = Survival
});

bot.on('spawn', () => {
  console.log('Bot spawned! Starting AI behaviors...');
  behaviorManager(bot);
});

bot.on('text', (packet) => console.log(`[Server] ${packet.message}`));
bot.on('error', (err) => console.error('Bot error:', err));
bot.on('kick', (packet) => console.log('Kicked from server:', packet.reason));
