class Pancho {
    constructor(nombre, precio, stock, ingredientes) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.ingredientes = ingredientes;
    }
}

class Venta {
    constructor(pancho, cantidad) {
        this.pancho = pancho;
        this.cantidad = cantidad;
        this.total = pancho.precio * cantidad;
    }
}

const panchos = [];
const ventas = [];

// Función para agregar un nuevo pancho
function agregarPancho(nombre, precio, stock, ingredientes) {
    const nuevoPancho = new Pancho(nombre, parseFloat(precio), parseInt(stock), ingredientes.split(','));
    panchos.push(nuevoPancho);
    mostrarPanchos();
    cambiarVista('vistaPrincipal');
    Swal.fire('¡Pancho agregado!', `${nombre} ha sido añadido con éxito.`, 'success');
}

// Función para mostrar los panchos en el DOM
function mostrarPanchos() {
    const lista = document.getElementById('listaPanchos');
    lista.innerHTML = '';
    panchos.forEach((pancho, index) => {
        const item = document.createElement('li');
        item.textContent = `Nombre: ${pancho.nombre}, Precio: $${pancho.precio}, Stock: ${pancho.stock}, Ingredientes: ${pancho.ingredientes.join(', ')}`;
        
        const venderButton = document.createElement('button');
        venderButton.textContent = 'Vender';
        venderButton.addEventListener('click', () => venderPancho(index));
        
        const modificarButton = document.createElement('button');
        modificarButton.textContent = 'Modificar Stock';
        modificarButton.addEventListener('click', () => modificarStock(index));

        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.addEventListener('click', () => eliminarPancho(index));
        
        item.appendChild(venderButton);
        item.appendChild(modificarButton);
        item.appendChild(eliminarButton);
        lista.appendChild(item);
    });
}

// Función para vender un pancho
function venderPancho(index) {
    const pancho = panchos[index];
    const cantidad = parseInt(prompt(`¿Cuántos ${pancho.nombre} deseas vender?`), 10);
    if (cantidad > 0 && cantidad <= pancho.stock) {
        pancho.stock -= cantidad;
        const venta = new Venta(pancho, cantidad);
        ventas.push(venta);
        mostrarPanchos();
        mostrarVentas();
        Swal.fire('¡Venta realizada!', `Vendiste ${cantidad} ${pancho.nombre}.`, 'success');
    } else {
        Swal.fire('Error', 'Cantidad no válida o stock insuficiente', 'error');
    }
}

// Función para modificar el stock de un pancho
function modificarStock(index) {
    const pancho = panchos[index];
    const nuevoStock = parseInt(prompt(`Nuevo stock para ${pancho.nombre}:`), 10);
    if (nuevoStock >= 0) {
        pancho.stock = nuevoStock;
        mostrarPanchos();
        Swal.fire('¡Stock modificado!', `Nuevo stock de ${pancho.nombre}: ${nuevoStock}.`, 'success');
    } else {
        Swal.fire('Error', 'Stock no válido', 'error');
    }
}

// Función para eliminar un pancho
function eliminarPancho(index) {
    const pancho = panchos[index];
    panchos.splice(index, 1);
    mostrarPanchos();
    Swal.fire('¡Pancho eliminado!', `${pancho.nombre} ha sido eliminado.`, 'success');
}

// Función para mostrar las ventas
function mostrarVentas() {
    const listaVentas = document.getElementById('listaVentas');
    listaVentas.innerHTML = '';
    let totalGanado = 0;
    ventas.forEach(venta => {
        totalGanado += venta.total;
        const item = document.createElement('li');
        item.textContent = `Vendiste ${venta.cantidad} ${venta.pancho.nombre} por $${venta.total}`;
        listaVentas.appendChild(item);
    });
    document.getElementById('totalGanado').textContent = totalGanado;
}

// Función para buscar panchos
function buscarPancho() {
    const nombre = document.getElementById('buscarNombre').value.toLowerCase();
    const resultado = panchos.filter(pancho => pancho.nombre.toLowerCase().includes(nombre));
    const resultadoBusqueda = document.getElementById('resultadoBusqueda');
    resultadoBusqueda.innerHTML = '';
    if (resultado.length > 0) {
        resultado.forEach(pancho => {
            const item = document.createElement('div');
            item.textContent = `Nombre: ${pancho.nombre}, Precio: $${pancho.precio}, Stock: ${pancho.stock}, Ingredientes: ${pancho.ingredientes.join(', ')}`;
            resultadoBusqueda.appendChild(item);
        });
    } else {
        resultadoBusqueda.textContent = 'No se encontraron panchos';
    }
}

// Función para cambiar de vista
function cambiarVista(vista) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('oculto'));
    document.getElementById(vista).classList.remove('oculto');
}

// Eventos de navegación
document.getElementById('btnAgregar').addEventListener('click', () => cambiarVista('vistaAgregar'));
document.getElementById('btnVentas').addEventListener('click', () => {
    mostrarVentas();
    cambiarVista('vistaVentas');
});
document.getElementById('btnBuscar').addEventListener('click', () => cambiarVista('vistaBuscar'));
document.getElementById('btnBuscarPancho').addEventListener('click', buscarPancho);

// Manejo de eventos para agregar un nuevo pancho
document.getElementById('formAgregar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const ingredientes = document.getElementById('ingredientes').value;
    agregarPancho(nombre, precio, stock, ingredientes);
    e.target.reset();
});

// Cargar datos desde un archivo JSON usando fetch
async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        data.forEach(pancho => agregarPancho(pancho.nombre, pancho.precio, pancho.stock, pancho.ingredientes));
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Inicializar la app cargando los datos
cargarDatos();


