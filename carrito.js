document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES ---
    let carrito = [];
    const contenedorProductos = document.querySelector('#productos');
    const listaCarrito = document.querySelector('#lista-carrito');
    const totalCarritoElemento = document.querySelector('#total-carrito');
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const contadorCarrito = document.querySelector('#carrito-contador');

    // --- EVENTOS ---
    // Cargar carrito desde LocalStorage al iniciar
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarCarrito();

    // Evento para agregar producto al carrito
    contenedorProductos.addEventListener('click', agregarProducto);

    // NUEVO: Evento centralizado para sumar, restar y eliminar productos del carrito
    listaCarrito.addEventListener('click', manejarEventoCarrito);

    // Evento para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        carrito = []; // Reseteamos el arreglo
        actualizarCarrito(); // Actualizamos la vista y el storage
    });


    // --- FUNCIONES ---

    // 1. Agrega el producto al carrito
    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const productoSeleccionado = e.target.closest('.col-12');
            leerDatosProducto(productoSeleccionado);
        }
    }

    // 2. Lee los datos del producto y los extrae
    function leerDatosProducto(producto) {
        const precioConDescuento = producto.querySelector('.text-danger') 
            ? producto.querySelector('.text-danger').textContent 
            : producto.querySelector('.text-indigo').textContent;

        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: precioConDescuento,
            id: producto.dataset.id,
            cantidad: 1
        };

        const existe = carrito.some(producto => producto.id === infoProducto.id);
        if (existe) {
            const productos = carrito.map(producto => {
                if (producto.id === infoProducto.id) {
                    producto.cantidad++;
                    return producto;
                } else {
                    return producto;
                }
            });
            carrito = [...productos];
        } else {
            carrito = [...carrito, infoProducto];
        }

        actualizarCarrito();
    }

    // 3. NUEVO: Maneja los eventos de clic dentro del carrito (Sumar, Restar, Eliminar)
    function manejarEventoCarrito(e) {
        e.preventDefault();
        const productoId = e.target.dataset.id;

        // Eliminar un producto (botón X)
        if (e.target.classList.contains('eliminar-producto')) {
            carrito = carrito.filter(producto => producto.id !== productoId);
        }
        // Sumar cantidad de un producto
        else if (e.target.classList.contains('sumar-producto')) {
            carrito = carrito.map(producto => {
                if (producto.id === productoId) {
                    producto.cantidad++;
                }
                return producto;
            });
        }
        // Restar cantidad de un producto
        else if (e.target.classList.contains('restar-producto')) {
            carrito = carrito.map(producto => {
                if (producto.id === productoId && producto.cantidad > 1) {
                    producto.cantidad--;
                }
                return producto;
            }).filter(producto => producto.cantidad > 0); // Si la cantidad llega a 0, se elimina
        }

        actualizarCarrito();
    }


    // 4. Actualiza y muestra el carrito en el HTML
    function actualizarCarrito() {
        limpiarHTML();

        carrito.forEach(producto => {
            const { imagen, titulo, precio, cantidad, id } = producto;
            const row = document.createElement('div');
            row.classList.add('row', 'align-items-center', 'mb-3', 'border-bottom', 'pb-2');

            // --- HTML MODIFICADO ---
            // Se cambiaron las columnas y se agregaron los botones de +/-
            row.innerHTML = `
                <div class="col-2">
                    <img src="${imagen}" width="60">
                </div>
                <div class="col-4">
                    <p class="mb-0 small">${titulo}</p>
                </div>
                <div class="col-2">
                    <p class="mb-0 fw-bold">${precio}</p>
                </div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                    <a href="#" class="btn btn-sm btn-outline-secondary restar-producto" data-id="${id}">-</a>
                    <span class="mx-2">${cantidad}</span>
                    <a href="#" class="btn btn-sm btn-outline-secondary sumar-producto" data-id="${id}">+</a>
                </div>
                <div class="col-2 text-end">
                    <a href="#" class="text-danger eliminar-producto" data-id="${id}">X</a>
                </div>
            `;
            listaCarrito.appendChild(row);
        });

        sincronizarStorage();
        actualizarTotal();
        actualizarContador();
    }
    
    // 5. Calcula y muestra el total a pagar
    function actualizarTotal() {
        const total = carrito.reduce((sum, producto) => {
            const precioNumerico = parseFloat(producto.precio.replace('$', ''));
            return sum + (precioNumerico * producto.cantidad);
        }, 0);
        
        totalCarritoElemento.textContent = `$${total.toFixed(0)}`;
    }

    // 6. Actualiza el contador del ícono del carrito
    function actualizarContador() {
        const totalProductos = carrito.reduce((sum, producto) => sum + producto.cantidad, 0);
        if (totalProductos > 0) {
            contadorCarrito.textContent = totalProductos;
            contadorCarrito.style.display = 'block';
        } else {
            contadorCarrito.style.display = 'none';
        }
    }

    // 7. Sincroniza el carrito con LocalStorage
    function sincronizarStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // 8. Limpia el HTML del carrito para evitar duplicados
    function limpiarHTML() {
        while (listaCarrito.firstChild) {
            listaCarrito.removeChild(listaCarrito.firstChild)
        }
    }
});