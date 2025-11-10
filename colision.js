// ===============================
// Configuración del canvas
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Algo de margen para dejar lugar al título
const window_height = window.innerHeight - 100;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

// ===============================
// Clase Chip (ficha/florecita)
// ===============================
class Chip {
  constructor(x, y, radius, colorCentro, colorBorde, speedY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colorCentro = colorCentro;
    this.colorBorde = colorBorde;
    this.speedY = speedY;
  }

  draw(context) {
    // Dibujamos una especie de ficha/flor: círculo con borde
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.colorCentro;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = this.colorBorde;
    context.stroke();
    context.closePath();
    context.restore();
  }

  update() {
    // Movimiento hacia abajo
    this.y += this.speedY;

    // Si sale por abajo, reaparece arriba con valores nuevos
    if (this.y - this.radius > canvas.height) {
      this.respawnTop();
    }
  }

  respawnTop() {
    this.y = -this.radius - Math.random() * 50; // un poco arriba del canvas
    this.x = Math.random() * canvas.width;
    this.speedY = 1 + Math.random() * 4; // entre 1 y 5
    // Nuevos colores aleatorios
    this.colorCentro = randomPastel();
    this.colorBorde = randomColor();
  }

  // ¿El punto (mx, my) está dentro de la ficha?
  isHit(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    const dist = Math.hypot(dx, dy);
    return dist <= this.radius;
  }
}

// ===============================
// Utilidades para colores
// ===============================
function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
}

function randomPastel() {
  // Pastel suave
  const r = 150 + Math.floor(Math.random() * 100);
  const g = 150 + Math.floor(Math.random() * 100);
  const b = 150 + Math.floor(Math.random() * 100);
  return `rgb(${r}, ${g}, ${b})`;
}

// ===============================
// Arreglo de fichas y contador
// ===============================
const chips = [];
const NUM_CHIPS = 12;

let eliminadas = 0;
const contadorSpan = document.getElementById("contador");

function crearChips() {
  for (let i = 0; i < NUM_CHIPS; i++) {
    const radius = 25 + Math.random() * 20;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const colorCentro = randomPastel();
    const colorBorde = randomColor();
    const speedY = 1 + Math.random() * 4; // velocidades diferentes
    chips.push(new Chip(x, y, radius, colorCentro, colorBorde, speedY));
  }
}

// ===============================
// Manejo de clics del mouse
// ===============================
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Revisar si se clickeó alguna ficha
  for (const chip of chips) {
    if (chip.isHit(mouseX, mouseY)) {
      eliminadas++;
      contadorSpan.textContent = eliminadas;

      // "Eliminar" la ficha: la reaparecemos arriba con nuevos valores
      chip.respawnTop();
      break; // solo una ficha por clic
    }
  }
});

// ===============================
// Bucle de animación
// ===============================
function animate() {
  // Limpiamos el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Actualizamos y dibujamos cada ficha
  chips.forEach((chip) => {
    chip.update();
    chip.draw(ctx);
  });

  requestAnimationFrame(animate);
}

// Inicializar
crearChips();
animate();

