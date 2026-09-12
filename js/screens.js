/* ================================================================
   SCREENS.JS
   Controla qué sección (pantalla) está visible en cada momento.
   Cada <section class="screen" data-screen="..."> es una pantalla.
   ================================================================ */

const Screens = (() => {
  const sections = Array.from(document.querySelectorAll('.screen'));
  const stage = document.getElementById('stage');

  function show(name) {
    sections.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.screen === name);
    });
    if (stage) stage.dataset.screen = name;
  }

  // Sincroniza #stage con la pantalla que ya viene activa por HTML
  // al cargar (splash), sin esperar a la primera llamada a show().
  const initiallyActive = sections.find((el) => el.classList.contains('is-active'));
  if (stage && initiallyActive) stage.dataset.screen = initiallyActive.dataset.screen;

  return { show };
})();
