/* Carrito de compras */
class CartManager {
    constructor() {
        // Elementos del carrito para referenciar
        this.cartCount = document.querySelector('.cart-count');
        this.cartToggleBtn = document.getElementById('cartToggleBtn');
        this.cartContainer = document.getElementById('cartContainer');
        this.closeCartBtn = document.getElementById('closeCartBtn');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');

        // Elementos de checkout
        this.checkoutItemsContainer = document.getElementById('checkout-items');
        this.checkoutSubtotal = document.getElementById('checkout-subtotal');
        this.checkoutTotal = document.getElementById('checkout-total');
        this.pagarBtn = document.getElementById('pagar-btn');

        // Inicializar el carrito
        this.cart = [];
        this.total = 0;
        this.initCart();
        this.setupEventListeners();

        // Si estamos en la página de checkout, cargar los datos
        if (window.location.pathname.includes('checkout')) {
            this.loadCheckoutData();
        }

        // Añadir el botón de checkout si no existe
        this.addCheckoutButton();
    }

    // Inicializar carrito desde localStorage
    initCart() {
        const savedCart = localStorage.getItem('pawsCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
                this.updateCartDisplay();
            } catch (e) {
                console.error("Error al cargar el carrito:", e);
                localStorage.removeItem('pawsCart');
                this.cart = [];
            }
        }
    }

    // Configurar todos los event listeners necesarios
    setupEventListeners() {
        // Mostrar/ocultar el carrito
        if (this.cartToggleBtn) {
            this.cartToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cartContainer.style.display = this.cartContainer.style.display === 'none' ? 'block' : 'none';
            });
        }

        if (this.closeCartBtn) {
            this.closeCartBtn.addEventListener('click', () => {
                this.cartContainer.style.display = 'none';
            });
        }

        // Botones de añadir al carrito
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        if (addToCartBtns) {
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addToCart(btn);
                });
            });
        }

        // Botón de pagar en la página de checkout
        if (this.pagarBtn) {
            this.pagarBtn.addEventListener('click', () => this.procesarPago());
        }

        // También buscamos directamente un botón de realizar compra que ya existe en el DOM
        const existingCheckoutButton = document.querySelector('.realizar-compra-btn');
        if (existingCheckoutButton) {
            existingCheckoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    // Actualizar visualización del carrito
    updateCartDisplay() {
        // Actualizar contador del carrito
        if (this.cartCount) {
            const totalItems = this.cart.reduce((acc, item) => acc + item.quantity, 0);
            this.cartCount.textContent = totalItems;
        }

        // Actualizar lista de productos
        if (this.cartItems) {
            this.cartItems.innerHTML = '';
            this.total = 0;

            this.cart.forEach((product, index) => {
                const productElement = document.createElement('div');
                productElement.classList.add('cart-item');
                productElement.style.display = 'flex';
                productElement.style.justifyContent = 'space-between';
                productElement.style.alignItems = 'center';
                productElement.style.padding = '8px 0';
                productElement.style.borderBottom = '1px solid #eee';

                // Calcular subtotal del producto
                const productTotal = product.price * product.quantity;
                this.total += productTotal;

                productElement.innerHTML = `
                    <div>
                        <div style="font-weight: bold; font-size: 0.9em;">${product.name}</div>
                        <div style="font-size: 0.8em;">$${product.price.toLocaleString('es-CO')} × ${product.quantity}</div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: 10px;">$${productTotal.toLocaleString('es-CO')}</span>
                        <button class="remove-item" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                this.cartItems.appendChild(productElement);
            });

            // Guardar carrito en localStorage
            localStorage.setItem('pawsCart', JSON.stringify(this.cart));
        }

        // Actualizar el total
        if (this.cartTotal) {
            this.cartTotal.textContent = this.total.toLocaleString('es-CO');
        }

        // Añadir eventos a los botones de eliminar
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.removeFromCart(index);
            });
        });

        // Mostrar u ocultar el botón de "Realizar compra" según si hay productos en el carrito
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.style.display = this.cart.length > 0 ? 'block' : 'none';
        }
    }

    // Añadir producto al carrito
    addToCart(btn) {
        // Obtener información del producto
        const productCard = btn.closest('.product-card');
        if (!productCard) {
            console.error("No se encontró el elemento product-card");
            return;
        }

        const productTitle = productCard.querySelector('.product-title');
        if (!productTitle) {
            console.error("No se encontró el elemento product-title");
            return;
        }
        const productName = productTitle.textContent;

        // Extraer precio y convertirlo a número
        const productPrice = productCard.querySelector('.product-price');
        if (!productPrice) {
            console.error("No se encontró el elemento product-price");
            return;
        }

        const priceText = productPrice.textContent;
        // Eliminar el signo $ y los puntos de miles, luego convertir a número
        const priceNumber = parseFloat(priceText.replace('$', '').replace(/\./g, '').replace(/,/g, '.'));

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = this.cart.findIndex(item => item.name === productName);

        if (existingProductIndex !== -1) {
            // Incrementar cantidad si ya existe
            this.cart[existingProductIndex].quantity += 1;
            this.showNotification(`Cantidad de ${productName} incrementada en el carrito`, 'success');
        } else {
            // Agregar nuevo producto
            this.cart.push({
                name: productName,
                price: priceNumber,
                quantity: 1
            });
            this.showNotification(`${productName} agregado al carrito`, 'success');
        }

        // Actualizar visualización del carrito
        this.updateCartDisplay();

        // Mostrar el carrito
        this.cartContainer.style.display = 'block';
    }

    // Eliminar un producto del carrito
    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartDisplay();
        this.showNotification('Producto eliminado del carrito', 'success');

        // Si estamos en la página de checkout, actualizar la visualización
        if (window.location.pathname.includes('checkout')) {
            this.loadCheckoutData();
        }
    }

    // Función para cargar y mostrar los datos del checkout
    loadCheckoutData() {
        if (!this.checkoutItemsContainer) return;

        if (this.cart.length === 0) {
            this.checkoutItemsContainer.innerHTML = '<p>No hay productos en el carrito</p>';
            if (this.checkoutSubtotal) this.checkoutSubtotal.textContent = '$0';
            if (this.checkoutTotal) this.checkoutTotal.textContent = '$0';
            return;
        }

        // Limpiar el contenedor
        this.checkoutItemsContainer.innerHTML = '';

        // Calcular el total
        let totalAmount = 0;
        this.cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;

            const itemRow = document.createElement('div');
            itemRow.classList.add('summary-item');
            itemRow.style.display = 'flex';
            itemRow.style.justifyContent = 'space-between';
            itemRow.style.margin = '10px 0';
            itemRow.style.padding = '5px 0';
            itemRow.style.borderBottom = '1px solid #eee';

            itemRow.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>$${subtotal.toLocaleString('es-CO')}</span>
            `;

            this.checkoutItemsContainer.appendChild(itemRow);
        });

        // Actualizar subtotal y total
        if (this.checkoutSubtotal) {
            this.checkoutSubtotal.textContent = `$${totalAmount.toLocaleString('es-CO')}`;
        }

        if (this.checkoutTotal) {
            this.checkoutTotal.textContent = `$${totalAmount.toLocaleString('es-CO')}`;
        }
    }

    // Proceder al checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('El carrito está vacío', 'error');
            return;
        }

        // Redirigir a la página de checkout
        window.location.href = '/checkout/';
    }

    // Mostrar notificaciones
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#FF9800';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Agregar el botón "Realizar compra" al carrito si no existe
    addCheckoutButton() {
        const cartFooter = document.querySelector('.cart-footer');

        if (cartFooter && !document.getElementById('checkoutButton')) {
            const checkoutButton = document.createElement('button');
            checkoutButton.id = 'checkoutButton';
            checkoutButton.textContent = 'Realizar compra';
            checkoutButton.style.backgroundColor = '#754c24';
            checkoutButton.style.color = 'white';
            checkoutButton.style.border = 'none';
            checkoutButton.style.borderRadius = '4px';
            checkoutButton.style.padding = '8px 16px';
            checkoutButton.style.marginTop = '10px';
            checkoutButton.style.width = '100%';
            checkoutButton.style.cursor = 'pointer';
            checkoutButton.style.fontWeight = 'bold';
            checkoutButton.style.display = this.cart.length > 0 ? 'block' : 'none';

            // Asignar el evento click
            checkoutButton.addEventListener('click', () => this.proceedToCheckout());

            cartFooter.appendChild(checkoutButton);
        } else if (document.getElementById('checkoutButton')) {
            // Si el botón ya existe, asegurémonos de que tenga el evento correcto
            const checkoutButton = document.getElementById('checkoutButton');
            // Eliminar eventos anteriores para evitar duplicaciones
            const newCheckoutButton = checkoutButton.cloneNode(true);
            checkoutButton.parentNode.replaceChild(newCheckoutButton, checkoutButton);
            newCheckoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    // Procesar el pago
    procesarPago() {
        // Validar formulario
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        const ciudad = document.getElementById('ciudad').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!nombre || !telefono || !email || !paymentMethod || !direccion || !ciudad) {
            this.showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Recopilar datos del formulario
        const formData = {
            nombre: nombre,
            telefono: telefono,
            email: email,
            direccion: direccion,
            ciudad: ciudad,
            metodo_pago: paymentMethod,
            items: this.cart,
            total: this.total
        };

        // Mostrar indicador de carga
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.innerHTML = '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #754c24; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div><p>Procesando pago...</p>';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.flexDirection = 'column';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.zIndex = '9999';

        // Añadir estilo de animación
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loadingIndicator);

        // Obtener el token CSRF
        const csrftoken = this.getCookie('csrftoken');

        // Enviar datos al servidor usando fetch API
        fetch('/procesar-pago/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            // Eliminar indicador de carga
            document.body.removeChild(loadingIndicator);

            if (data.status === 'success') {
                // Limpiar carrito
                localStorage.removeItem('pawsCart');
                this.cart = [];
                this.updateCartDisplay();

                // Mostrar mensaje de éxito
                this.showNotification('¡Compra realizada con éxito! Gracias por tu pedido.', 'success');

                // Redirigir a página de confirmación o inicio después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                // Mostrar mensaje de error
                this.showNotification('Error al procesar el pago: ' + data.message, 'error');
            }
        })
        .catch(error => {
            // Eliminar indicador de carga
            document.body.removeChild(loadingIndicator);

            // Mostrar mensaje de error
            this.showNotification('Error al procesar el pago: ' + error.message, 'error');
        });
    }

    // Función para obtener el token CSRF
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// Inicializar el gestor del carrito cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});