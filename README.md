# Estudio Salvi – Guía de mantenimiento

Sitio estático en HTML5, CSS3 y JavaScript vanilla con foco en accesibilidad AA y performance móvil.

## Estructura

- `index.html`: home con hero, áreas, equipo destacado y bloque de contacto.
- `quienes-somos.html`: historia, misión, visión y valores del estudio.
- `equipo.html`: perfiles del equipo en tarjetas responsivas.
- `clientes.html`: sectores de atención, testimonios y métricas.
- `contacto.html`: datos de contacto y formulario accesible.
- `assets/css/style.css`: sistema de diseño, tokens y componentes.
- `assets/js/app.js`: menú móvil, reveal progresivo y validación ligera.
- `img/`: assets gráficos (mantener pesos optimizados).
- `sitemap.xml` y `robots.txt`: SEO técnico básico.

## Estilos y diseño

- Tokens en `:root` para colores, espaciados y sombras.
- Tipografías Raleway (títulos y destacados) y Avenir LT W01 35 Light (cuerpo) servidas vía CDN con `display=swap`.
- Utilidades `.container`, `.stack`, `.grid`, `.card-persona`, etc. para layout consistente.
- Header sticky con foco visible, skip-link y botones fluidos.

## Accesibilidad y buenas prácticas

- Un único `<h1>` por página y jerarquía secuencial.
- Formularios con `aria-live` para feedback y estados `aria-invalid`.
- Imágenes con dimensiones fijas y `loading="lazy"` donde aplica.
- Soporte `prefers-reduced-motion` y navegación por teclado.

## Scripts

`assets/js/app.js` inicializa automáticamente:
- Menú hamburguesa (`.nav-toggle`, `#site-nav`).
- Animaciones progresivas (`[data-reveal]` y `.fade-in`).
- Validación genérica para formularios con `novalidate`.
- Actualización del año en el footer.

## Desarrollo

Abrí cualquier archivo `.html` directamente en el navegador. No requiere build ni dependencias externas.
