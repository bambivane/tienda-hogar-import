// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', function() {

  // Selecciona todas las tarjetas de productos
  const productos = document.querySelectorAll('.card');

  // Define el porcentaje de descuento
  const porcentajeDescuento = 0.15; // 15% de descuento

  // Itera sobre cada producto usando un bucle for
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    
    // Encuentra el elemento del precio dentro de la tarjeta
    const precioElemento = producto.querySelector('.text-indigo.fw-bold.fs-4');

    if (precioElemento) {
      // Obtiene el texto del precio y lo convierte a número
      const precioTexto = precioElemento.innerText; // Ejemplo: "$150"
      const precioOriginal = parseFloat(precioTexto.replace('$', '')); // Remueve el '$' y convierte a número

      // Calcula el nuevo precio con descuento
      const precioDescuento = precioOriginal * (1 - porcentajeDescuento);

      // Crea el nuevo HTML para mostrar el precio original tachado y el nuevo precio
      const nuevoHtmlPrecio = `
        <span class="text-muted text-decoration-line-through me-2">$${precioOriginal.toFixed(0)}</span>
        <span class="text-danger fw-bold fs-4">$${precioDescuento.toFixed(0)}</span>
      `;

      // Actualiza el HTML del elemento del precio
      precioElemento.innerHTML = nuevoHtmlPrecio;
    }
  }

});