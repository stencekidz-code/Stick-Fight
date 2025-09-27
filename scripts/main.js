// Main game wiring
(function () {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	const titleScreen = document.getElementById('titleScreen');
	const easyBtn = document.getElementById('easyBtn');
	const mediumBtn = document.getElementById('mediumBtn');
	const hardBtn = document.getElementById('hardBtn');
	const coinCounter = document.getElementById('coin-counter');

	let gameState = 'titleScreen';
	let player, killCount, bossSpawned, enemies, keys;
	const floor = canvas.height - 80;

	easyBtn.addEventListener('click', () => startGame('easy'));
	mediumBtn.addEventListener('click', () => startGame('medium'));
	hardBtn.addEventListener('click', () => startGame('hard'));

	// Initialize centralized input handling
	Controls.init();

	function startGame(difficulty) {
		if (difficulty === 'easy') { window.GC.ENEMY_SPEED = 1; window.GC.ENEMY_PUNCH_DAMAGE = 2; window.GC.BOSS_PUNCH_DAMAGE = 15; }
		else if (difficulty === 'medium') { window.GC.ENEMY_SPEED = 2; window.GC.ENEMY_PUNCH_DAMAGE = 10; window.GC.BOSS_PUNCH_DAMAGE = 25; }
		else if (difficulty === 'hard') { window.GC.ENEMY_SPEED = 2.5; window.GC.ENEMY_PUNCH_DAMAGE = 20; window.GC.BOSS_PUNCH_DAMAGE = 35; }

		player = window.PlayerFactory.createPlayer({ x: 100, y: 100 });
		killCount = 0;
		bossSpawned = false;
		enemies = [];
			// keys will be read from Controls.getKeys()
			keys = Controls.getKeys();
			Controls.subscribeAttack(() => {
				if (player && !player.isAttacking) {
					player.isAttacking = true;
					setTimeout(() => { player.isAttacking = false; }, window.GC ? window.GC.PLAYER_PUNCH_DURATION_MS : 150);
				}
			});
		spawnEnemy();

		gameState = 'playing';
		titleScreen.classList.add('hidden');
		canvas.classList.remove('hidden');

		requestAnimationFrame(gameLoop);
	}

	function spawnEnemy(isBoss = false) {
		const e = window.EnemyFactory.createEnemy(isBoss, canvas.width, floor);
		enemies.push(e);
	}

	function gameLoop() {
		if (gameState !== 'playing') return;

			// Apply physics (centralized)
			// expose canvas width for physics bounds
			window.canvasWidth = canvas.width;
			Physics.applyPhysics(player, keys, floor);

		// Spawning logic
		if (!bossSpawned && enemies.length < window.GC.MAX_ENEMIES) { spawnEnemy(); }

		// Enemy AI & interactions
		for (let i = enemies.length - 1; i >= 0; i--) {
			const enemy = enemies[i];
			const distance = player.x - enemy.x;
			const attackRange = enemy.isBoss ? window.GC.AI_ATTACK_RANGE_BOSS : window.GC.AI_ATTACK_RANGE_NORMAL;

			if (Math.abs(distance) > window.GC.AI_CHASE_DISTANCE) { enemy.action = 'chasing'; }
			else if (Math.abs(distance) < window.GC.AI_RETREAT_DISTANCE) { enemy.action = 'retreating'; }
			else { enemy.action = 'attacking'; }

			if (enemy.action === 'chasing') { if (distance > 0) { enemy.x += enemy.speed; } else { enemy.x -= enemy.speed; } }
			else if (enemy.action === 'retreating') { if (distance > 0) { enemy.x -= enemy.speed; } else { enemy.x += enemy.speed; } }

			enemy.facing = (distance > 0) ? 'right' : 'left';

			if (enemy.action === 'attacking' && !enemy.isAttacking && Math.abs(distance) < attackRange) {
				enemy.isAttacking = true;
				const duration = enemy.isBoss ? window.GC.BOSS_PUNCH_DURATION_MS : window.GC.ENEMY_PUNCH_DURATION_MS;
				setTimeout(() => { enemy.isAttacking = false; }, duration);
			}

			if (enemy.x < enemy.width / 2) { enemy.x = enemy.width / 2; }
			if (enemy.x > canvas.width - enemy.width / 2) { enemy.x = canvas.width - enemy.width / 2; }

			// Hit detection
			if (player.isAttacking && window.HitLogic.playerAttackHit(player, enemy)) {
				enemy.health -= window.GC.PLAYER_PUNCH_DAMAGE;
				player.isAttacking = false;
			}
			if (enemy.isAttacking && window.HitLogic.enemyAttackHit(enemy, player)) {
				player.health -= enemy.isBoss ? window.GC.BOSS_PUNCH_DAMAGE : window.GC.ENEMY_PUNCH_DAMAGE;
				enemy.isAttacking = false;
			}

			// Defeat logic
			if (enemy.health <= 0) {
                if (typeof enemy.coinValue === 'number' && !isNaN(enemy.coinValue)) {
                    player.coins += enemy.coinValue;
                }
				enemies.splice(i, 1);
				if (!enemy.isBoss) { killCount++; }
				else {
					alert('BOSS DEFEATED! YOU ARE A TRUE CHAMPION!');
					bossSpawned = false;
					killCount = 0;
					gameState = 'titleScreen';
					titleScreen.classList.remove('hidden');
					canvas.classList.add('hidden');
				}
			}
		}

		// Boss spawn
		if (killCount >= window.GC.KILLS_TO_SPAWN_BOSS && !bossSpawned) {
			enemies = [];
			spawnEnemy(true);
			bossSpawned = true;
		}

		// Player defeat
		if (player.health <= 0) {
			alert('GAME OVER!');
			gameState = 'titleScreen';
			titleScreen.classList.remove('hidden');
			canvas.classList.add('hidden');
		}

		// Drawing
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		window.HitLogic.drawCharacter(ctx, player);
		enemies.forEach(enemy => window.HitLogic.drawCharacter(ctx, enemy));
		drawHealthBars();

		if (player.isAttacking) {
			ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
			let px = player.facing === 'right' ? player.x + 40 : player.x - 80;
			ctx.fillRect(px, player.y - player.height / 2 - 20, 40, 20);
		}
		enemies.forEach(enemy => {
			if (enemy.isAttacking) {
				ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
				let ex = enemy.facing === 'right' ? enemy.x + 40 : enemy.x - 80;
				ctx.fillRect(ex, enemy.y - enemy.height / 2 - 20, 40, 20);
			}
		});

		requestAnimationFrame(gameLoop);
	}

	function drawHealthBars() {
		// Player
		ctx.fillStyle = '#39ff14';
		ctx.fillRect(20, 20, (player.health / player.maxHealth) * 150, 20);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(20, 20, 150, 20);

		// Enemies
		enemies.forEach(e => {
			const healthBarWidth = e.isBoss ? 200 : 100;
			const healthBarX = e.x - healthBarWidth / 2;
			const healthBarY = e.y - e.height - 30;
			ctx.fillStyle = '#333';
			ctx.fillRect(healthBarX, healthBarY, healthBarWidth, 10);
			ctx.fillStyle = e.color;
			const currentHealthWidth = (e.health / e.maxHealth) * healthBarWidth;
			ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, 10);
		});

		// <<< EXACT ADDITION 5: UPDATE HUD TEXT HERE >>>
		coinCounter.textContent = `Coins: ${player.coins}`; 
		// ---
	}
})();

