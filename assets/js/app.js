// Estudio Salvi UI interactions
// - Menú móvil accesible
// - Animaciones progresivas
// - Validación ligera de formularios

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupScrollReveal();
  setupForms();
  setupBackToTop();
  setupAnchorOffsets();
  updateYear();
});

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    document.body.style.overflow = expanded ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.style.overflow = '';
    });
  });
}

function setupScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const normalizeTime = (value, fallbackUnit = 's') => {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    if (/[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return `${trimmed}${fallbackUnit}`;
  };

  items.forEach(el => {
    const { revealDelay, revealDuration, revealEase } = el.dataset;
    if (revealDelay) {
      el.style.setProperty('--reveal-delay', normalizeTime(revealDelay));
    }
    if (revealDuration) {
      el.style.setProperty('--reveal-duration', normalizeTime(revealDuration));
    }
    if (revealEase) {
      el.style.setProperty('--reveal-ease', revealEase);
    }
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

function setupForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', event => {
      if (form.hasAttribute('novalidate')) {
        event.preventDefault();
      }

      const feedback = form.querySelector('.form-feedback');
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let valid = true;

      fields.forEach(field => {
        const value = field.value.trim();
        let fieldValid = value.length > 0;

        if (field.type === 'email') {
          fieldValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
        }

        field.setAttribute('aria-invalid', String(!fieldValid));
        const error = field.parentElement.querySelector('.field-error');
        if (!fieldValid) {
          valid = false;
          if (!error) {
            const message = document.createElement('p');
            message.className = 'field-error';
            message.textContent = 'Revisá este campo.';
            field.parentElement.appendChild(message);
          }
        } else if (error) {
          error.remove();
        }
      });

      if (feedback) {
        feedback.textContent = valid ? 'Mensaje preparado para envío.' : 'Completá los campos requeridos.';
        feedback.classList.toggle('is-error', !valid);
      }
    });
  });
}

function setupBackToTop() {
  const button = document.querySelector('.back-to-top-btn');
  if (!button) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      button.classList.add('is-visible');
    } else {
      button.classList.remove('is-visible');
    }
  };

  button.addEventListener('click', () => {
    if (prefersReducedMotion.matches) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
}

function setupAnchorOffsets() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const getOffsetValue = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    const header = document.querySelector('.site-header');
    const headerHeightVar = parseFloat(rootStyles.getPropertyValue('--header-height')) || 0;
    const headerHeight = header ? header.getBoundingClientRect().height : headerHeightVar;
    return headerHeight + 24;
  };

  const scrollWithOffset = (hash, smooth) => {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    const offset = getOffsetValue();
    const elementTop = target.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(0, elementTop - offset);

    window.scrollTo({
      top,
      behavior: smooth && !prefersReducedMotion.matches ? 'smooth' : 'auto'
    });
  };

  if (window.location.hash) {
    const adjustInitial = () => scrollWithOffset(window.location.hash, false);
    requestAnimationFrame(adjustInitial);
    window.addEventListener('load', adjustInitial, { once: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains('skip-link')) {
      return;
    }

    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      history.pushState(null, '', hash);
      scrollWithOffset(hash, true);
    });
  });

  window.addEventListener('hashchange', () => {
    scrollWithOffset(window.location.hash, false);
  });
}

function updateYear() {
  const target = document.getElementById('year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}
