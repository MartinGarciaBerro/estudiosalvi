/**
 * Main JavaScript - Estudio Salvi
 * Funcionalidades: menú móvil, reveal on scroll, validación de formulario
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {

    // Inicializar funcionalidades
    initMobileMenu();
    initRevealOnScroll();
    initFormValidation();
    initSmoothScroll();
    initCSRFToken();
    initStickyCTA();

});

/**
 * Menú móvil hamburguesa
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', function() {
        siteNav.classList.toggle('open');

        // Actualizar aria-expanded para accesibilidad
        const isExpanded = siteNav.classList.contains('open');
        navToggle.setAttribute('aria-expanded', isExpanded);

        // Cambiar aria-label del botón
        const label = isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación';
        navToggle.setAttribute('aria-label', label);

        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(e) {
        if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Reveal on scroll animation
 */
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length === 0) return;

    // Crear Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una vez visible, dejar de observar para mejorar rendimiento
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Validación y envío de formulario
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    // Obtener elementos del formulario
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const asuntoSelect = document.getElementById('asunto');
    const mensajeTextarea = document.getElementById('mensaje');
    const consentimientoCheckbox = document.querySelector('input[name="consentimiento"]');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const messagesContainer = document.querySelector('.form-messages');

    // Estado del formulario
    let formValid = false;

    /**
     * Validar campo individual
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        // Remover clases de error previas
        field.classList.remove('error');

        // Validaciones básicas
        switch (fieldName) {
            case 'nombre':
                return value.length >= 2 && value.length <= 100;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) && value.length <= 254;

            case 'telefono':
                if (value === '') return true; // Teléfono es opcional
                const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
                return phoneRegex.test(value.replace(/\s/g, ''));

            case 'asunto':
                return value !== '';

            case 'mensaje':
                return value.length >= 10 && value.length <= 1000;

            case 'consentimiento':
                return field.checked;

            default:
                return true;
        }
    }

    /**
     * Mostrar errores de campo
     */
    function showFieldError(field, message) {
        field.classList.add('error');

        // Crear o actualizar mensaje de error
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    /**
     * Limpiar errores de campo
     */
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Validar todo el formulario
     */
    function validateForm() {
        const fields = [nombreInput, emailInput, telefonoInput, asuntoSelect, mensajeTextarea, consentimientoCheckbox];
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            if (field && !validateField(field)) {
                isValid = false;

                // Obtener mensaje de error apropiado
                let errorMessage = '';
                switch (field.name) {
                    case 'nombre':
                        errorMessage = 'El nombre debe tener entre 2 y 100 caracteres.';
                        break;
                    case 'email':
                        errorMessage = 'Por favor, ingresa un email válido.';
                        break;
                    case 'telefono':
                        errorMessage = 'Por favor, ingresa un teléfono válido.';
                        break;
                    case 'asunto':
                        errorMessage = 'Por favor, selecciona un asunto.';
                        break;
                    case 'mensaje':
                        errorMessage = 'El mensaje debe tener entre 10 y 1000 caracteres.';
                        break;
                    case 'consentimiento':
                        errorMessage = 'Debes aceptar el tratamiento de datos personales.';
                        break;
                }

                if (errorMessage) {
                    errors.push(errorMessage);
                    showFieldError(field, errorMessage);
                }
            } else if (field) {
                clearFieldError(field);
            }
        });

        formValid = isValid;
        return isValid;
    }

    /**
     * Mostrar mensaje general
     */
    function showMessage(message, type = 'error') {
        if (!messagesContainer) return;

        messagesContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-ocultar mensaje de éxito después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                }
            }, 5000);
        }
    }

    /**
     * Enviar formulario vía AJAX
     */
    async function submitForm(formData) {
        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                showMessage(result.message, 'success');
                contactForm.reset();

                // Limpiar errores
                const errorElements = contactForm.querySelectorAll('.field-error');
                errorElements.forEach(el => el.remove());

                // Scroll al mensaje de éxito
                if (messagesContainer) {
                    messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                showMessage(result.message || 'Error al enviar el formulario.');
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor, inténtalo más tarde.');
        }
    }

    // Eventos de validación en tiempo real
    if (nombreInput) {
        nombreInput.addEventListener('blur', () => validateField(nombreInput));
        nombreInput.addEventListener('input', () => {
            if (nombreInput.classList.contains('error')) {
                validateField(nombreInput);
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => validateField(emailInput));
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                validateField(emailInput);
            }
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('blur', () => validateField(telefonoInput));
        telefonoInput.addEventListener('input', () => {
            if (telefonoInput.classList.contains('error')) {
                validateField(telefonoInput);
            }
        });
    }

    if (mensajeTextarea) {
        mensajeTextarea.addEventListener('blur', () => validateField(mensajeTextarea));
        mensajeTextarea.addEventListener('input', () => {
            if (mensajeTextarea.classList.contains('error')) {
                validateField(mensajeTextarea);
            }
        });
    }

    // Validar formulario al cambiar cualquier campo
    const formFields = [nombreInput, emailInput, telefonoInput, asuntoSelect, mensajeTextarea, consentimientoCheckbox];
    formFields.forEach(field => {
        if (field) {
            field.addEventListener('change', validateForm);
            field.addEventListener('input', validateForm);
        }
    });

    // Manejar envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            showMessage('Por favor, corrige los errores antes de enviar.');
            return;
        }

        // Deshabilitar botón durante envío
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }

        // Crear FormData
        const formData = new FormData(contactForm);

        // Enviar formulario
        submitForm(formData);

        // Rehabilitar botón después de 3 segundos (por si hay error)
        setTimeout(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar consulta';
            }
        }, 3000);
    });
}

/**
 * Smooth scroll para anclas internas
 */
function initSmoothScroll() {
    // Ya está manejado por CSS con scroll-behavior: smooth;
    // Pero podemos añadir funcionalidad adicional si es necesario

    // Por ejemplo, scroll al top al cargar página si hay hash
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
}

/**
 * Generar y establecer token CSRF
 */
function initCSRFToken() {
    // Generar token simple del lado cliente
    // Nota: En producción, esto debería venir del servidor
    function generateSimpleToken() {
        return btoa(Date.now() + Math.random()).substr(0, 32);
    }

    const csrfInput = document.querySelector('input[name="csrf_token"]');
    if (csrfInput && !csrfInput.value) {
        csrfInput.value = generateSimpleToken();
    }
}

/**
 * CTA sticky en móvil
 */
function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');

    if (!stickyCTA) return;

    // Solo mostrar en móvil
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            stickyCTA.style.display = 'block';
        } else {
            stickyCTA.style.display = 'none';
        }
    }

    // Verificar al cargar
    checkScreenSize();

    // Verificar al cambiar tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkScreenSize, 150);
    });

    // Ocultar CTA al hacer scroll hacia arriba
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll hacia abajo - mostrar CTA
            stickyCTA.style.transform = 'translateY(0)';
        } else if (scrollTop < lastScrollTop) {
            // Scroll hacia arriba - ocultar CTA
            stickyCTA.style.transform = 'translateY(100%)';
        }

        lastScrollTop = scrollTop;
    });
}

/**
 * Utilidades adicionales
 */

// Función para formatear teléfono mientras se escribe
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 6) {
        input.value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length <= 10) {
        input.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else {
        input.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }
}

// Aplicar formateo de teléfono si existe el campo
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        formatPhone(this);
    });
}

