// Estudio Salvi UI interactions
// - Menú móvil accesible
// - Animaciones progresivas
// - Validación ligera de formularios

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupScrollReveal();
  setupForms();
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
  const items = document.querySelectorAll('[data-reveal], .fade-in');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

function updateYear() {
  const target = document.getElementById('year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}
