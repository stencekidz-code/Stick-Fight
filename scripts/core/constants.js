// Game constants and mutable settings
// Player stats
const PLAYER_MAX_HEALTH = 100;
const PLAYER_SPEED = 30;
const PLAYER_JUMP_STRENGTH = -15;
const PLAYER_PUNCH_DAMAGE = 100;
const PLAYER_PUNCH_DURATION_MS = 150;
const PLAYER_COLOR = '#00ff41';

// Enemy defaults (mutable per difficulty)
let ENEMY_HEALTH = 50;
let ENEMY_SPEED = 2;
let ENEMY_PUNCH_DAMAGE = 10;
const ENEMY_PUNCH_DURATION_MS = 300;
const ENEMY_COLOR = '#ff073a';

// Boss defaults

let BOSS_HEALTH = 300; 
let BOSS_SPEED = 1;
let BOSS_PUNCH_DAMAGE = 2;
const BOSS_PUNCH_DURATION_MS = 500;
// BOSS_COLOR: replaced with a simple time-based color cycler.
// getBossColor() returns a hex color that cycles the hue over time using HSL.
function hslToHex(h, s, l) {
  // Clamp and convert
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function getBossColor(timeMs = (typeof performance !== 'undefined' ? performance.now() : Date.now())) {
  // Cycle hue every cycleMs milliseconds (adjustable) and keep saturation/lightness fixed.
  // Use performance.now() when available for smooth fractional milliseconds.
  const cycleMs = 1000; // 1 second per full hue cycle (change to taste)

  // Use division instead of integer modulo to avoid the timeMs % 1 === 0 problem
  const hue = ((timeMs / cycleMs) * 360) % 360; // 0-360
  const sat = 70; // percent
  const light = 35; // percent
  return hslToHex(hue, sat, light);
}

// Game rules
const GRAVITY = 0.5;
const MAX_ENEMIES = 3;
const KILLS_TO_SPAWN_BOSS = 5;

// AI settings
const AI_CHASE_DISTANCE = 160;
const AI_RETREAT_DISTANCE = 100;
const AI_ATTACK_RANGE_BOSS = 180;
const AI_ATTACK_RANGE_NORMAL = 120;

// Export as globals for simple script usage (no module system)
window.GC = {
  // constants
  PLAYER_MAX_HEALTH, PLAYER_SPEED, PLAYER_JUMP_STRENGTH, PLAYER_PUNCH_DAMAGE, PLAYER_PUNCH_DURATION_MS, PLAYER_COLOR,
  ENEMY_HEALTH, ENEMY_SPEED, ENEMY_PUNCH_DAMAGE, ENEMY_PUNCH_DURATION_MS, ENEMY_COLOR,
  BOSS_HEALTH, BOSS_SPEED, BOSS_PUNCH_DAMAGE, BOSS_PUNCH_DURATION_MS,
  // BOSS_COLOR is provided as a getter to keep API backwards compatible while
  // returning a time-varying color.
  get BOSS_COLOR() { return getBossColor(); },
  GRAVITY, MAX_ENEMIES, KILLS_TO_SPAWN_BOSS,
  AI_CHASE_DISTANCE, AI_RETREAT_DISTANCE, AI_ATTACK_RANGE_BOSS, AI_ATTACK_RANGE_NORMAL
};
