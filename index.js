const walkLoop = require('./walkLoop');

// ---------- Respawn handler ----------
function respawnIfDead(bot) {
  if (!bot.entity) return false;

  // Bedrock bots have isDead property
  if (bot.entity.isDead) {
    console.log('Bot is dead, respawning...');
    // Send respawn packet
    try {
      bot.queue('respawn');
    } catch (err) {
      console.log('Respawn failed:', err.message);
    }
    return true;
  }

  return false;
}

// ---------- Lost safety handler ----------
function handleLostSafety(bot) {
  if (!bot.entity || !bot.entity.position) return false;

  // Example: lost if below Y=1 (falling) or falling off map
  if (bot.entity.position.y < 1) return true;

  return false;
}

// ---------- Hunger handler ----------
function handleHunger(bot) {
  // Bedrock bots don’t always track hunger directly
  if (!bot.inventory || !bot.inventory.slots) return false;

  // Find first food (apple) in inventory
  const foodSlot = Object.values(bot.inventory.slots).find(
    item => item && item.name && item.name.includes('apple')
  );

  if (foodSlot) {
    console.log('Eating food:', foodSlot.name);
    try {
      // Send use_item packet
      bot.queue('use_item', { slot: foodSlot.slot });
    } catch (err) {
      console.log('Failed to eat:', err.message);
    }
    return true;
  }

  return false;
}

// ---------- Night safety handler ----------
function handleNightSafety(bot) {
  // Simplified: use server time if available
  // Placeholder: just use local UTC time for demo
  const hour = new Date().getUTCHours();
  if (hour >= 18 || hour <= 6) {
    // Nighttime
    console.log('Night detected, staying safe...');
    return true;
  }
  return false;
}

// ---------- Mob avoidance handler ----------
function handleMobAvoidance(bot) {
  if (!bot.entities || !bot.entity || !bot.entity.position) return false;

  // Find hostile mobs within 5 blocks
  const hostile = Object.values(bot.entities).find(
    e =>
      e.type === 'mob' &&
      e.position &&
      e.position.distanceTo(bot.entity.position) < 5
  );

  if (hostile) {
    console.log('Mob nearby! Avoiding...');
    // Turn 180 degrees to avoid
    bot.pathYaw = (bot.pathYaw + 180) % 360;
    return true;
  }

  return false;
}

// ---------- Pathing handler ----------
function handlePathing(bot) {
  try {
    walkLoop(bot);
  } catch (err) {
    console.log('Pathing failed:', err.message);
  }
}

// ---------- Export all handlers ----------
module.exports = {
  respawnIfDead,
  handleLostSafety,
  handleHunger,
  handleNightSafety,
  handleMobAvoidance,
  handlePathing
};
