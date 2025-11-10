const { Vec3 } = require('vec3'); // optional for positions if needed

// ---------- Handlers ----------

// 1️⃣ Respawn handler
function respawnIfDead(bot) {
  if (!bot.entity || bot.entity.isDead) {
    bot.chat('I am dead! Respawning...');
    bot.queue('respawn'); // Bedrock respawn packet
    return true;
  }
  return false;
}

// 2️⃣ Lost safety handler (bot in open area or falling)
function handleLostSafety(bot) {
  if (!bot.entity) return false;

  // Example: consider lost if Y < 1 (falling) or exposed at night
  if (bot.entity.position.y < 1) return true;

  return false;
}

// 3️⃣ Hunger handler (eat food if needed)
function handleHunger(bot) {
  if (!bot.inventory || !bot.inventory.slots) return false;

  const foodSlot = bot.inventory.slots.find(
    item => item && item.name && item.name.includes('apple')
  );

  if (foodSlot) {
    bot.chat('Eating food to restore hunger...');
    // send eat packet (pseudo-code, depends on your implementation)
    bot.queue('use_item', { slot: foodSlot.slot });
    return true;
  }

  return false;
}

// 4️⃣ Night safety handler
function handleNightSafety(bot) {
  const currentHour = new Date().getUTCHours(); // placeholder for night check
  if (currentHour >= 18 || currentHour <= 6) {
    // It’s night: seek shelter or stop moving (simplified)
    bot.chat('Night detected, staying safe...');
    return true;
  }
  return false;
}

// 5️⃣ Mob avoidance handler
function handleMobAvoidance(bot) {
  if (!bot.entities) return false;

  const hostile = Object.values(bot.entities).find(
    e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 5
  );

  if (hostile) {
    bot.chat('Mob nearby! Avoiding...');
    // Simple avoidance: turn 180 degrees
    bot.pathYaw = (bot.pathYaw + 180) % 360;
    return true;
  }

  return false;
}

// 6️⃣ Pathing handler (called by behaviorManager)
const walkLoop = require('./walkLoop');
function handlePathing(bot) {
  walkLoop(bot);
}

// ---------- Export handlers ----------
module.exports = {
  respawnIfDead,
  handleLostSafety,
  handleHunger,
  handleNightSafety,
  handleMobAvoidance,
  handlePathing
};
