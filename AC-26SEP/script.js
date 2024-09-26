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

class Linea {
    #p1;
    #p2;

    constructor(x1, y1, x2, y2) {
        this.#p1 = new Punto(x1, y1);
        this.#p2 = new Punto(x2, y2);
    }

    dibujar(svg) {
        const puntos = this.bresenham();
        puntos.forEach(p => {
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", p.x);
            point.setAttribute("cy", p.y);
            point.setAttribute("r", 1);
            point.setAttribute("fill", "black");
            svg.appendChild(point);
        });
    }

    bresenham() {
        const puntos = [];
        let x1 = this.#p1.x;
        let y1 = this.#p1.y;
        let x2 = this.#p2.x;
        let y2 = this.#p2.y;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const sx = dx > 0 ? 1 : -1;
        const sy = dy > 0 ? 1 : -1;
        let err = dx > dy ? dx / 2 : -dy / 2;

        while (true) {
            puntos.push(new Punto(x1, y1));

            if (x1 === x2 && y1 === y2) break;

            err -= Math.abs(dy);
            if (err < 0) {
                y1 += sy;
                err += dx;
            }
            err += Math.abs(dx);
            if (err > 0) {
                x1 += sx;
                err -= dy;
            }
        }

        return puntos;
    }
}

class Circunferencia {
    #centro;
    #radio;

    constructor(cx, cy, radio) {
        this.#centro = new Punto(cx, cy);
        this.#radio = radio;
    }

    dibujar(svg) {
        const puntos = this.bresenham();
        puntos.forEach(p => {
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", p.x);
            point.setAttribute("cy", p.y);
            point.setAttribute("r", 1); // Radio pequeño para representar el punto
            point.setAttribute("fill", "black");
            svg.appendChild(point);
        });
    }

    bresenham() {
        const puntos = [];
        let x0 = this.#centro.x;
        let y0 = this.#centro.y;
        let r = this.#radio;

        let x = r;
        let y = 0;
        let err = 1 - r;

        while (x >= y) {
            // Para cada octante
            puntos.push(new Punto(x0 + x, y0 + y));
            puntos.push(new Punto(x0 + y, y0 + x));
            puntos.push(new Punto(x0 - y, y0 + x));
            puntos.push(new Punto(x0 - x, y0 + y));
            puntos.push(new Punto(x0 - x, y0 - y));
            puntos.push(new Punto(x0 - y, y0 - x));
            puntos.push(new Punto(x0 + y, y0 - x));
            puntos.push(new Punto(x0 + x, y0 - y));

            y++;
            if (err < 0) {
                err += 2 * y + 1;
            } else {
                x--;
                err += 2 * (y - x + 1);
            }
        }

        return puntos;
    }
}

class Elipse {
    #centro;
    #a;
    #b;

    constructor(cx, cy, a, b) {
        this.#centro = new Punto(cx, cy);
        this.#a = a;
        this.#b = b;
    }

    dibujar(svg) {
        const puntos = this.bresenham();
        puntos.forEach(p => {
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", p.x);
            point.setAttribute("cy", p.y);
            point.setAttribute("r", 1); // Radio pequeño para representar el punto
            point.setAttribute("fill", "black");
            svg.appendChild(point);
        });
    }

    bresenham() {
        const puntos = [];
        let x0 = this.#centro.x;
        let y0 = this.#centro.y;
        let a = this.#a;
        let b = this.#b;
    
        let a2 = a * a;
        let b2 = b * b;
        let fa2 = 4 * a2;
        let fb2 = 4 * b2;
    
        let x = 0;
        let y = b;
    
        // Punto inicial
        let sigma = 2 * b2 + a2 * (1 - 2 * b);
        
        // Región 1
        while (b2 * x <= a2 * y) {
            // Duplicar puntos en esta sección
            puntos.push(new Punto(x0 + x, y0 + y));
            puntos.push(new Punto(x0 - x, y0 + y));
            puntos.push(new Punto(x0 + x, y0 - y));
            puntos.push(new Punto(x0 - x, y0 - y));
            
            x++;
            if (sigma >= 0) {
                y--;
                sigma += fa2 * (1 - y);
            }
            sigma += b2 * (2 * x + 1);
        }
    
        // Región 2
        x = a;
        y = 0;
        sigma = 2 * a2 + b2 * (1 - 2 * a);
    
        while (a2 * y <= b2 * x) {
            // Duplicar puntos en esta sección
            puntos.push(new Punto(x0 + x, y0 + y));
            puntos.push(new Punto(x0 - x, y0 + y));
            puntos.push(new Punto(x0 + x, y0 - y));
            puntos.push(new Punto(x0 - x, y0 - y));
    
            y++;
            if (sigma >= 0) {
                x--;
                sigma += fb2 * (1 - x);
            }
            sigma += a2 * (2 * y + 1);
        }
    
        return puntos;
    }
    
}


// Crear instancias y dibujar en el SVG
const svgCanvas = document.getElementById('svgCanvas');

const linea = new Linea(50, 50, 200, 200);
linea.dibujar(svgCanvas);

const circunferencia = new Circunferencia(300, 100, 50);
circunferencia.dibujar(svgCanvas);

const elipse = new Elipse(400, 300, 80, 50); // Crear una elipse
elipse.dibujar(svgCanvas); // Dibujar la elipse
