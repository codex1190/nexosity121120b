// behaviorManager.js
const walkLoop = require('./walkLoop');       // inside behaviors/
const {
  handleNightSafety,
  handleLostSafety,
  handleHunger,
  handleMobAvoidance,
  respawnIfDead
} = require('./handlers');                     // inside behaviors/

module.exports = function behaviorManager(bot) {
  let activeBehavior = null;
  let cooldown = 0;

  function switchBehavior(name, fn) {
    if (activeBehavior !== name) {
      activeBehavior = name;
      fn();
      console.log(`[Behavior] Switched to: ${name}`);
    }
  }

  // Randomly change pathing direction every 5s
  setInterval(() => {
    if (activeBehavior === 'pathing') bot.pathYaw = Math.random() * 360;
  }, 5000);

  // Main AI loop
  setInterval(() => {
    if (!bot || !bot.entity) return;

    if (cooldown > 0) {
      cooldown--;
      return;
    }

    // 1️⃣ Respawn if dead
    if (respawnIfDead(bot)) {
      switchBehavior('respawn', () => console.log('Respawning...'));
      cooldown = 20;
      return;
    }

    // 2️⃣ Lost safety
    if (handleLostSafety(bot)) {
      switchBehavior('lostSafety', () => console.log('Finding safe spot...'));
      cooldown = 20;
      return;
    }

    // 3️⃣ Hunger
    if (handleHunger(bot)) {
      switchBehavior('hunger', () => console.log('Eating food...'));
      cooldown = 20;
      return;
    }

    // 4️⃣ Night safety
    if (handleNightSafety(bot)) {
      switchBehavior('nightSafety', () => console.log('Seeking safe place at night...'));
      cooldown = 20;
      return;
    }

    // 5️⃣ Mob avoidance
    if (handleMobAvoidance(bot)) {
      switchBehavior('mobAvoidance', () => console.log('Avoiding mobs...'));
      cooldown = 20;
      return;
    }

    // 6️⃣ Pathing / walking
    if (activeBehavior !== 'pathing') {
      switchBehavior('pathing', () => console.log('Starting pathing...'));
    }

    if (activeBehavior === 'pathing') {
      walkLoop(bot); // continuously move bot
      cooldown = 0;
    }

  }, 50); // 20 ticks per second
};
