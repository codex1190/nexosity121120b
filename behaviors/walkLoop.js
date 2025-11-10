module.exports = function walkLoop(bot) {
  const speed = 0.2; // movement speed per tick
  const yaw = 0; // facing direction (0 = East, 90 = South, etc.)

  setInterval(() => {
    if (!bot.entity || !bot.entity.position) return;

    // Calculate forward velocity based on yaw (direction bot is facing)
    const rad = (yaw * Math.PI) / 180;
    const velocity = {
      x: Math.cos(rad) * speed,
      y: 0,
      z: Math.sin(rad) * speed,
    };

    // Update server about our motion (this triggers physics movement)
    bot.queue('set_actor_motion', {
      runtime_entity_id: bot.entity.runtime_id,
      motion: velocity,
    });

    // Predict new position (for client sync)
    const newPos = {
      x: bot.entity.position.x + velocity.x,
      y: bot.entity.position.y,
      z: bot.entity.position.z + velocity.z,
    };

    // Send move_player packet so the server + other clients see it
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

    // Update local bot position so it doesn't desync
    bot.entity.position = newPos;

    console.log('Walking to:', newPos);
  }, 500); // every half-second (adjust for smoothness)
};
