/* ================================================================
   SW.JS — Service Worker
   Guarda una copia local de todos los archivos del juego la primera
   vez que se abre (con internet). Después de eso, los sirve desde
   esa copia, así que la app funciona sin conexión.

   IMPORTANTE — al subir cambios nuevos del juego (imágenes, textos,
   código):
   1) Sube todos los archivos como siempre.
   2) Cambia el número de CACHE_NAME de abajo (ej: "v1" -> "v2").
   Eso le avisa a los celulares que ya tienen la app guardada que
   hay una versión nueva para descargar. Si no se cambia el número,
   los que ya la instalaron seguirán viendo la versión vieja.
   ================================================================ */

const CACHE_NAME = 'colombianas-hierro-memoria-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/config.js',
  './js/fit.js',
  './js/game.js',
  './js/main.js',
  './js/screens.js',
  './manifest.json',
  './assets/audio/card-flip.mp3',
  './assets/fonts/Gilroy-Bold.otf',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/img/backgrounds/bg-pattern.webp',
  './assets/img/botom/Botones-01.webp',
  './assets/img/botom/Botones-02.webp',
  './assets/img/botom/Botones-03.webp',
  './assets/img/botom/Botones-04.webp',
  './assets/img/botom/Botones-05.webp',
  './assets/img/botom/Botones-06.webp',
  './assets/img/botom/Botones-07.webp',
  './assets/img/botom/Botones-08.webp',
  './assets/img/botom/Botones-09.webp',
  './assets/img/botom/Botones-10.webp',
  './assets/img/botom/Botones-11.webp',
  './assets/img/botom/Botones-12.webp',
  './assets/img/buttons/btn-inicio.webp',
  './assets/img/logos/Logo-colombia.webp',
  './assets/img/logos/logo-pg.webp',
  './assets/img/splash/splash-sphere.png',
  './assets/img/text/text-1.webp',
  './assets/img/text/text-2.webp',
  './assets/img/text/text-3.webp',
  './assets/img/tiles/icon-drop.webp',
  './assets/img/tiles/icon-logo.webp',
  './assets/img/tiles/icon-pg.webp',
  './assets/img/tiles/icon-pillow.webp',
  './assets/img/tiles/icon-pills.webp',
  './assets/img/tiles/icon-shower.webp',
  './assets/img/tiles/tile-back.png',
  './assets/img/tiles/tile-front.png',
  './assets/img/titles/title-parejas.webp',
  './assets/img/titles/title-result-fail.webp',
  './assets/img/titles/title-result-success.webp',
  './assets/img/woman/photo-mujer-feliz.webp',
  './assets/img/woman/photo-mujer-triste.webp',
];

// --------------------------------------------------------------
// Instalación: descarga y guarda en caché todos los archivos de
// la lista. skipWaiting() hace que la versión nueva del service
// worker se active de inmediato, sin esperar a que se cierren
// todas las pestañas abiertas.
// --------------------------------------------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// --------------------------------------------------------------
// Activación: borra cachés de versiones anteriores (las que
// quedaron de un CACHE_NAME viejo), para no acumular basura ni
// servir archivos desactualizados.
// --------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// --------------------------------------------------------------
// Peticiones: "cache primero, red como respaldo". Si el archivo
// ya está guardado, se usa directo (instantáneo y funciona sin
// internet). Si no está guardado (por ejemplo algo nuevo que se
// agregó y aún no se actualizó CACHE_NAME), se busca en la red y
// de paso se guarda para la próxima vez.
// --------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached); // sin red y sin copia guardada: no hay nada que mostrar
    })
  );
});
