/**
 * ==========================================================================
 * VIENTO-ESCENA.JS - Motor de Física de Viento, Hojas del Árbol y Campo Floral
 * Genera hojas/pétalos cayendo del gran árbol dorado con oscilación 3D real,
 * olas de brisa y partículas de polen que se elevan del campo de flores.
 * ==========================================================================
 */

class VientoFloresEscena {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.hojas = [];
    this.motasPolen = [];
    this.activo = false;
    this.animId = null;
    this.ancho = 0;
    this.alto = 0;
    this.tiempo = 0;
    this.viento = 0.8; // Brisa suave hacia la derecha
    this.vientoObjetivo = 0.8;
    this.rafagas = [];

    this.maxHojas = 42;
    this.maxPolen = 28;

    this.redimensionar();
    window.addEventListener('resize', () => this.redimensionar());

    // Interacción: ráfaga de viento al mover el mouse o tocar
    this.configurarInteraccion();
    this.inicializarParticulas();
    this.iniciar();
  }

  redimensionar() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement || document.body;
    this.ancho = parent.clientWidth || window.innerWidth;
    this.alto = parent.clientHeight || window.innerHeight;
    this.canvas.width = this.ancho;
    this.canvas.height = this.alto;

    this.maxHojas = this.ancho < 768 ? 26 : 42;
    this.maxPolen = this.ancho < 768 ? 16 : 28;
  }

  configurarInteraccion() {
    const contenedor = this.canvas.parentElement || document.body;

    let ultimoMov = 0;
    contenedor.addEventListener('mousemove', (e) => {
      const ahora = performance.now();
      if (ahora - ultimoMov > 60) {
        ultimoMov = ahora;
        this.aplicarFuerzaViento(e.clientX, e.clientY, 1.2);
      }
    });

    contenedor.addEventListener('click', (e) => {
      this.crearExplosionHojas(e.clientX, e.clientY, 8);
    });
  }

  aplicarFuerzaViento(x, y, fuerza = 1.0) {
    // Empuja suavemente las hojas cercanas al cursor
    const radio = 140;
    for (const h of this.hojas) {
      const dx = h.x - x;
      const dy = h.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radio) {
        const factor = (1 - dist / radio) * fuerza;
        h.vx += (dx / dist) * factor * 1.5;
        h.vy += (dy / dist) * factor * 1.2;
        h.velocidadRotZ += (Math.random() - 0.5) * 0.08;
      }
    }
  }

  crearExplosionHojas(x, y, cantidad = 8) {
    for (let i = 0; i < cantidad; i++) {
      const angulo = Math.random() * Math.PI * 2;
      const vel = Math.random() * 3.5 + 1.5;
      this.hojas.push({
        x: x + Math.cos(angulo) * 10,
        y: y + Math.sin(angulo) * 10,
        vx: Math.cos(angulo) * vel,
        vy: Math.sin(angulo) * vel - 1.0,
        tamano: Math.random() * 8 + 12,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        velocidadRotX: (Math.random() - 0.5) * 0.06,
        velocidadRotY: (Math.random() - 0.5) * 0.08,
        velocidadRotZ: (Math.random() - 0.5) * 0.04,
        faseSeno: Math.random() * Math.PI * 2,
        amplitudSeno: Math.random() * 1.5 + 0.8,
        opacidad: 0.95,
        tipoColor: Math.floor(Math.random() * 3),
        esHoja: Math.random() > 0.45,
        vida: 1.0
      });
    }
  }

  /**
   * Sacude la copa del árbol: desata una ráfaga de viento y hace caer decenas de hojas doradas
   */
  sacudirArbol(clickX = null, clickY = null) {
    // 1. Ráfaga de viento poderosa
    this.viento = 5.0;
    this.vientoObjetivo = 0.8;

    // 2. Generar lluvia torrencial de hojas y pétalos desde la copa del árbol
    const cantidad = 40;
    for (let i = 0; i < cantidad; i++) {
      const h = this.crearHoja(false);
      h.x = this.ancho * (0.20 + Math.random() * 0.52);
      h.y = this.alto * (0.03 + Math.random() * 0.38);
      h.vx = Math.random() * 4.0 + 2.2;
      h.vy = Math.random() * 2.0 + 1.2;
      h.tamano = Math.random() * 10 + 13;
      h.velocidadRotX = (Math.random() - 0.5) * 0.12;
      h.velocidadRotY = (Math.random() - 0.5) * 0.16;
      h.velocidadRotZ = (Math.random() - 0.5) * 0.08;
      h.opacidad = 0.95;
      this.hojas.push(h);
    }

    // Mantener límite de rendimiento
    if (this.hojas.length > 95) {
      this.hojas.splice(0, this.hojas.length - 85);
    }
  }

  inicializarParticulas() {
    this.hojas = [];
    for (let i = 0; i < this.maxHojas; i++) {
      this.hojas.push(this.crearHoja(true));
    }

    this.motasPolen = [];
    for (let i = 0; i < this.maxPolen; i++) {
      this.motasPolen.push(this.crearMotaPolen(true));
    }
  }

  /**
   * Crea una hoja o pétalo dorado originado preferentemente en la copa del árbol
   */
  crearHoja(posicionInicialAleatoria = false) {
    // La copa del gran árbol se ubica aproximadamente entre X: 22% y 72%, Y: 0% y 40%
    const desdeArbol = Math.random() > 0.25; // 75% nacen del árbol
    let x, y;

    if (posicionInicialAleatoria) {
      x = Math.random() * this.ancho;
      y = Math.random() * this.alto;
    } else if (desdeArbol) {
      // Copa del árbol dorado
      x = this.ancho * (0.22 + Math.random() * 0.50);
      y = this.alto * (0.02 + Math.random() * 0.35);
    } else {
      // Arriba del borde superior con margen
      x = Math.random() * this.ancho;
      y = -20 - Math.random() * 40;
    }

    const tamano = Math.random() * 10 + 11; // 11px a 21px
    const esHoja = Math.random() > 0.5; // Hoja de sauce/árbol o pétalo de flor

    return {
      x,
      y,
      vx: Math.random() * 0.4 + 0.2,
      vy: Math.random() * 1.1 + 0.85,
      tamano,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      velocidadRotX: (Math.random() - 0.5) * 0.045,
      velocidadRotY: (Math.random() - 0.5) * 0.06,
      velocidadRotZ: (Math.random() - 0.5) * 0.025,
      faseSeno: Math.random() * Math.PI * 2,
      amplitudSeno: Math.random() * 1.6 + 0.9,
      velocidadSeno: Math.random() * 0.025 + 0.015,
      opacidad: Math.random() * 0.35 + 0.65,
      tipoColor: Math.floor(Math.random() * 4),
      esHoja,
      vida: 1.0
    };
  }

  /**
   * Crea una partícula de polen dorado brillante que se eleva suavemente desde el campo de flores
   */
  crearMotaPolen(inicial = false) {
    return {
      x: Math.random() * this.ancho,
      // Nacen en la mitad inferior de la pantalla (donde están las flores amarillas)
      y: inicial ? (this.alto * 0.48 + Math.random() * (this.alto * 0.52)) : (this.alto + 10 + Math.random() * 30),
      radio: Math.random() * 2.2 + 1.0,
      vx: (Math.random() - 0.35) * 0.6,
      vy: -(Math.random() * 0.7 + 0.35), // Ascienden suavemente
      fase: Math.random() * Math.PI * 2,
      velocidadFase: Math.random() * 0.03 + 0.02,
      brilloBase: Math.random() * 0.4 + 0.6,
      opacidad: Math.random() * 0.5 + 0.4
    };
  }

  iniciar() {
    if (this.activo) return;
    this.activo = true;
    const bucle = () => {
      if (!this.activo) return;
      this.actualizar();
      this.dibujar();
      this.animId = requestAnimationFrame(bucle);
    };
    this.animId = requestAnimationFrame(bucle);
  }

  detener() {
    this.activo = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  actualizar() {
    this.tiempo += 0.016;

    // Variación periódica del viento (brisa suave)
    if (Math.random() < 0.02) {
      this.vientoObjetivo = 0.5 + Math.sin(this.tiempo * 0.5) * 0.9;
    }
    this.viento += (this.vientoObjetivo - this.viento) * 0.04;

    // 1. Actualizar hojas del árbol
    for (let i = 0; i < this.hojas.length; i++) {
      const h = this.hojas[i];

      h.faseSeno += h.velocidadSeno;
      const balanceoX = Math.sin(h.faseSeno) * h.amplitudSeno;

      // Dinámica de caída con resistencia y viento
      h.x += h.vx + this.viento + balanceoX;
      h.y += h.vy;

      // Rotaciones 3D
      h.rotX += h.velocidadRotX;
      h.rotY += h.velocidadRotY;
      h.rotZ += h.velocidadRotZ;

      // Rozamiento suave en ráfagas
      h.vx *= 0.985;

      // Si sobrepasa el borde inferior o lateral, renace en la copa del árbol
      if (h.y > this.alto + 30 || h.x > this.ancho + 60 || h.x < -60) {
        this.hojas[i] = this.crearHoja(false);
      }
    }

    // 2. Actualizar motas de polen floral
    for (let i = 0; i < this.motasPolen.length; i++) {
      const p = this.motasPolen[i];
      p.fase += p.velocidadFase;
      p.x += p.vx + Math.sin(p.fase) * 0.4 + this.viento * 0.3;
      p.y += p.vy;

      // Si sube mucho o sale de pantalla, reaparece en el césped floral
      if (p.y < this.alto * 0.38 || p.x > this.ancho + 20 || p.x < -20) {
        this.motasPolen[i] = this.crearMotaPolen(false);
      }
    }
  }

  dibujar() {
    this.ctx.clearRect(0, 0, this.ancho, this.alto);

    // 1. Dibujar motas de polen floral dorado ascendente
    for (const p of this.motasPolen) {
      const pulsacion = (Math.sin(p.fase) * 0.3 + 0.7) * p.brilloBase;
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radio * 2.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${pulsacion})`);
      grad.addColorStop(0.3, `rgba(254, 240, 138, ${pulsacion * 0.9})`);
      grad.addColorStop(0.7, `rgba(245, 158, 11, ${pulsacion * 0.4})`);
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radio * 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Dibujar hojas y pétalos con proyección 3D simulada
    const paleta = [
      { base: '#ffd700', sombra: '#d97706', brillo: '#fef08a' }, // Oro luminoso
      { base: '#facc15', sombra: '#b45309', brillo: '#ffffff' }, // Amarillo intenso
      { base: '#fbbf24', sombra: '#92400e', brillo: '#fef3c7' }, // Ámbar dorado
      { base: '#ea580c', sombra: '#7c2d12', brillo: '#fed7aa' }  // Naranja otoñal suave
    ];

    for (const h of this.hojas) {
      const col = paleta[h.tipoColor];
      const escalaX = Math.cos(h.rotX);
      const escalaY = Math.sin(h.rotY);

      this.ctx.save();
      this.ctx.translate(h.x, h.y);
      this.ctx.rotate(h.rotZ);
      this.ctx.scale(escalaX, escalaY);

      this.ctx.globalAlpha = Math.max(0.1, Math.min(1.0, h.opacidad * (0.5 + Math.abs(escalaX) * 0.5)));

      if (h.esHoja) {
        // --- FORMA DE HOJA DEL ÁRBOL (Ovalada lanceolada con curvatura) ---
        const anchoHoja = h.tamano * 0.48;
        const largoHoja = h.tamano * 1.35;

        // Sombra suave proyectada en la brisa
        this.ctx.shadowColor = 'rgba(217, 119, 6, 0.45)';
        this.ctx.shadowBlur = 6;

        // Cuerpo de la hoja con gradiente
        const gradHoja = this.ctx.createLinearGradient(0, -largoHoja / 2, 0, largoHoja / 2);
        gradHoja.addColorStop(0, col.brillo);
        gradHoja.addColorStop(0.4, col.base);
        gradHoja.addColorStop(1, col.sombra);

        this.ctx.fillStyle = gradHoja;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -largoHoja / 2);
        this.ctx.bezierCurveTo(anchoHoja, -largoHoja * 0.2, anchoHoja * 0.9, largoHoja * 0.25, 0, largoHoja / 2);
        this.ctx.bezierCurveTo(-anchoHoja * 0.9, largoHoja * 0.25, -anchoHoja, -largoHoja * 0.2, 0, -largoHoja / 2);
        this.ctx.fill();

        // Nervadura central sutil dorada
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = 0.9;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -largoHoja * 0.42);
        this.ctx.quadraticCurveTo(anchoHoja * 0.1, 0, 0, largoHoja * 0.42);
        this.ctx.stroke();
      } else {
        // --- FORMA DE PÉTALO DE FLOR AMARILLA (Corazón suave / lágrima) ---
        const r = h.tamano * 0.7;

        this.ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        this.ctx.shadowBlur = 7;

        const gradPetalo = this.ctx.createRadialGradient(0, -r * 0.2, r * 0.1, 0, 0, r);
        gradPetalo.addColorStop(0, '#ffffff');
        gradPetalo.addColorStop(0.35, col.base);
        gradPetalo.addColorStop(1, col.sombra);

        this.ctx.fillStyle = gradPetalo;
        this.ctx.beginPath();
        this.ctx.moveTo(0, r);
        this.ctx.bezierCurveTo(r * 0.85, r * 0.7, r * 1.15, -r * 0.35, 0, -r);
        this.ctx.bezierCurveTo(-r * 1.15, -r * 0.35, -r * 0.85, r * 0.7, 0, r);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}

// Exportar globalmente
window.VientoFloresEscena = VientoFloresEscena;
