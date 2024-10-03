class Punto {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

// Función para generar puntos aleatorios dentro del canvas
function generarPuntosAleatorios(numPuntos, ancho, alto) {
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        const x = Math.random() * ancho;
        const y = Math.random() * alto;
        puntos.push(new Punto(x, y));
    }
    return puntos;
}

// Obtener el contexto del canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

// Función para ordenar puntos según el ángulo con respecto al centroide
function ordenarPuntos(puntos) {
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

// Función para dibujar el polígono
function dibujarPoligono(puntos) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
    ctx.beginPath();
    ctx.moveTo(puntos[0].x, puntos[0].y);
    puntos.forEach((punto, i) => {
        const siguiente = puntos[(i + 1) % puntos.length];
        ctx.lineTo(siguiente.x, siguiente.y);
    });
    ctx.closePath();
    ctx.stroke();
}

// Dibujar las líneas del centroide a los puntos
function dibujarLineasCentroide(puntos, centroide) {
    puntos.forEach(punto => {
        ctx.beginPath();
        ctx.moveTo(centroide.x, centroide.y);
        ctx.lineTo(punto.x, punto.y);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    });
}

// Generar puntos aleatorios y garantizar que estén ordenados
function generarPuntosVisibles(numPuntos, ancho, alto) {
    const puntos = [];
    const margen = 30; // Margen para evitar que los puntos se dibujen en los bordes

    for (let i = 0; i < numPuntos; i++) {
        let x = Math.random() * (ancho - 2 * margen) + margen;
        let y = Math.random() * (alto - 2 * margen) + margen;
        puntos.push(new Punto(x, y));
    }

    return ordenarPuntos(puntos); // Ordenar los puntos para formar un polígono
}

// Generar puntos aleatorios
const puntos = generarPuntosVisibles(6, canvas.width, canvas.height);
let mostrarCentroide = false;
const centroide = calcularCentroide(puntos);

// Dibujar el polígono inicialmente
dibujarPoligono(puntos);

// Determinar si es convexo o cóncavo
const resultado = esConvexo(puntos) ? "Los puntos forman un polígono convexo." : "Los puntos forman un polígono cóncavo.";
document.getElementById('resultado').textContent = resultado;

// Añadir el botón para mostrar/ocultar el centroide
document.getElementById('toggle-centroid').addEventListener('click', function() {
    mostrarCentroide = !mostrarCentroide;
    dibujarPoligono(puntos); // Redibujar el polígono
    if (mostrarCentroide) {
        dibujarLineasCentroide(puntos, centroide);
    }
});
