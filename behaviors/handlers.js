// behaviors/handlers.js
const walkLoop = require('./walkLoop');

// Respawn
function respawnIfDead(bot) {
  if (!bot?.entity) return false;
  if (bot.entity.isDead) {
    console.log('Bot is dead, respawning...');
    try { bot.queue('respawn'); } catch(e) { console.log('Respawn failed:', e.message); }
    return true;
  }
  return false;
}

// Lost safety
function handleLostSafety(bot) {
  if (!bot?.entity?.position) return false;
  return bot.entity.position.y < 1;
}

// Hunger (simplified)
function handleHunger(bot) {
  if (!bot.inventory?.slots) return false;
  const foodSlot = Object.values(bot.inventory.slots).find(item => item?.name?.includes('apple'));
  if (foodSlot) {
    console.log('Eating food:', foodSlot.name);
    try { bot.queue('use_item', { slot: foodSlot.slot }); } catch(e) { console.log('Failed to eat:', e.message); }
    return true;
  }
  return false;
}

// Night safety (placeholder)
function handleNightSafety(bot) {
  const hour = new Date().getUTCHours();
  if (hour >= 18 || hour <= 6) {
    console.log('Night detected, staying safe...');
    return true;
  }
  return false;
}

// Mob avoidance
function handleMobAvoidance(bot) {
  if (!bot.entities || !bot?.entity?.position) return false;
  const hostile = Object.values(bot.entities).find(e => e.type === 'mob' && e.position?.distanceTo(bot.entity.position) < 5);
  if (hostile) {
    console.log('Mob nearby! Avoiding...');
    bot.pathYaw = (bot.pathYaw + 180) % 360;
    return true;
  }
  return false;
}

// Pathing
function handlePathing(bot) {
  walkLoop(bot);
}

module.exports = {
  respawnIfDead,
  handleLostSafety,
  handleHunger,
  handleNightSafety,
  handleMobAvoidance,
  handlePathing
};
