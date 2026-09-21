/**
 * ==========================================================================
 * PETALOS.JS - Sistema de Partículas Canvas de Alta Fidelidad
 * Lluvia armónica y global de pétalos amarillos, luciérnagas y destellos al clic
 * ==========================================================================
 */

class SistemaParticulas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.petalos = [];
    this.luciernagas = [];
    this.chispas = [];
    this.ancho = 0;
    this.alto = 0;
    this.maxPetalos = 45;
    this.cantidadLuciernagas = 24;
    this.lluviaIntensa = false;
    this.vientoGlobal = 0;
    this.tiempo = 0;

    this.ajustarDimensiones();
    window.addEventListener('resize', () => this.ajustarDimensiones());
    this.inicializar();
    this.iniciarBucle();
  }

  ajustarDimensiones() {
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    this.canvas.width = this.ancho;
    this.canvas.height = this.alto;

    if (this.ancho < 640) {
      this.maxPetalos = this.lluviaIntensa ? 55 : 30;
      this.cantidadLuciernagas = 16;
    } else {
      this.maxPetalos = this.lluviaIntensa ? 85 : 45;
      this.cantidadLuciernagas = 28;
    }

    // Asegurar que la cantidad de pétalos se mantenga en el límite
    if (this.petalos.length > this.maxPetalos) {
      this.petalos.length = this.maxPetalos;
    }
  }

  inicializar() {
    this.petalos = [];
    // Distribuir los pétalos equitativamente en todo el ancho y alto al inicio
    for (let i = 0; i < this.maxPetalos; i++) {
      this.petalos.push(this.crearPetalo(true, (i / this.maxPetalos) * this.ancho));
    }

    this.luciernagas = [];
    for (let i = 0; i < this.cantidadLuciernagas; i++) {
      this.luciernagas.push(this.crearLuciernaga());
    }
  }

  /**
   * Crea un pétalo con distribución homogénea en el ancho de la pantalla
   */
  crearPetalo(aleatorioY = false, xFija = null) {
    // Si no se da una X específica, se distribuye en todo el ancho con margen
    const xBase = xFija !== null ? xFija : Math.random() * (this.ancho + 80) - 40;

    return {
      x: xBase,
      y: aleatorioY ? Math.random() * this.alto : -20 - Math.random() * 80,
      tamano: Math.random() * 8 + 14, // 14px a 22px
      velocidadY: Math.random() * 1.3 + 0.85,
      velocidadX: Math.random() * 0.5 - 0.25,
      angulo: Math.random() * Math.PI * 2,
      velocidadAngulo: (Math.random() - 0.5) * 0.025,
      oscilacion: Math.random() * Math.PI * 2,
      velocidadOscilacion: Math.random() * 0.018 + 0.012,
      amplitudOscilacion: Math.random() * 1.8 + 0.8,
      opacidad: Math.random() * 0.35 + 0.65,
      curvaProfundidad: Math.random() * 0.4 + 0.8, // Escala de profundidad
      colorGradiente: [
        '#ffd700', // Dorado clásico
        '#facc15', // Amarillo solar cálido
        '#f59e0b', // Ámbar dorado
        '#fef08a'  // Luz dorada clara
      ][Math.floor(Math.random() * 4)]
    };
  }

  crearLuciernaga() {
    return {
      x: Math.random() * this.ancho,
      y: Math.random() * (this.alto * 0.75),
      radio: Math.random() * 2 + 1.2,
      velocidadX: (Math.random() - 0.5) * 0.5,
      velocidadY: (Math.random() - 0.5) * 0.5,
      brillo: Math.random(),
      velocidadBrillo: Math.random() * 0.025 + 0.015,
      direccionBrillo: 1
    };
  }

  /**
   * Explosión interactiva de destellos sin acumular pétalos en un rincón
   */
  crearExplosion(x, y) {
    const totalChispas = 22;
    for (let i = 0; i < totalChispas; i++) {
      const angulo = (Math.PI * 2 * i) / totalChispas + (Math.random() - 0.5) * 0.3;
      const fuerza = Math.random() * 5 + 2.5;
      this.chispas.push({
        x: x,
        y: y,
        vx: Math.cos(angulo) * fuerza,
        vy: Math.sin(angulo) * fuerza,
        vida: 1.0,
        degradacion: Math.random() * 0.022 + 0.016,
        tamano: Math.random() * 4 + 2,
        color: ['#ffd700', '#facc15', '#ffffff', '#fb923c', '#fef08a'][Math.floor(Math.random() * 5)]
      });
    }

    // Efecto suave: reubicar 2 pétalos existentes en la parte superior para que sigan cayendo en toda la pantalla
    if (this.petalos.length < this.maxPetalos) {
      this.petalos.push(this.crearPetalo(false));
    }
  }

  toggleLluviaIntensa() {
    this.lluviaIntensa = !this.lluviaIntensa;
    this.ajustarDimensiones();

    // Si se activa la lluvia intensa, repartir pétalos por TODO el ancho
    if (this.lluviaIntensa) {
      const cantidadExtra = this.maxPetalos - this.petalos.length;
      for (let i = 0; i < cantidadExtra; i++) {
        this.petalos.push(this.crearPetalo(false, (i / cantidadExtra) * this.ancho));
      }
    } else {
      if (this.petalos.length > this.maxPetalos) {
        this.petalos.length = this.maxPetalos;
      }
    }
    return this.lluviaIntensa;
  }

  actualizar() {
    this.tiempo += 0.01;
    this.vientoGlobal = Math.sin(this.tiempo * 0.5) * 0.6; // Suave brisa oscilante

    // 1. Actualizar Pétalos con distribución homogénea
    for (let i = 0; i < this.petalos.length; i++) {
      const p = this.petalos[i];
      p.oscilacion += p.velocidadOscilacion;
      p.x += Math.sin(p.oscilacion) * p.amplitudOscilacion + p.velocidadX + this.vientoGlobal;
      p.y += p.velocidadY;
      p.angulo += p.velocidadAngulo;

      // Si el pétalo sale por abajo o costados, reubicarlo arriba DISTRIBUIDO en todo el ancho
      if (p.y > this.alto + 35 || p.x < -60 || p.x > this.ancho + 60) {
        this.petalos[i] = this.crearPetalo(false);
      }
    }

    // 2. Actualizar Luciérnagas
    for (let i = 0; i < this.luciernagas.length; i++) {
      const l = this.luciernagas[i];
      l.x += l.velocidadX;
      l.y += l.velocidadY;

      if (l.x < 0 || l.x > this.ancho) l.velocidadX *= -1;
      if (l.y < 0 || l.y > this.alto * 0.8) l.velocidadY *= -1;

      l.brillo += l.velocidadBrillo * l.direccionBrillo;
      if (l.brillo >= 1) {
        l.brillo = 1;
        l.direccionBrillo = -1;
      } else if (l.brillo <= 0.15) {
        l.brillo = 0.15;
        l.direccionBrillo = 1;
      }
    }

    // 3. Actualizar Chispas Interactivas
    for (let i = this.chispas.length - 1; i >= 0; i--) {
      const c = this.chispas[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.09; // Gravedad suave
      c.vx *= 0.97; // Fricción
      c.vida -= c.degradacion;

      if (c.vida <= 0) {
        this.chispas.splice(i, 1);
      }
    }
  }

  dibujar() {
    this.ctx.clearRect(0, 0, this.ancho, this.alto);

    // 1. Dibujar Luciérnagas
    for (let l of this.luciernagas) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, l.radio, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(254, 240, 138, ${l.brillo * 0.95})`;
      this.ctx.shadowColor = 'rgba(250, 204, 21, 0.9)';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Dibujar Pétalos Amarillos con textura y curvatura
    for (let p of this.petalos) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angulo);
      // Efecto 3D de balanceo
      const escalaX = Math.cos(p.oscilacion) * p.curvaProfundidad;
      this.ctx.scale(escalaX, 1);

      this.ctx.beginPath();
      const w = p.tamano * 0.55;
      const h = p.tamano * 1.35;
      this.ctx.moveTo(0, -h / 2);
      this.ctx.quadraticCurveTo(w, 0, 0, h / 2);
      this.ctx.quadraticCurveTo(-w, 0, 0, -h / 2);

      this.ctx.fillStyle = p.colorGradiente;
      this.ctx.globalAlpha = p.opacidad;
      this.ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();

      // Nervadura sutil del pétalo
      this.ctx.beginPath();
      this.ctx.moveTo(0, -h / 2.2);
      this.ctx.lineTo(0, h / 2.3);
      this.ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 3. Dibujar Chispas de Clic
    for (let c of this.chispas) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.tamano * c.vida, 0, Math.PI * 2);
      this.ctx.fillStyle = c.color;
      this.ctx.globalAlpha = c.vida;
      this.ctx.shadowColor = c.color;
      this.ctx.shadowBlur = 14;
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  iniciarBucle() {
    const animar = () => {
      this.actualizar();
      this.dibujar();
      requestAnimationFrame(animar);
    };
    requestAnimationFrame(animar);
  }
}

window.SistemaParticulas = SistemaParticulas;
