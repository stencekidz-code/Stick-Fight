// Controls module — centralizes keyboard state and attack triggering
(function () {
  const keys = {};
  let attackCallback = null;

  function init() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  function onKeyDown(e) {
    keys[e.key] = true;
    if (e.code === 'Space' && typeof attackCallback === 'function') {
      attackCallback();
    }
  }

  function onKeyUp(e) {
    keys[e.key] = false;
  }

  function subscribeAttack(fn) { attackCallback = fn; }
  function getKeys() { return keys; }

  // expose
  window.Controls = { init, subscribeAttack, getKeys };
})();
