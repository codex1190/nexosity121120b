const {
  handleNightSafety,
  handleHunger,
  handleMobAvoidance,
  handlePathing,
  respawnIfDead
} = require('./handlers'); // <- correct, points to your handlers file

const walkLoop = require('./walkLoop');

module.exports = function behaviorManager(bot) {
  let activeBehavior = null;
  let cooldown = 0;

  function switchBehavior(name, fn) {
    if (activeBehavior !== name) {
      activeBehavior = name;
      console.log(`[Behavior] Switched to: ${name}`);
    }
    // Always call the function for active behavior
    try { fn(bot); } catch (e) { console.log('Behavior error:', e.message); }
  }

  // Random yaw change for roaming
  setInterval(() => {
    if (activeBehavior === 'pathing') bot.pathYaw = Math.random() * 360;
  }, 5000);

  // Main AI loop
  setInterval(() => {
    if (!bot || !bot.entity) return;

    // Respawn if dead
    if (bot.health <= 0) {
      return switchBehavior('respawn', respawnIfDead);
    }

    const isNight = bot.time && bot.time.isNight;
    const mobsNearby = bot.nearestEntity
      ? bot.nearestEntity(e => e.type === 'mob' && e.distance < 10)
      : null;
    const hungry = bot.food !== undefined && bot.food < 10;

    if (isNight) {
      switchBehavior('nightSafety', handleNightSafety);
    } else if (mobsNearby) {
      switchBehavior('mobAvoidance', handleMobAvoidance);
    } else if (hungry) {
      switchBehavior('hunger', handleHunger);
    } else {
      switchBehavior('pathing', handlePathing);
      // Continuous walking
      walkLoop(bot);
    }

    if (cooldown > 0) cooldown--;

  }, 1000);
};
