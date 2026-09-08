/* ================================================================
   CONFIG.JS
   Todo lo que el cliente / equipo de marca podría necesitar ajustar
   está centralizado en este archivo: nombres de imágenes, reglas de
   puntaje e intentos permitidos.
   ================================================================ */

const CONFIG = {

  // --------------------------------------------------------------
  // Rutas de assets. Si cambias los NOMBRES de archivo, actualízalos
  // aquí (es el único lugar donde se referencian).
  // --------------------------------------------------------------
  assets: {
    logoColombianas: 'assets/img/logos/Logo-colombia.webp',
    logoPG:          'assets/img/logos/logo-pg.webp',
    background:      'assets/img/backgrounds/bg-pattern.webp',
    splashSphere:    'assets/img/splash/splash-sphere.png',
    btnInicio:       'assets/img/buttons/btn-inicio.webp',
    titleParejas:    'assets/img/titles/title-parejas.webp',
    titleWin:        'assets/img/titles/title-result-success.webp',
    titleLose:       'assets/img/titles/title-result-fail.webp',
    textWin:         'assets/img/text/text-1.webp',
    textFooter:      'assets/img/text/text-2.webp',
    textLose:        'assets/img/text/text-3.webp',
    fotoFeliz:       'assets/img/woman/photo-mujer-feliz.webp',
    fotoCansada:     'assets/img/woman/photo-mujer-triste.webp',
  },

  // --------------------------------------------------------------
  // Las 6 parejas del tablero (12 cartas). "img" apunta al ícono que
  // se muestra en la cara frontal de la carta (ya incluye el fondo
  // de la tarjeta). El id se usa internamente para verificar
  // coincidencias.
  // --------------------------------------------------------------
  pairs: [
    { id: 'colombianas', img: 'assets/img/tiles/icon-logo.webp',   alt: 'Colombianas de Hierro' },
    { id: 'ducha',        img: 'assets/img/tiles/icon-shower.webp', alt: 'Ícono ducha' },
    { id: 'gota',         img: 'assets/img/tiles/icon-drop.webp',   alt: 'Ícono gota de sangre' },
    { id: 'vitaminas',    img: 'assets/img/tiles/icon-pills.webp',  alt: 'Ícono suplemento de hierro' },
    { id: 'almohada',     img: 'assets/img/tiles/icon-pillow.webp', alt: 'Ícono descanso' },
    { id: 'pg',           img: 'assets/img/tiles/icon-pg.webp',     alt: 'P&G' },
  ],

  // --------------------------------------------------------------
  // Reverso de las 12 casillas del tablero: número fijo 1-12 (no
  // cambia con el mazo, coincide con la posición en la grilla, tal
  // como en la referencia visual).
  // --------------------------------------------------------------
  cardBacks: [
    'assets/img/botom/Botones-01.webp',
    'assets/img/botom/Botones-02.webp',
    'assets/img/botom/Botones-03.webp',
    'assets/img/botom/Botones-04.webp',
    'assets/img/botom/Botones-05.webp',
    'assets/img/botom/Botones-06.webp',
    'assets/img/botom/Botones-07.webp',
    'assets/img/botom/Botones-08.webp',
    'assets/img/botom/Botones-09.webp',
    'assets/img/botom/Botones-10.webp',
    'assets/img/botom/Botones-11.webp',
    'assets/img/botom/Botones-12.webp',
  ],

  // --------------------------------------------------------------
  // Reglas del juego
  // --------------------------------------------------------------
  rules: {
    // Máximo de intentos (cada intento = un intento de pareja, es
    // decir, 2 cartas volteadas). Al llegar al límite sin haber
    // encontrado todas las parejas, el juego termina y se evalúa
    // el resultado según "winThreshold".
    // AJUSTA ESTE NÚMERO si la campaña define una regla distinta.
    maxAttempts: 6,

    // Si el jugador encuentra MÁS de este número de parejas
    // (estrictamente mayor), se muestra la pantalla de victoria.
    // Con 6 parejas en total: >4 aciertos = 5 o 6 => gana.
    //                          <=4 aciertos       => sigue intentando.
    winThreshold: 4,

    // Tiempo (ms) que las 2 cartas quedan visibles antes de
    // voltearse de nuevo cuando NO coinciden.
    mismatchDelay: 900,

    // Tiempo (ms) de espera tras encontrar la última pareja antes
    // de pasar a la pantalla de resultado.
    resultDelay: 700,

    // Tiempo (ms) que se muestra la pantalla intersticial
    // "Juego de parejas" antes de pasar automáticamente al tablero
    // (el jugador también puede tocar la pantalla para avanzar).
    introAutoAdvanceMs: 2200,
  },
};
