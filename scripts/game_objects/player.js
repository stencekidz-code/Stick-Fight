// Simple player factory
(function () {
  function createPlayer(opts = {}) {
    return Object.assign({
      x: 100,
      y: 100,
      speed: window.GC ? window.GC.PLAYER_SPEED : 4,
      velocityY: 0,
      hairColor: '#ffdd00',
      isGrounded: false,
      width: 60,
      height: 180,
      isAttacking: false,
      facing: 'right',
      health: window.GC ? window.GC.PLAYER_MAX_HEALTH : 100,
      maxHealth: window.GC ? window.GC.PLAYER_MAX_HEALTH : 100,
      color: window.GC ? window.GC.PLAYER_COLOR : '#00ff41',
      coins: 0,
    }, opts);
  }

  window.PlayerFactory = { createPlayer };
})();
