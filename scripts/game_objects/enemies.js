// Enemy factory
(function () {
  function createEnemy(isBoss = false, canvasWidth = 800, floorY = 520) {
    const width = isBoss ? 90 : 60;
    const height = isBoss ? 220 : 180;
    const speed = isBoss ? (window.GC ? window.GC.BOSS_SPEED : 1.5) : (window.GC ? window.GC.ENEMY_SPEED : 2);
    const health = isBoss ? (window.GC ? window.GC.BOSS_HEALTH : 300) : (window.GC ? window.GC.ENEMY_HEALTH : 50);
    return {
      get color() { return isBoss ? (window.GC ? window.GC.BOSS_COLOR : '#bf00ff') : (window.GC ? window.GC.ENEMY_COLOR : '#ff073a'); },
      x: canvasWidth - 100,
      y: floorY,
      isAttacking: false,
      facing: 'left',
      action: 'idle',
      width, height, speed, health, maxHealth: health, isBoss, hasHit: false
    };
  }

  window.EnemyFactory = { createEnemy };
})();
