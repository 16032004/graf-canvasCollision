// Configuración del canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = window.innerHeight - 100;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

// ===============================
// Clase Circle
// ===============================
class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;

    this.originalColor = color;
    this.color = color;
    this.text = text;
    this.speed = speed;

    // Dirección aleatoria
    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;

    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.text, this.posX, this.posY);

    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update() {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en los bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

// ===============================
// Crear y animar círculos
// ===============================
let circles = [];

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    const radius = Math.random() * 30 + 20;
    const x = Math.random() * (window_width - radius * 2) + radius;
    const y = Math.random() * (window_height - radius * 2) + radius;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const speed = Math.random() * 4 + 1; // velocidades entre 1 y 5
    const text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// ===============================
// Detección de colisiones (v3.0)
// ===============================
function handleCollisions() {
  // Primero, devolver todos a su color original (por si ya no chocan)
  circles.forEach(c => {
    c.color = c.originalColor;
  });

  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const c1 = circles[i];
      const c2 = circles[j];

      const dx = c2.posX - c1.posX;
      const dy = c2.posY - c1.posY;
      const distance = Math.hypot(dx, dy); // √(dx² + dy²)

      // Colisión: distancia menor o igual a la suma de los radios
      if (distance <= c1.radius + c2.radius) {
        // ====== Color azul mientras haya colisión (B) ======
        c1.color = "#0000FF";
        c2.color = "#0000FF";

        // ====== Rebote (C) ======
        // Cuánto se traslapan
        const overlap = c1.radius + c2.radius - distance;

        // Ángulo de la línea que une los centros
        const angle = Math.atan2(dy, dx);

        // Separar ligeramente los círculos para que no se queden pegados
        const sepX = Math.cos(angle) * overlap / 2;
        const sepY = Math.sin(angle) * overlap / 2;

        c1.posX -= sepX;
        c1.posY -= sepY;
        c2.posX += sepX;
        c2.posY += sepY;

        // Invertir dirección de ambos (rebote simple)
        c1.dx = -c1.dx;
        c1.dy = -c1.dy;
        c2.dx = -c2.dx;
        c2.dy = -c2.dy;
      }
    }
  }
}

// ===============================
// Animación principal
// ===============================
function animate() {
  ctx.clearRect(0, 0, window_width, window_height);

  // Actualizar posiciones
  circles.forEach(c => c.update());

  // Detectar colisiones (color + rebote)
  handleCollisions();

  // Dibujar
  circles.forEach(c => c.draw(ctx));

  requestAnimationFrame(animate);
}

generateCircles(15);
animate();
