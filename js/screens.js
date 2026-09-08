/* ================================================================
   SCREENS.JS
   Controla qué sección (pantalla) está visible en cada momento.
   Cada <section class="screen" data-screen="..."> es una pantalla.
   ================================================================ */

const Screens = (() => {
  const sections = Array.from(document.querySelectorAll('.screen'));

  function show(name) {
    sections.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.screen === name);
    });
  }

  return { show };
})();
