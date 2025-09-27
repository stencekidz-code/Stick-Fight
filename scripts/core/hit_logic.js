// Drawing helpers and hit detection utilities
(function () {
  function drawCharacter(ctx, char) {
    ctx.fillStyle = char.color;
    ctx.beginPath();
    // Head
    ctx.arc(char.x, char.y - char.height / 2 - 10, 20, 0, Math.PI * 2, false);
    ctx.fill();
    // Body + limbs
    ctx.beginPath();
    ctx.moveTo(char.x, char.y - char.height / 2 + 10);
    ctx.lineTo(char.x, char.y);
    // Legs
    ctx.moveTo(char.x, char.y);
    ctx.lineTo(char.x - 40, char.y + char.height / 2);
    ctx.moveTo(char.x, char.y);
    ctx.lineTo(char.x + 40, char.y + char.height / 2);
    // Arms
    ctx.moveTo(char.x, char.y - char.height / 4);
    ctx.lineTo(char.x - 60, char.y - char.height / 4 - 20);
    ctx.moveTo(char.x, char.y - char.height / 4);
    ctx.lineTo(char.x + 60, char.y - char.height / 4 - 20);
    ctx.strokeStyle = char.color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function rectsIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function playerAttackHit(player, enemy) {
    let px = player.facing === 'right' ? player.x + 40 : player.x - 80;
    let py = player.y - player.height / 2 - 20;
    return rectsIntersect(px, py, 40, 20, enemy.x - enemy.width / 2, enemy.y - enemy.height, enemy.width, enemy.height);
  }

  function enemyAttackHit(enemy, player) {
    let ex = enemy.facing === 'right' ? enemy.x + 40 : enemy.x - 80;
    let ey = enemy.y - enemy.height / 2 - 20;
    return rectsIntersect(ex, ey, 40, 20, player.x - player.width / 2, player.y - player.height, player.width, player.height);
  }

  window.HitLogic = { drawCharacter, playerAttackHit, enemyAttackHit };
})();
