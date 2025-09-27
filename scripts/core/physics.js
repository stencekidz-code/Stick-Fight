// Physics module — handles gravity and player movement updates
(function () {
  function applyPhysics(player, keys, floor) {
    if (keys.ArrowUp && player.isGrounded) {
      player.velocityY = window.GC.PLAYER_JUMP_STRENGTH;
      player.isGrounded = false;
    }
    if (keys.ArrowLeft) { player.x -= player.speed; player.facing = 'left'; }
    if (keys.ArrowRight) { player.x += player.speed; player.facing = 'right'; }

    player.velocityY += window.GC.GRAVITY;
    player.y += player.velocityY;

    // Bounds and floor
    if (player.x < player.width / 2) { player.x = player.width / 2; }
    if (player.x > window.canvasWidth - player.width / 2) { player.x = window.canvasWidth - player.width / 2; }
    if (player.y > floor) {
      player.y = floor;
      player.velocityY = 0;
      player.isGrounded = true;
    }
  }

  window.Physics = { applyPhysics };
})();
