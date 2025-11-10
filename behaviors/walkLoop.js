// behaviors/walkLoop.js
module.exports = function walkLoop(bot) {
  if (!bot.entity || !bot.entity.position) return;

  const speed = 0.2; // movement speed
  const yaw = bot.pathYaw || Math.random() * 360;
  const rad = (yaw * Math.PI) / 180;

  const velocity = {
    x: Math.cos(rad) * speed,
    y: 0,
    z: Math.sin(rad) * speed
  };

  const pos = bot.entity.position;
  const newPos = {
    x: pos.x + velocity.x,
    y: pos.y,
    z: pos.z + velocity.z
  };

  try {
    // Update server about bot motion
    bot.queue('set_actor_motion', {
      runtime_entity_id: bot.entity.runtime_id,
      motion: velocity
    });

    bot.queue('move_player', {
      runtime_entity_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: yaw,
      head_yaw: yaw,
      mode: 0, // normal
      on_ground: true,
      ridden_runtime_id: 0
    });

    bot.entity.position = newPos;
  } catch (err) {
    console.log('Walk error:', err.message);
  }
};
