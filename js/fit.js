/* ================================================================
   FIT.JS
   Hace que #app (lienzo de diseño fijo 480×853, proporción 9:16) se
   ajuste automáticamente a cualquier pantalla o contenedor: calcula
   el mayor "scale" posible que permite ver el lienzo COMPLETO dentro
   de #stage (todo el viewport), sin recortar ni deformar, y lo
   re-centra. Se recalcula en cada resize / cambio de orientación,
   así que funciona igual en celular, tablet, desktop o dentro de un
   iframe embebido de cualquier tamaño.

   No depende de CONFIG ni de ningún otro script: puede ir primero.
   ================================================================ */

(function () {
  var BASE_W = 480;
  var BASE_H = BASE_W * 16 / 9; // 853.33 — misma proporción que --canvas-h

  var app = document.getElementById('app');
  if (!app) return;

  function fit() {
    // Tamaño disponible real (usa el contenedor #stage si existe,
    // si no cae al viewport completo).
    var stage = document.getElementById('stage');
    var availW = stage ? stage.clientWidth : window.innerWidth;
    var availH = stage ? stage.clientHeight : window.innerHeight;

    var scale = Math.min(availW / BASE_W, availH / BASE_H);
    // Nunca agrandar más allá del tamaño de diseño en pantallas
    // enormes (evita piezas pixeladas); quita el Math.min(scale, 1)
    // si prefieres que también escale hacia arriba.
    scale = Math.min(scale, 1.6);

    app.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';

    // Espacio sobrante (en px reales) entre el borde superior de la
    // pantalla y el borde superior de #app cuando la proporción del
    // dispositivo no es exactamente 9:16. Se expone como variable
    // CSS para que #splash-fill (la cúpula del splash) lo rellene
    // sin dejar ninguna franja visible. +4px de margen para cubrir
    // redondeos de subpíxel.
    var appTopGap = Math.max(0, (availH - BASE_H * scale) / 2) + 4;
    if (stage) stage.style.setProperty('--splash-fill-h', appTopGap + 'px');
  }

  // El centrado (position:absolute + top/left:50%) ya viene definido
  // en css/styles.css; aquí solo se actualiza el factor de escala
  // dentro del mismo transform (translate(-50%,-50%) scale(...)).
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  // Reintenta una vez más tras cargar todo (fuentes/imagenes pueden
  // cambiar el tamaño real del contenedor en navegadores antiguos).
  window.addEventListener('load', fit);
})();
