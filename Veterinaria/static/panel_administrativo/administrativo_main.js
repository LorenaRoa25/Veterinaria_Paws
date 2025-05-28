// Configuración de campos por módulo
const moduleFields = {
  productos: ["Nombre", "Descripción", "Precio", "Stock", "Categoría"],
  proveedores: ["Nombre del proveedor", "Contacto del proveedor", "Dirección del proveedor", "Catálogo de productos"],
  usuarios: ["Nombre", "Rol", "Correo electrónico", "Contraseña", "ID de empleado"],
  clientes: ["Nombre del cliente", "Contacto del cliente", "Historial de compras del cliente", "Preferencias del cliente"],
  ventas: ["Nombre del cliente", "Contacto del cliente", "Factura reciente", "Método de pago", "Preferencias del cliente"],
  compras: ["Nombre del cliente", "Contacto del cliente", "Factura reciente", "Método de pago", "Preferencias del cliente"],
  imagenes: ["Título de la imagen", "Archivo de imagen"]
};

// Navegación entre módulos
document.querySelectorAll(".sidebar li").forEach(item => {
  item.addEventListener("click", () => {
    const module = item.dataset.module;
    document.querySelectorAll(".sidebar li").forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    document.querySelectorAll(".module-container").forEach(m => m.classList.remove("active"));
    document.getElementById(module).classList.add("active");

    renderTable(module);
  });
});


// Abre modal y genera campos dinámicamente
function openModal(module) {
  currentModule = module;
  editingId = null;
  document.getElementById("modal-title").textContent = `Agregar en ${capitalize(module)}`;
  document.getElementById("modal-id").value = "";

  const fieldsContainer = document.getElementById("modal-fields");
  fieldsContainer.innerHTML = "";

  moduleFields[module].forEach(field => {
    const label = document.createElement("label");
    label.textContent = field;
    const input = document.createElement("input");
    input.type = field.includes("Archivo") ? "file" : "text";
    input.name = field;
    input.required = true;
    fieldsContainer.appendChild(label);
    fieldsContainer.appendChild(input);
  });

  document.getElementById("modal").classList.add("active");
}

// Cierra modal
function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("modal-form").reset();
}

// Guardar nuevo o editar existente
document.getElementById("modal-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputs = Array.from(document.querySelectorAll("#modal-fields input"));
  const values = {};
  let hasFile = false;

  inputs.forEach(input => {
    if (input.type === "file" && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        values[input.name] = e.target.result;
        saveData(values);
      };
      reader.readAsDataURL(input.files[0]);
      hasFile = true;
    } else {
      values[input.name] = input.value.trim();
    }
  });

  if (!hasFile) {
    saveData(values);
  }
});

// Guardar datos
function saveData(values) {
  if (editingId) {
    const index = data[currentModule].findIndex(item => item.id === editingId);
    if (index !== -1) data[currentModule][index] = { id: editingId, ...values };
  } else {
    const id = currentModule.substring(0, 3).toUpperCase() + Date.now();
    data[currentModule].push({ id, ...values });
  }

  closeModal();
  renderTable(currentModule);
}

// Editar registro
function editItem(module, id) {
  currentModule = module;
  editingId = id;

  const item = data[module].find(obj => obj.id === id);
  if (!item) return;

  document.getElementById("modal-title").textContent = `Editar en ${capitalize(module)}`;
  document.getElementById("modal-id").value = id;

  const fieldsContainer = document.getElementById("modal-fields");
  fieldsContainer.innerHTML = "";

  moduleFields[module].forEach(field => {
    const label = document.createElement("label");
    label.textContent = field;
    const input = document.createElement("input");
    input.type = field.includes("Archivo") ? "file" : "text";
    input.name = field;
    input.required = true;
    if (!field.includes("Archivo")) {
      input.value = item[field] || "";
    }
    fieldsContainer.appendChild(label);
    fieldsContainer.appendChild(input);
  });

  document.getElementById("modal").classList.add("active");
}

// Eliminar registro
function deleteItem(module, id) {
  if (confirm("¿Desea eliminar este registro?")) {
    data[module] = data[module].filter(item => item.id !== id);
    renderTable(module);
  }
}

// Actualizar dashboard
function updateDashboard() {
  document.getElementById("total-productos").textContent = data.productos.length;
  document.getElementById("total-proveedores").textContent = data.proveedores.length;
  document.getElementById("total-usuarios").textContent = data.usuarios.length;
  document.getElementById("total-clientes").textContent = data.clientes.length;
}

// Capitaliza un texto
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Cargar al iniciar
document.addEventListener("DOMContentLoaded", () => {
  renderTable("dashboard"); // solo dashboard
});

