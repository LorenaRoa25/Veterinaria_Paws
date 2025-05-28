// Base de datos de productos
const productsDatabase = [
    {
        id: 1,
        name: "Alimento Gato Fancy Feast Terrine Pavo - 3 Oz",
        price: "$5.700",
        description: "Mix de trozos delicadamente picados combinados con un delicioso paté.",
        fullDescription: "Fancy Feast Terrine Pavo es un alimento húmedo premium para gatos adultos. Contiene trozos delicadamente picados combinados con un delicioso paté que proporciona una textura irresistible para tu gato. Elaborado con ingredientes de alta calidad y con un sabor excepcional que hará que tu gato disfrute de cada bocado.",
        features: [
            "Ingredientes de alta calidad",
            "Textura irresistible para gatos",
            "Porción individual de 3 Oz (85g)",
            "Sin conservantes ni colorantes artificiales",
            "Alto contenido de proteínas"
        ],
        specifications: {
            weight: "85 gramos (3 Oz)",
            flavor: "Pavo",
            format: "Lata individual",
            ageRange: "Gatos adultos",
            brand: "Fancy Feast"
        }
    }
];

// Elementos DOM
const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-product-details");
const closeModalBtn = document.querySelector(".close-modal");
const detailsButtons = document.querySelectorAll(".details-button");

// Función para abrir el modal con los detalles del producto
function openProductModal(productId) {
    // Buscar el producto en la base de datos
    const product = productsDatabase.find(p => p.id === productId);

    if (!product) {
        console.error("Producto no encontrado");
        return;
    }

    // HTML para el modal
    const modalHTML = `
        <div class="modal-product">
            <div class="modal-product-header">
                <div class="modal-product-info">
                    <h2>${product.name}</h2>
                    <p class="modal-product-price">${product.price}</p>
                    <p class="modal-product-description">${product.fullDescription}</p>
                </div>
            </div>

            <div class="modal-product-features">
                <h3>Características</h3>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join("")}
                </ul>
            </div>

            <div class="modal-product-specifications">
                <h3>Especificaciones</h3>
                <table>
                    <tr>
                        <td><strong>Peso:</strong></td>
                        <td>${product.specifications.weight}</td>
                    </tr>
                    <tr>
                        <td><strong>Sabor:</strong></td>
                        <td>${product.specifications.flavor}</td>
                    </tr>
                    <tr>
                        <td><strong>Formato:</strong></td>
                        <td>${product.specifications.format}</td>
                    </tr>
                    <tr>
                        <td><strong>Edad recomendada:</strong></td>
                        <td>${product.specifications.ageRange}</td>
                    </tr>
                    <tr>
                        <td><strong>Marca:</strong></td>
                        <td>${product.specifications.brand}</td>
                    </tr>
                </table>
            </div>


        </div>
    `;

    // Insertar el HTML en el modal
    modalContent.innerHTML = modalHTML;

    // Mostrar el modal
    modal.style.display = "block";

    // Prevenir el scroll en el body cuando el modal está abierto
    document.body.style.overflow = "hidden";

    // Configurar los botones de cantidad
    setupQuantityButtons();
}


// Cerrar el modal
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Event Listeners
// Para los botones de detalles
detailsButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-product-id"));
        openProductModal(productId);
    });
});

// Para cerrar el modal con el botón X
closeModalBtn.addEventListener("click", closeModal);

// Para cerrar el modal cuando se hace clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});


