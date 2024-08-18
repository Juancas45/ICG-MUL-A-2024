// Función para dibujar en el canvas (Rasterizado)
document.getElementById('draw-canvas').addEventListener('click', function() {
    const shape = document.getElementById('shape-canvas').value;
    const color = document.getElementById('color-canvas').value;
    let x = parseFloat(document.getElementById('x-canvas').value);
    let y = parseFloat(document.getElementById('y-canvas').value);
    const width = parseFloat(document.getElementById('width-canvas').value);
    const height = parseFloat(document.getElementById('height-canvas').value);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;

    switch (shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, width, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'rectangle':
            ctx.fillRect(x, y, width, height);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width / 2, y + height);
            ctx.lineTo(x - width / 2, y + height);
            ctx.closePath();
            ctx.fill();
            break;
    }
});

// Función para dibujar en el SVG (Vectorizado)
document.getElementById('draw-svg').addEventListener('click', function() {
    const shape = document.getElementById('shape-svg').value;
    const color = document.getElementById('color-svg').value;
    const x = parseFloat(document.getElementById('x-svg').value);
    const y = parseFloat(document.getElementById('y-svg').value);
    const width = parseFloat(document.getElementById('width-svg').value);
    const height = parseFloat(document.getElementById('height-svg').value);

    const svg = document.getElementById('svg');
    svg.innerHTML = ''; // Limpiar el SVG

    let shapeElement;

    switch (shape) {
        case 'circle':
            shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            shapeElement.setAttribute("cx", x);
            shapeElement.setAttribute("cy", y);
            shapeElement.setAttribute("r", width); // El ancho se usa como radio
            shapeElement.setAttribute("fill", color);
            break;
        case 'rectangle':
            shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shapeElement.setAttribute("x", x);
            shapeElement.setAttribute("y", y);
            shapeElement.setAttribute("width", width);
            shapeElement.setAttribute("height", height);
            shapeElement.setAttribute("fill", color);
            break;
        case 'triangle':
            shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            const points = `${x},${y} ${x + width / 2},${y + height} ${x - width / 2},${y + height}`;
            shapeElement.setAttribute("points", points);
            shapeElement.setAttribute("fill", color);
            break;
    }

    if (shapeElement) {
        svg.appendChild(shapeElement);
    }
});
