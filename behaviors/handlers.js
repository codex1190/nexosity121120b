const walkLoop = require('./walkLoop');

// Pathing / walking
function handlePathing(bot) {
  walkLoop(bot);
}

// Other dummy handlers (for completeness)
function respawnIfDead(bot) { return false; }
function handleLostSafety(bot) { return false; }
function handleHunger(bot) { return false; }
function handleNightSafety(bot) { return false; }
function handleMobAvoidance(bot) { return false; }

module.exports = {
  handlePathing,
  respawnIfDead,
  handleLostSafety,
  handleHunger,
  handleNightSafety,
  handleMobAvoidance
};
