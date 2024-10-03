class Punto {
    #x;
    #y;
    
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}

// Función para generar puntos aleatorios
function generarPuntosAleatorios(numPuntos, ancho, alto) {
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        const x = Math.random() * ancho;
        const y = Math.random() * alto;
        puntos.push(new Punto(x, y));
    }
    return puntos;
}

// Función para calcular el centroide
function calcularCentroide(puntos) {
    let sumX = 0;
    let sumY = 0;
    puntos.forEach(p => {
        sumX += p.x;
        sumY += p.y;
    });
    return new Punto(sumX / puntos.length, sumY / puntos.length);
}

// Función para calcular el ángulo desde el centroide
function calcularAngulo(centroide, punto) {
    return Math.atan2(punto.y - centroide.y, punto.x - centroide.x);
}

// Función personalizada para ordenar puntos según el ángulo con respecto al centroide
function ordenarPuntosPorAngulo(puntos) {
    const centroide = calcularCentroide(puntos);
    return puntos.slice().sort((a, b) => calcularAngulo(centroide, a) - calcularAngulo(centroide, b));
}

// Función para calcular el producto cruzado
function productoCruzado(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Función para verificar si los puntos forman un polígono convexo
function esConvexo(puntos) {
    let cruzados = [];
    const n = puntos.length;

    for (let i = 0; i < n; i++) {
        const o = puntos[i];
        const a = puntos[(i + 1) % n];
        const b = puntos[(i + 2) % n];
        const cp = productoCruzado(o, a, b);
        cruzados.push(cp);
    }

    const positivos = cruzados.filter(cp => cp > 0).length;
    const negativos = cruzados.filter(cp => cp < 0).length;

    return positivos === 0 || negativos === 0;
}

// Función para dibujar el polígono en SVG
function dibujarPoligono(svg, puntos, mostrarCentroide) {
    svg.innerHTML = ''; // Limpiar el SVG
    const poligono = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poligono.setAttribute("points", puntos.map(p => `${p.x},${p.y}`).join(" "));
    poligono.setAttribute("fill", "lightblue"); // Color de relleno
    poligono.setAttribute("stroke", "black"); // Color del contorno
    svg.appendChild(poligono);

    // Dibujar el centroide si se debe mostrar
    if (mostrarCentroide) {
        const centroide = calcularCentroide(puntos);
        const puntoCentroide = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentroide.setAttribute("cx", centroide.x);
        puntoCentroide.setAttribute("cy", centroide.y);
        puntoCentroide.setAttribute("r", 5); // Radio del círculo
        puntoCentroide.setAttribute("fill", "orange"); // Color del centroide
        svg.appendChild(puntoCentroide);

        // Dibujar líneas del centroide a cada punto
        dibujarLineasCentroide(svg, puntos, centroide);
    }
}

// Función para dibujar las líneas del centroide a los puntos
function dibujarLineasCentroide(svg, puntos, centroide) {
    puntos.forEach(punto => {
        const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linea.setAttribute("x1", centroide.x);
        linea.setAttribute("y1", centroide.y);
        linea.setAttribute("x2", punto.x);
        linea.setAttribute("y2", punto.y);
        linea.setAttribute("stroke", "red"); // Color de las líneas
        svg.appendChild(linea);
    });
}

// Generar puntos aleatorios y garantizar que estén ordenados
const puntos = generarPuntosAleatorios(6, 400, 400);
const puntosOrdenados = ordenarPuntosPorAngulo(puntos); // Ordenar los puntos
let mostrarCentroide = true; // Bandera para mostrar/ocultar el centroide

// Crear el SVG y dibujar el polígono
const svg = document.getElementById('svg');
dibujarPoligono(svg, puntosOrdenados, mostrarCentroide);

// Determinar si es convexo o cóncavo
const resultado = esConvexo(puntosOrdenados) ? "Los puntos forman un polígono convexo." : "Los puntos forman un polígono cóncavo.";
document.getElementById('resultado-svg').textContent = resultado;

// Añadir el botón para mostrar/ocultar el centroide
document.getElementById('toggle-centroid-svg').addEventListener('click', function() {
    mostrarCentroide = !mostrarCentroide; // Cambiar el estado de mostrar/ocultar
    dibujarPoligono(svg, puntosOrdenados, mostrarCentroide); // Redibujar el polígono
});
