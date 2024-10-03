class Punto {
    constructor(x, y) {
        this.#x = x; // Atributo privado
        this.#y = y; // Atributo privado
    }

    #x; // Atributo privado
    #y; // Atributo privado

    get x() {
        return this.#x; // Método getter para x
    }

    get y() {
        return this.#y; // Método getter para y
    }
}

// Función para generar un valor aleatorio en un rango con margen
function generarValorAleatorioConMargen(min, max, margen) {
    const rangoMin = min + margen;
    const rangoMax = max - margen;
    return Math.random() * (rangoMax - rangoMin) + rangoMin;
}

// Función para generar puntos aleatorios dentro del canvas
function generarPuntosAleatorios(numPuntos, ancho, alto) {
    const puntos = [];
    const margen = 30; // Margen para evitar que los puntos se dibujen en los bordes

    for (let i = 0; i < numPuntos; i++) {
        let x = generarValorAleatorioConMargen(0, ancho, margen);
        let y = generarValorAleatorioConMargen(0, alto, margen);
        puntos.push(new Punto(x, y));
    }
    return puntos; // Devolver los puntos sin ordenar
}

// Función para calcular el centroide
function calcularCentroide(puntos) {
    let sumX = 0, sumY = 0;
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

// Función para dibujar el polígono en el canvas
function dibujarPoligono(contexto, puntos, mostrarCentroide) {
    contexto.clearRect(0, 0, contexto.canvas.width, contexto.canvas.height); // Limpiar el canvas
    contexto.beginPath();
    contexto.moveTo(puntos[0].x, puntos[0].y);
    for (let i = 1; i < puntos.length; i++) {
        contexto.lineTo(puntos[i].x, puntos[i].y);
    }
    contexto.closePath();

    // Rellenar el polígono
    contexto.fillStyle = 'lightblue'; // Color de relleno
    contexto.fill(); // Rellenar el área del polígono
    contexto.stroke(); // Dibujar el contorno

    // Dibujar el centroide si se debe mostrar
    if (mostrarCentroide) {
        const centroide = calcularCentroide(puntos);
        contexto.beginPath();
        contexto.arc(centroide.x, centroide.y, 5, 0, Math.PI * 2); // Dibuja un círculo en el centroide
        contexto.fillStyle = 'orange'; // Color del centroide
        contexto.fill(); // Rellenar el círculo
        contexto.stroke(); // Dibujar el contorno del círculo

        // Dibujar líneas del centroide a cada punto
        dibujarLineasCentroide(contexto, puntos, centroide);
    }
}

// Función para dibujar las líneas del centroide a los puntos
function dibujarLineasCentroide(contexto, puntos, centroide) {
    contexto.strokeStyle = "red"; // Color de las líneas
    puntos.forEach(punto => {
        contexto.beginPath();
        contexto.moveTo(centroide.x, centroide.y);
        contexto.lineTo(punto.x, punto.y);
        contexto.stroke();
    });
}

// Generar puntos aleatorios y garantizar que estén ordenados
const puntos = generarPuntosAleatorios(6, 400, 400);
const puntosOrdenados = ordenarPuntosPorAngulo(puntos); // Ordenar los puntos
let mostrarCentroide = true; // Bandera para mostrar/ocultar el centroide

// Obtener el contexto del canvas
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');

// Dibujar el polígono inicialmente
dibujarPoligono(contexto, puntosOrdenados, mostrarCentroide);

// Determinar si es convexo o cóncavo
const resultado = esConvexo(puntosOrdenados) ? "Los puntos forman un polígono convexo." : "Los puntos forman un polígono cóncavo.";
document.getElementById('resultado').textContent = resultado;

// Añadir el botón para mostrar/ocultar el centroide
document.getElementById('toggle-centroid').addEventListener('click', function() {
    mostrarCentroide = !mostrarCentroide; // Cambiar el estado de mostrar/ocultar
    dibujarPoligono(contexto, puntosOrdenados, mostrarCentroide); // Redibujar el polígono
});
