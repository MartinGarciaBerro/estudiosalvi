# Estudio Salvi – Sitio estático

Home pública desarrollada con HTML5 semántico, CSS externo y JavaScript vanilla.

## Estructura

- `index.html`: página principal con hero, quiénes somos, áreas, equipo y contacto.
- `assets/css/style.css`: estilos base (layout y componentes).
- `assets/css/overrides.css`: tema verde #A7C7A7, tipografías Playfair/Inter, focos y hovers.
- `assets/js/main.js`: interacciones (menú móvil, reveal on scroll, smooth scroll, CTA sticky, validación si hay formulario).
- `img/`: imágenes del sitio (hero, equipo, ilustrativas).

## Editar contenidos

- Hero (`<section class="hero">`):
  - Título y subtítulo en el contenedor.
  - Fondo: cambiar `background:url('img/1 Palac de Just web.jpg')`.
- Quiénes somos (`#quienes-somos`): editar texto e imagen lateral (`img/sobrenosotros.avif` o `img/2 T Colon web.jpg`).
- Áreas (`#areas`): cada card es un `<li>` dentro de `.grid-list` con enlace a `/areas.html`.
- Equipo (`#equipo`): cada miembro es un `<article class="person-card">` con foto, nombre, cargo y enlace `/equipo/[slug].html`.
- Contacto (`#contacto`): actualizar dirección, teléfonos, email y CTA. Fondo decorativo en estilo inline.

## SEO

- `<title>` y `<meta name="description">` en `<head>`.
- Open Graph/Twitter: `og:title`, `og:description`, `og:image` y `twitter:*`.
- JSON-LD `LegalService`: actualizar `name`, `telephone`, `address`, `logo` en el bloque `<script type="application/ld+json">`.

## Tipografías y estilos

- Playfair Display (títulos) e Inter (cuerpo) importadas en `assets/css/overrides.css`.
- Acento configurable en `:root` de `overrides.css`.

## Accesibilidad

- `lang="es-AR"` en `<html>`.
- Roles ARIA en `header`, `nav`, `main`, `footer`.
- Foco visible en enlaces y botones; `skip-link` al inicio.

## JS e interacciones

`assets/js/main.js` inicializa automáticamente:
- Menú hamburguesa (`.nav-toggle`, `.site-nav`).
- Reveal on scroll (`[data-reveal]`).
- Smooth scroll por CSS (+ manejo de hash).
- CTA sticky en móvil (`.sticky-cta`).
- Validación solo si existe `.contact-form`.

## Desarrollo

Abrí `index.html` en el navegador. No requiere dependencias ni build.
