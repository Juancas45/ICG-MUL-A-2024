class Linea {
    constructor(x1, y1, x2, y2) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
    }

    dibujar(svg) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", this._x1);
        line.setAttribute("y1", this._y1);
        line.setAttribute("x2", this._x2);
        line.setAttribute("y2", this._y2);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);
    }
}

class Circunferencia {
    constructor(cx, cy, radio) {
        this._cx = cx;
        this._cy = cy;
        this._radio = radio;
    }

    dibujar(svg) {
        const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circ.setAttribute("cx", this._cx);
        circ.setAttribute("cy", this._cy);
        circ.setAttribute("r", this._radio);
        circ.setAttribute("stroke", "black");
        circ.setAttribute("fill", "none");
        svg.appendChild(circ);
    }
}

class Elipse {
    constructor(cx, cy, a, b) {
        this._cx = cx;
        this._cy = cy;
        this._a = a;
        this._b = b;
    }

    dibujar(svg) {
        const elipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        elipse.setAttribute("cx", this._cx);
        elipse.setAttribute("cy", this._cy);
        elipse.setAttribute("rx", this._a);
        elipse.setAttribute("ry", this._b);
        elipse.setAttribute("stroke", "black");
        elipse.setAttribute("fill", "none");
        svg.appendChild(elipse);
    }
}

// Crear instancias y dibujar en el SVG
const svgCanvas = document.getElementById('svgCanvas');

const linea = new Linea(50, 50, 200, 200);
linea.dibujar(svgCanvas);

const circunferencia = new Circunferencia(300, 100, 50);
circunferencia.dibujar(svgCanvas);

const elipse = new Elipse(400, 300, 80, 50);
elipse.dibujar(svgCanvas);