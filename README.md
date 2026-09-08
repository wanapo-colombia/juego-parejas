Juego de Parejas 🧠🃏

Juego de memoria (encontrar parejas) desarrollado en **HTML, CSS y JavaScript puro** (sin dependencias ni build steps). Utiliza las piezas gráficas finales de marca optimizadas para un diseño responsivo de formato vertical.

## 🚀 Características
* **Vanilla Web Tech:** Construido 100% sin librerías ni bibliotecas externas.
* **Autoajustable (Responsive):** Sistema de escalado dinámico (`js/fit.js`) fijado a proporción 9:16 (480×853 px design size) con efecto *letterbox* para no distorsionar en ninguna pantalla o `iframe`.
* **Animaciones CSS 3D:** Volteo de cartas mediante `transform-style: preserve-3d` y `rotateY`.
* **Fácilmente Configurable:** Parámetros de juego, rutas de imágenes y parejas centralizados en un único archivo (`js/config.js`).

---

## 🛠️ Estructura del Proyecto

```text
colombianas-de-hierro-memoria/
├── index.html            # Marcado principal con el contenedor (#stage > #app)
├── css/
│   └── styles.css        # Estilos visuales, tablero y animaciones
├── js/
│   ├── config.js         # ⚙️ Archivo de configuración (Reglas, imágenes, pares)
│   ├── fit.js            # Autoajuste responsivo del lienzo
│   ├── screens.js        # Manejo de flujo de pantallas
│   ├── game.js           # Lógica del juego (barajado, parejas, intentos)
│   └── main.js           # Inicialización y eventos globales
└── assets/
    └── img/              # Piezas gráficas finales de la marca

Puedes modificar la experiencia editando únicamente js/config.js:

rules: {
  maxAttempts: 6,         // Intentos permitidos antes de finalizar
  winThreshold: 4,        // > 4 aciertos = Pantalla ganadora
  mismatchDelay: 900,     // Tiempo (ms) que se muestran cartas no coincidentes
  resultDelay: 700,       // Tiempo (ms) de espera antes de ver el resultado
  introAutoAdvanceMs: 2200// Duración de la pantalla introductoria
}

