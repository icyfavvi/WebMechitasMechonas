# WebMechitasMechonas
Web Mechitas Mechonas
Resumen del proyecto
tailwind.config.js
Extiende el tema con un namespace coquette completo:

9 tokens de color organizados semánticamente: blush, petal, rose, mauve, burgundy (rosas/burdeos), más cream, pearl, lace, dust (neutros) e ink/mist (tipografía).
3 familias tipográficas: Cormorant Garamond (display elegante serif), Dancing Script (logo script), DM Sans (body legible).
Sombras personalizadas petal / bloom / soft, gradientes nombrados, y 7 keyframes de animación.

Layout.jsx — Navbar + Footer

Navbar sticky con backdrop blur, subrayado animado en los links, botón de carrito con badge dinámico, y menú hamburger para mobile con transición suave.
Footer de 4 columnas (marca + links × 2 + newsletter), totalmente responsivo.

ProductCard.jsx

Imagen con aspect ratio 4/4.5, badge de oferta/nuevo, botón wishlist con estado toggle.
Estrellas renderizadas dinámicamente según rating.
Botón CTA que cambia de estado a "¡Añadido!" con ícono de check y vuelve automáticamente.

Home.jsx

Hero con círculos difuminados, patrón de rombos, stats, imagen circular animada con sticker flotante y dos CTAs.
Barra de categorías como pills con hover.
Grid 1 → 2 → 4 columnas con animación escalonada animation-delay.
Promo banner con gradiente y patrón de fondo.

App.jsx
Estado del carrito centralizado con useState — suma correctamente cuando se añade el mismo producto varias veces.
