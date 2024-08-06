class Pancho {
    constructor(nombre, precio, ingredientes, disponible) {
        this.nombre = nombre;
        this.precio = precio;
        this.ingredientes = ingredientes;
        this.disponible = disponible;
    }
}

const panchos = JSON.parse(localStorage.getItem('panchos')) || [
    new Pancho('Pancho Clásico', 50, ['Salchicha', 'Pan', 'Ketchup', 'Mostaza'], true),
    new Pancho('Pancho Completo', 70, ['Salchicha', 'Pan', 'Ketchup', 'Mostaza', 'Mayonesa', 'Papas Fritas'], true),
    new Pancho('Pancho Vegetariano', 60, ['Salchicha de soja', 'Pan integral', 'Ketchup', 'Mostaza', 'Verduras'], true),
    new Pancho('Pancho Picante', 65, ['Salchicha', 'Pan', 'Ketchup', 'Mostaza', 'Salsa picante'], false),
];

function guardarPanchos() {
    localStorage.setItem('panchos', JSON.stringify(panchos));
}

function agregarPancho(nombre, precio, ingredientes, disponible) {
    const nuevoPancho = new Pancho(nombre, parseFloat(precio), ingredientes.split(','), disponible === 'true');
    panchos.push(nuevoPancho);
    guardarPanchos();
    alert('Pancho agregado exitosamente!');
}

function buscarPanchoPorNombre(nombre) {
    return panchos.find(pancho => pancho.nombre.toLowerCase() === nombre.toLowerCase());
}

function venderPancho(nombre) {
    const pancho = buscarPanchoPorNombre(nombre);
    if (pancho && pancho.disponible) {
        pancho.disponible = false;
        guardarPanchos();
        alert(`Pancho "${pancho.nombre}" vendido exitosamente!`);
        mostrarPanchos();
    } else {
        alert('El pancho no está disponible o no existe');
    }
}

function mostrarPanchos() {
    const lista = document.getElementById('listaPanchos');
    lista.innerHTML = '';
    panchos.forEach(pancho => {
        const item = document.createElement('li');
        item.textContent = `Nombre: ${pancho.nombre}, Precio: $${pancho.precio}, Ingredientes: ${pancho.ingredientes.join(', ')}, Disponible: ${pancho.disponible ? 'Sí' : 'No'}`;
        
        const venderButton = document.createElement('button');
        venderButton.textContent = 'Vender';
        venderButton.disabled = !pancho.disponible;
        venderButton.addEventListener('click', () => venderPancho(pancho.nombre));
        
        item.appendChild(venderButton);
        lista.appendChild(item);
    });
}

document.getElementById('formAgregar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const disponible = document.getElementById('disponible').value;
    agregarPancho(nombre, precio, ingredientes, disponible);
    e.target.reset();
});

document.getElementById('btnBuscar').addEventListener('click', () => {
    const nombre = document.getElementById('buscarNombre').value;
    const resultado = buscarPanchoPorNombre(nombre);
    const resultadoBusqueda = document.getElementById('resultadoBusqueda');
    if (resultado) {
        resultadoBusqueda.textContent = `Nombre: ${resultado.nombre}, Precio: $${resultado.precio}, Ingredientes: ${resultado.ingredientes.join(', ')}, Disponible: ${resultado.disponible ? 'Sí' : 'No'}`;
    } else {
        resultadoBusqueda.textContent = 'Pancho no encontrado';
    }
});

document.getElementById('btnMostrar').addEventListener('click', () => {
    mostrarPanchos();
});

// Mostrar panchos al cargar la página
mostrarPanchos();
