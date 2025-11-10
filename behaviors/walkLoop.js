// walkLoop.js
module.exports = function walkLoop(bot) {
  const speed = 0.2; // movement speed per tick
  const yaw = bot.pathYaw !== undefined ? bot.pathYaw : 0; // use current bot yaw

  if (!bot.entity || !bot.entity.position) return;

  // Calculate forward velocity based on yaw
  const rad = (yaw * Math.PI) / 180;
  const velocity = {
    x: Math.cos(rad) * speed,
    y: 0,
    z: Math.sin(rad) * speed,
  };

  // Update server about our motion
  bot.queue('set_actor_motion', {
    runtime_entity_id: bot.entity.runtime_id,
    motion: velocity,
  });

  // Predict new position
  const newPos = {
    x: bot.entity.position.x + velocity.x,
    y: bot.entity.position.y,
    z: bot.entity.position.z + velocity.z,
  };

  // Send move_player packet
  bot.queue('move_player', {
    runtime_entity_id: bot.entity.runtime_id,
    position: newPos,
    pitch: 0,
    yaw: yaw,
    head_yaw: yaw,
    mode: 0,
    on_ground: true,
    ridden_runtime_id: 0,
  });

  // Update local position
  bot.entity.position = newPos;
};
