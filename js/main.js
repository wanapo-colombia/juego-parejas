/* ================================================================
   MAIN.JS
   Orquesta el flujo completo:
   splash -> inicio -> intersticial -> tablero -> resultado (win/lose)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------
  // 1) SPLASH -> INICIO
  //    Se muestra unos segundos y pasa sola a la pantalla de inicio.
  //    (También se puede tocar para saltarla).
  // --------------------------------------------------------------
  const SPLASH_MS = 1800;
  let splashTimer = null;

  function startSplashTimer() {
    clearTimeout(splashTimer);
    splashTimer = setTimeout(goToStart, SPLASH_MS);
  }

  document.getElementById('screen-splash').addEventListener('click', () => {
    clearTimeout(splashTimer);
    goToStart();
  });

  function goToStart() {
    Screens.show('start');
  }

  startSplashTimer();

  // --------------------------------------------------------------
  // 2) INICIO -> INTERSTICIAL
  // --------------------------------------------------------------
  document.getElementById('btn-inicio').addEventListener('click', () => {
    Screens.show('intro');
    startIntroTimer();
  });

  // --------------------------------------------------------------
  // 3) INTERSTICIAL "Juego de parejas" -> TABLERO
  //    Avanza sola tras un tiempo, o si el usuario toca la pantalla.
  // --------------------------------------------------------------
  let introTimer = null;
  function startIntroTimer() {
    clearTimeout(introTimer);
    introTimer = setTimeout(goToBoard, CONFIG.rules.introAutoAdvanceMs);
  }
  document.getElementById('intro-tap-area').addEventListener('click', () => {
    clearTimeout(introTimer);
    goToBoard();
  });

  function goToBoard() {
    Screens.show('game');
    MemoryGame.start(handleGameFinish);
  }

  // --------------------------------------------------------------
  // 4) TABLERO -> RESULTADO (win / lose)
  // --------------------------------------------------------------
  function handleGameFinish({ result }) {
    Screens.show(result === 'win' ? 'win' : 'lose');
  }

  // --------------------------------------------------------------
  // 5) "Volver a jugar" desde cualquiera de las pantallas de
  //    resultado, regresa a la primera pantalla (splash) y reinicia
  //    todo el flujo desde el principio.
  // --------------------------------------------------------------
  function restartApp() {
    clearTimeout(introTimer);
    Screens.show('splash');
    startSplashTimer();
  }

  document.getElementById('btn-reintentar-win').addEventListener('click', restartApp);
  document.getElementById('btn-reintentar-lose').addEventListener('click', restartApp);

});
