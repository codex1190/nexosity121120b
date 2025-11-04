const { createClient } = require('bedrock-protocol');
const express = require('express');
const fs = require('fs');

// Load behavior functions
const { handleNightSafety, handleHunger, handleMobAvoidance, handlePathing, respawnIfDead } = require('./behaviors');
const walkLoop = require('./behaviors/walkLoop');

// Create a basic Express server to keep the bot alive
const app = express();
app.get('/', (_, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('Keep-alive server running on port 3000'));

// Create bot

    const { createClient } = require('bedrock-protocol');

const config = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  offline: true,
  version: '1.21.120'
};

const { createClient } = require('bedrock-protocol');

const config = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  offline: true,
  version: '1.21.120'
};

let bot;
let reconnectTimeout = null;

function startBot() {
  console.log('[BOT] Starting connection...');

  try {
    bot = createClient(config);
  } catch (e) {
    console.error('[BOT] Failed to create client:', e);
    return scheduleReconnect();
  }

  bot.on('join', () => {
    console.log('[BOT] ✅ Connected to server.');
  });

  bot.on('disconnect', (packet) => {
    console.log('[BOT] ❌ Disconnected:', packet);
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.error('[BOT] ⚠️ Error:', err.message);
    scheduleReconnect();
  });

  bot.on('close', () => {
    console.log('[BOT] Connection closed.');
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  console.log('[BOT] Reconnecting in 10 seconds...');
  reconnectTimeout = setTimeout(() => {
    startBot();
  }, 10000);
}

// Prevent app from crashing on uncaught errors
process.on('uncaughtException', (err) => {
  console.error('[BOT] Uncaught exception:', err);
  scheduleReconnect();
});

process.on('unhandledRejection', (reason) => {
  console.error('[BOT] Unhandled rejection:', reason);
  scheduleReconnect();
});

// Start first connection
startBot();

let isNight = false;

// Bot event handlers
bot.on('spawn', () => {
  console.log('Noxell joined the server!');
  console.log('Noxell spawned! Starting behaviors...');

  walkLoop(bot);
  handlePathing(bot);
});

bot.on('time', (packet) => {
  const time = packet.time;
  isNight = time > 13000;
});

bot.on('update_attributes', () => {
  handleHunger(bot);
});

bot.on('mob_spawn', () => {
  handleMobAvoidance(bot);
});

bot.on('death_info', () => {
  respawnIfDead(bot);
});

// Night safety check every 10 seconds
setInterval(() => {
  if (isNight) {
    handleNightSafety(bot);
  }
}, 10000);
