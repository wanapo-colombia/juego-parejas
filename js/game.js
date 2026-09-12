/* ================================================================
   GAME.JS
   Lógica del juego de memoria / parejas.
   No conoce nada de navegación entre pantallas: solo administra el
   tablero, el estado de las cartas y el puntaje. Al terminar, avisa
   mediante los callbacks "onFinish" que define main.js.
   ================================================================ */

const MemoryGame = (() => {
  const boardEl = document.getElementById('board');
  const hudIntentosEl = document.getElementById('hud-intentos');
  const hudAciertosEl = document.getElementById('hud-aciertos');

  let deck = [];          // 12 cartas barajadas
  let flippedCards = [];  // cartas actualmente boca arriba (máx. 2)
  let matchesFound = 0;   // parejas acertadas
  let attemptsUsed = 0;   // intentos consumidos
  let isBusy = false;     // bloquea clics mientras se evalúa una pareja
  let onFinishCallback = null;

  // --------------------------------------------------------------
  // Sonido de volteo: se usa un pequeño "pool" de <audio> en vez de
  // uno solo, para que si dos cartas se voltean casi al mismo tiempo
  // (o el jugador es rápido) el sonido no se corte a la mitad.
  // --------------------------------------------------------------
  const flipSound = (() => {
    const POOL_SIZE = 4;
    const pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(CONFIG.assets.sfxCardFlip);
      audio.preload = 'auto';
      audio.volume = 0.55;
      pool.push(audio);
    }
    let nextIndex = 0;
    function play() {
      const audio = pool[nextIndex];
      nextIndex = (nextIndex + 1) % pool.length;
      try {
        audio.currentTime = 0;
        const p = audio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) { /* si el navegador bloquea el audio, no rompe el juego */ }
    }
    return { play };
  })();

  // --------------------------------------------------------------
  // Utilidad: baraja un array (Fisher-Yates)
  // --------------------------------------------------------------
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --------------------------------------------------------------
  // Construye el mazo: duplica cada pareja de CONFIG.pairs y baraja
  // --------------------------------------------------------------
  function buildDeck() {
    const doubled = CONFIG.pairs.flatMap((pair) => [pair, pair]);
    return shuffle(doubled);
  }

  // --------------------------------------------------------------
  // Crea el HTML de una carta. "slotNumber" es el número fijo 1-12
  // que se ve en el reverso (coincide con la casilla, no con la
  // pareja) tal como en la referencia visual del tablero.
  // --------------------------------------------------------------
  function createCardElement(pairData, slotNumber, slotIndex) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.pairId = pairData.id;
    card.dataset.slotIndex = String(slotIndex);

    const backImg = CONFIG.cardBacks[slotNumber - 1];

    card.innerHTML = `
      <div class="card__inner">
        <div class="card__face card__face--back">
          <img src="${backImg}" alt="Casilla ${slotNumber}">
        </div>
        <div class="card__face card__face--front">
          <img src="${pairData.img}" alt="${pairData.alt}">
        </div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    return card;
  }

  // --------------------------------------------------------------
  // Pinta el tablero completo
  // --------------------------------------------------------------
  function render() {
    boardEl.innerHTML = '';
    deck.forEach((pairData, index) => {
      const slotNumber = index + 1; // numeración fija 1-12
      boardEl.appendChild(createCardElement(pairData, slotNumber, index));
    });
  }

  function updateHud() {
    hudIntentosEl.textContent = `Intentos: ${attemptsUsed}/${CONFIG.rules.maxAttempts}`;
    hudAciertosEl.textContent = `Aciertos: ${matchesFound}/${CONFIG.pairs.length}`;
  }

  // --------------------------------------------------------------
  // Click en una carta
  // --------------------------------------------------------------
  function handleCardClick(card) {
    if (isBusy) return;
    if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;
    if (flippedCards.length === 2) return;

    card.classList.add('is-flipped');
    flippedCards.push(card);
    flipSound.play();

    if (flippedCards.length === 2) {
      attemptsUsed += 1;
      updateHud();
      isBusy = true;
      setTimeout(evaluatePair, CONFIG.rules.mismatchDelay);
    }
  }

  // --------------------------------------------------------------
  // Evalúa si las 2 cartas volteadas forman pareja
  // --------------------------------------------------------------
  function evaluatePair() {
    const [cardA, cardB] = flippedCards;
    const isMatch = cardA.dataset.pairId === cardB.dataset.pairId;

    if (isMatch) {
      cardA.classList.add('is-matched');
      cardB.classList.add('is-matched');
      matchesFound += 1;
    } else {
      cardA.classList.remove('is-flipped');
      cardB.classList.remove('is-flipped');
      flipSound.play();
    }

    flippedCards = [];
    isBusy = false;
    updateHud();
    checkGameEnd();
  }

  // --------------------------------------------------------------
  // Determina si el juego debe terminar (todas las parejas
  // encontradas, o se agotaron los intentos) y dispara el callback
  // ("win" | "lose") con el puntaje final.
  // --------------------------------------------------------------
  function checkGameEnd() {
    const allFound = matchesFound === CONFIG.pairs.length;
    const outOfAttempts = attemptsUsed >= CONFIG.rules.maxAttempts;

    if (!allFound && !outOfAttempts) return;

    const result = matchesFound > CONFIG.rules.winThreshold ? 'win' : 'lose';
    const delay = allFound ? CONFIG.rules.resultDelay : CONFIG.rules.mismatchDelay;

    setTimeout(() => {
      if (typeof onFinishCallback === 'function') {
        onFinishCallback({ result, matchesFound, attemptsUsed });
      }
    }, delay);
  }

  // --------------------------------------------------------------
  // Vista previa inicial: muestra las 12 cartas boca arriba un
  // momento para que el jugador memorice, luego las voltea boca
  // abajo y recién ahí habilita los clics.
  // --------------------------------------------------------------
  function previewDeck() {
    const cards = Array.from(boardEl.querySelectorAll('.card'));
    // requestAnimationFrame asegura que el navegador ya pintó las
    // cartas boca abajo antes de animarlas (si no, a veces "saltan"
    // directo a boca arriba sin verse el volteo).
    requestAnimationFrame(() => {
      cards.forEach((card) => card.classList.add('is-flipped'));
      flipSound.play();
      setTimeout(() => {
        cards.forEach((card) => card.classList.remove('is-flipped'));
        flipSound.play();
        // Espera a que termine la animación de volteo (.5s, definida
        // en css/styles.css) antes de habilitar los clics del juego.
        setTimeout(() => { isBusy = false; }, 500);
      }, CONFIG.rules.previewDuration);
    });
  }

  // --------------------------------------------------------------
  // API pública
  // --------------------------------------------------------------
  function start(onFinish) {
    onFinishCallback = onFinish;
    deck = buildDeck();
    flippedCards = [];
    matchesFound = 0;
    attemptsUsed = 0;
    isBusy = true; // bloqueado hasta que termine la vista previa inicial
    updateHud();
    render();
    previewDeck();
  }

  return { start };
})();
