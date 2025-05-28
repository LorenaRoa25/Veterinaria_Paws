// Carrusel
const carouselInner = document.getElementById('carouselInner');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? carouselItems.length - 1 : currentIndex - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
});

// Carrusel automático
setInterval(() => {
    currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
}, 5000);


// Funcionalidad de inicio de sesión y registro
const loginBtn = document.getElementById('loginBtn');
const authContainer = document.getElementById('authContainer');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authContainer.style.display = 'flex';
});

closeAuthBtn.addEventListener('click', () => {
    authContainer.style.display = 'none';
});

authContainer.addEventListener('click', (e) => {
    if (e.target === authContainer) {
        authContainer.style.display = 'none';
    }
});

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Actualizar tabs
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Actualizar formularios
        const tabId = tab.getAttribute('data-tab');
        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${tabId}Form`).classList.add('active');
    });
});

// Inicio de sesión y registro (envio de formularios)
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('loginUserType').value;

    console.log('Iniciando sesión con:', { email, password, userType });

    if (!userType) {
        alert('Por favor selecciona un tipo de usuario');
        return;
    }

    alert('Inicio de sesión exitoso');
    authContainer.style.display = 'none';

    if (userType === 'administrador') {
        window.location.href = '/administrativo/';
    } else {
        console.log('Usuario cliente permanece en Pagina_Principal');
        // No redirecciona, se queda donde está
    }
});


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validación
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    console.log('Registrando usuario:', { name, email, password });

    // Simulación de registro exitoso
    alert('Registro exitoso');
    authContainer.style.display = 'none';

});

// Mostrar/Ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const targetId = icon.getAttribute('data-target');
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});
