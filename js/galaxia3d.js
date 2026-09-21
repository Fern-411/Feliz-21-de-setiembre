/**
 * ==========================================================================
 * GALAXIA3D.JS - Motor WebGL Three.js para la Galaxia de Flores Amarillas
 * - Vuelo espacial de entrada (Túnel oscuro con flores que viajan hacia la cámara)
 * - Galaxia espiral dorada 3D con corazón celestial de polvo de estrellas mejorado
 * - Onda expansiva dorada con hojas y pétalos que revolotean en 3D
 * - Lluvia notoria de meteoros / estrellas fugaces en 3D con estelas luminosas
 * - Auto-rotación continua al dejar la pantalla sin tocar (modo idle)
 * - Ramos y flores amarillas orbitando con etiquetas y detección de clics
 * ==========================================================================
 */

class GalaxiaFlores3D {
  constructor(containerId, onFlorClickCallback) {
    this.container = document.getElementById(containerId);
    this.onFlorClick = onFlorClickCallback;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Grupos principales
    this.warpGroup = new THREE.Group();     // Túnel espacial de entrada
    this.galaxyGroup = new THREE.Group();   // Galaxia espiral + Corazón + Flores
    this.floresInteractivos = [];           // Objetos clickeables

    // Control de vuelo y cámara
    this.faseActual = 'idle'; // 'idle', 'warp', 'galaxia'
    this.tiempoVuelo = 0;
    this.duracionVuelo = 4.8; // segundos de acercamiento cinematográfico
    
    // Controles orbitales personalizados
    this.isDragging = false;
    this.hasMoved = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.spherical = {
      radius: 260,
      theta: 0.8,   // Ángulo azimutal
      phi: 1.15     // Ángulo polar (inclinación)
    };
    this.targetSpherical = { ...this.spherical };
    this.autoRotacion = true;
    this.velocidadAutoRotacion = 0.0024;
    this.ultimoInteraccionTiempo = Date.now();
    this.tiempoParaReanudarAutoRotacion = 1400; // 1.4s de inactividad para reanudar giro

    // Onda expansiva y hojas revoloteando
    this.ondasActivas = [];
    this.hojasRevoloteando = [];

    // Sistema de meteoros 3D
    this.meteorosActivos = [];
    this.modoMeteorosIntenso = false;
    this.tiempoUltimoMeteoro = 0;

    // Constelaciones especiales de los 3 amigos (Palomita 🕊️, Víbora Sagrada 🐍, Zorrito 🦊)
    this.constelacionesAmigos = [];

    // Sistema de doble corazón concéntrico de polvo estelar
    this.heartOuterPoints = null;
    this.heartInnerPoints = null;
    this.heartBridgePoints = null;

    // Materiales y texturas generadas
    this.texturas = {};

    this.init();
  }

  // ========================================================================
  // 1. INICIALIZACIÓN DE THREE.JS
  // ========================================================================
  init() {
    // Escena
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070f, 0.0011);

    // Cámara
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.5,
      4500
    );
    this.camera.position.set(0, 50, 1750); // Comienza lejos para el vuelo

    // Renderizador WebGL
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Iluminación cósmica
    const ambientLight = new THREE.AmbientLight(0xfff4cc, 1.3);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 4.0, 700);
    pointLight.position.set(0, 60, 0);
    this.scene.add(pointLight);

    const goldDirLight = new THREE.DirectionalLight(0xffb703, 1.6);
    goldDirLight.position.set(120, 220, 120);
    this.scene.add(goldDirLight);

    // Generar texturas procedurales botánicas y celestiales
    this.generarTexturasProcedurales();

    // Construir sistemas 3D
    this.construirTunelEspacialWarp();
    this.construirGalaxiaEspiral();
    this.construirCorazonPolvoEstelar();
    this.construirFloresYEtiquetasOrbitales();
    this.construirConstelacionesAmigos();
    this.construirHojasRevoloteando();
    this.construirSistemaMeteoros3D();

    this.scene.add(this.warpGroup);
    this.scene.add(this.galaxyGroup);

    // La galaxia inicia semi-oculta hasta que el vuelo llega al centro
    this.galaxyGroup.visible = true;
    this.galaxyGroup.scale.set(0.05, 0.05, 0.05);

    // Eventos de ventana y controles
    this.setupEventListeners();

    // Iniciar bucle de render
    this.clock = new THREE.Clock();
    this.animate();
  }

  // ========================================================================
  // 2. GENERADOR DE TEXTURAS PROCEDURALES BOTÁNICAS
  // ========================================================================
  generarTexturasProcedurales() {
    // 2.1 Partícula de estrella dorada con resplandor
    const canvasParticula = document.createElement('canvas');
    canvasParticula.width = 128;
    canvasParticula.height = 128;
    const ctxP = canvasParticula.getContext('2d');
    const gradP = ctxP.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradP.addColorStop(0, '#ffffff');
    gradP.addColorStop(0.25, '#fef08a');
    gradP.addColorStop(0.55, '#f59e0b');
    gradP.addColorStop(0.85, 'rgba(234, 88, 12, 0.35)');
    gradP.addColorStop(1, 'rgba(0,0,0,0)');
    ctxP.fillStyle = gradP;
    ctxP.fillRect(0, 0, 128, 128);
    this.texturas.particula = new THREE.CanvasTexture(canvasParticula);

    // 2.2 Girasol Realista Individual
    this.texturas.girasol = this.crearCanvasGirasol();

    // 2.3 Ramo de Girasoles con Lazo Satinado
    this.texturas.ramoGirasoles = this.crearCanvasRamoGirasoles();

    // 2.4 Ramo de Rosas Amarillas
    this.texturas.ramoRosas = this.crearCanvasRamoRosas();

    // 2.5 Ramillete en Cono
    this.texturas.ramillete = this.crearCanvasRamillete();

    // 2.6 Ramo Central Majestuoso Rediseñado (Orgánico y Botánico, sin cono plano)
    this.texturas.ramoCentral = this.crearCanvasRamoCentral();

    // 2.7 Texturas para pétalos y hojas revoloteando
    this.texturas.petaloSuelto = this.crearCanvasPetaloSuelto();
    this.texturas.hojaVerde = this.crearCanvasHojaVerde();

    // 2.8 Textura para la cabeza luminosa del meteoro
    const canvasMeteoro = document.createElement('canvas');
    canvasMeteoro.width = 128;
    canvasMeteoro.height = 128;
    const ctxM = canvasMeteoro.getContext('2d');
    const gradM = ctxM.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradM.addColorStop(0, '#ffffff');
    gradM.addColorStop(0.2, '#fef08a');
    gradM.addColorStop(0.6, '#f59e0b');
    gradM.addColorStop(1, 'rgba(0,0,0,0)');
    ctxM.fillStyle = gradM;
    ctxM.fillRect(0, 0, 128, 128);
    this.texturas.cabezaMeteoro = new THREE.CanvasTexture(canvasMeteoro);

    // 2.9 Texturas celestiales para las constelaciones de los 3 amigos
    this.texturas.palomitaCelestial = this.crearCanvasPalomitaCelestial();
    this.texturas.viboraCelestial = this.crearCanvasViboraCelestial();
    this.texturas.zorritoCelestial = this.crearCanvasZorritoCelestial();
  }

  crearCanvasGirasol() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 256;

    // Halo cálido dorado
    const halo = ctx.createRadialGradient(cx, cy, 50, cx, cy, 250);
    halo.addColorStop(0, 'rgba(255, 220, 50, 0.45)');
    halo.addColorStop(0.5, 'rgba(245, 158, 11, 0.18)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Sépalos verdes sutiles de fondo
    ctx.save();
    ctx.translate(cx, cy);
    for (let s = 0; s < 12; s++) {
      ctx.rotate((Math.PI * 2) / 12);
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.ellipse(0, -170, 16, 45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Capa exterior de pétalos (20 pétalos largos y elegantes)
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 20; i++) {
      ctx.rotate((Math.PI * 2) / 20);
      const grad = ctx.createLinearGradient(0, 0, 0, -220);
      grad.addColorStop(0, '#c2410c');
      grad.addColorStop(0.18, '#ea580c');
      grad.addColorStop(0.48, '#f59e0b');
      grad.addColorStop(0.85, '#ffd700');
      grad.addColorStop(1, '#fef08a');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.bezierCurveTo(-26, -115, -22, -188, 0, -225);
      ctx.bezierCurveTo(22, -188, 26, -115, 0, -50);
      ctx.fill();

      // Brillo en la nervadura del pétalo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, -200);
      ctx.stroke();
    }

    // Capa interior de pétalos intercalados (20 pétalos medianos)
    ctx.rotate((Math.PI * 2) / 40);
    for (let j = 0; j < 20; j++) {
      ctx.rotate((Math.PI * 2) / 20);
      const gradInner = ctx.createLinearGradient(0, 0, 0, -175);
      gradInner.addColorStop(0, '#78350f');
      gradInner.addColorStop(0.2, '#d97706');
      gradInner.addColorStop(0.65, '#fbbf24');
      gradInner.addColorStop(0.95, '#fffbeb');
      ctx.fillStyle = gradInner;

      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.bezierCurveTo(-20, -90, -18, -145, 0, -180);
      ctx.bezierCurveTo(18, -145, 20, -90, 0, -40);
      ctx.fill();
    }
    ctx.restore();

    // Corona de pequeñas flores del disco
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#92400e';
    for (let f = 0; f < 32; f++) {
      ctx.rotate((Math.PI * 2) / 32);
      ctx.beginPath();
      ctx.arc(0, -78, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Disco central aterciopelado
    const seedGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
    seedGrad.addColorStop(0, '#572607');
    seedGrad.addColorStop(0.45, '#381602');
    seedGrad.addColorStop(0.85, '#1c0800');
    seedGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = seedGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 78, 0, Math.PI * 2);
    ctx.fill();

    // Espiral de semillas Fibonacci con polvo estelar dorado
    for (let r = 12; r < 76; r += 4.5) {
      const puntos = Math.floor(r * 2.1);
      for (let p = 0; p < puntos; p++) {
        const ang = (p / puntos) * Math.PI * 2 + r * 0.9;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r;
        ctx.fillStyle = (p % 2 === 0) ? 'rgba(251, 191, 36, 0.75)' : 'rgba(245, 158, 11, 0.6)';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }

  crearCanvasRamoGirasoles() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 230;

    // Resplandor cálido de fondo
    const halo = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
    halo.addColorStop(0, 'rgba(255, 230, 80, 0.45)');
    halo.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // 1. Follaje botánico de eucalipto extendiéndose naturalmente
    const dibujarRamaEucalipto = (x, y, rot, escala) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(escala, escala);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -60, -5, -120);
      ctx.stroke();

      const hojasPos = [-25, -55, -85, -115];
      hojasPos.forEach((hp, idx) => {
        const side = (idx % 2 === 0) ? -1 : 1;
        ctx.fillStyle = (idx % 2 === 0) ? '#166534' : '#22c55e';
        ctx.beginPath();
        ctx.ellipse(side * 18, hp, 18, 12, side * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.restore();
    };

    dibujarRamaEucalipto(170, 260, -0.65, 1.1);
    dibujarRamaEucalipto(342, 260, 0.65, 1.1);
    dibujarRamaEucalipto(120, 200, -1.05, 0.95);
    dibujarRamaEucalipto(392, 200, 1.05, 0.95);
    dibujarRamaEucalipto(210, 130, -0.3, 0.9);
    dibujarRamaEucalipto(302, 130, 0.3, 0.9);

    // 2. Tallos botánicos naturales agrupados en la base (NO cono rígido)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#166534';
    ctx.lineCap = 'round';
    for (let s = -35; s <= 35; s += 10) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.6, cy + 95);
      ctx.quadraticCurveTo(cx + s * 0.25, cy + 175, cx + s * 0.75, cy + 245);
      ctx.stroke();
    }

    // 3. Estampado de girasoles ricos en varias profundidades
    const girasolImg = this.texturas.girasol.image;
    ctx.drawImage(girasolImg, 80, 75, 175, 175);
    ctx.drawImage(girasolImg, 255, 75, 175, 175);
    ctx.drawImage(girasolImg, 168, 18, 175, 175);
    ctx.drawImage(girasolImg, 115, 140, 190, 190);
    ctx.drawImage(girasolImg, 208, 140, 190, 190);

    // 4. Flores pequeñas de relleno (baby's breath / nubecitas doradas)
    ctx.fillStyle = '#fef08a';
    const puntosNube = [
      [135, 130], [375, 130], [256, 120], [180, 240], [330, 240]
    ];
    puntosNube.forEach(([bx, by]) => {
      for (let p = 0; p < 6; p++) {
        const ox = (Math.sin(p * 2.5) * 22);
        const oy = (Math.cos(p * 2.5) * 22);
        ctx.beginPath();
        ctx.arc(bx + ox, by + oy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Lazo de satén dorado y cintas colgantes
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 175, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(cx - 36, cy + 172, 28, 15, -0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + 36, cy + 172, 28, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 185);
    ctx.quadraticCurveTo(cx - 40, cy + 225, cx - 25, cy + 265);
    ctx.moveTo(cx + 15, cy + 185);
    ctx.quadraticCurveTo(cx + 40, cy + 225, cx + 25, cy + 265);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  crearCanvasRamoRosas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 230;

    // Resplandor cálido
    const halo = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
    halo.addColorStop(0, 'rgba(255, 230, 80, 0.45)');
    halo.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Hojas de rosas alrededor
    const dibujarHojaRosa = (x, y, ang, w, h) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      const gradLeaf = ctx.createLinearGradient(-w, 0, w, 0);
      gradLeaf.addColorStop(0, '#166534');
      gradLeaf.addColorStop(0.5, '#22c55e');
      gradLeaf.addColorStop(1, '#15803d');
      ctx.fillStyle = gradLeaf;
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    dibujarHojaRosa(150, 270, -0.6, 42, 18);
    dibujarHojaRosa(362, 270, 0.6, 42, 18);
    dibujarHojaRosa(100, 190, -1.1, 38, 16);
    dibujarHojaRosa(412, 190, 1.1, 38, 16);
    dibujarHojaRosa(200, 95, -0.4, 36, 15);
    dibujarHojaRosa(312, 95, 0.4, 36, 15);

    // Tallos naturales atados
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#14532d';
    ctx.lineCap = 'round';
    for (let s = -30; s <= 30; s += 10) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.6, cy + 95);
      ctx.quadraticCurveTo(cx + s * 0.3, cy + 175, cx + s * 0.75, cy + 245);
      ctx.stroke();
    }

    // Dibujar rosa de jardín aterciopelada
    const dibujarRosaRealista = (rx, ry, radio) => {
      ctx.save();
      ctx.translate(rx, ry);

      const gradR = ctx.createRadialGradient(0, 0, 5, 0, 0, radio);
      gradR.addColorStop(0, '#ffffff');
      gradR.addColorStop(0.3, '#fef08a');
      gradR.addColorStop(0.65, '#f59e0b');
      gradR.addColorStop(1, '#c2410c');
      ctx.fillStyle = gradR;
      ctx.beginPath();
      ctx.arc(0, 0, radio, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(120, 53, 15, 0.6)';
      ctx.lineWidth = 3.2;

      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.88, 0.2, 3.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.85, 3.2, 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.65, 1.0, 4.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.62, 4.5, 1.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.38, 0, 5.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radio * 0.18, 2, 7.5);
      ctx.stroke();

      ctx.restore();
    };

    dibujarRosaRealista(185, 100, 54);
    dibujarRosaRealista(325, 100, 54);
    dibujarRosaRealista(256, 45, 52);
    dibujarRosaRealista(175, 185, 60);
    dibujarRosaRealista(335, 185, 60);
    dibujarRosaRealista(256, 140, 68);

    // Nubecitas de flores blancas y doradas
    ctx.fillStyle = '#ffffff';
    for (let b = 0; b < 24; b++) {
      const bx = 130 + (b * 11) % 250;
      const by = 50 + (b * 19) % 190;
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lazo satinado de oro envolvente (NO maceta blanca rígida)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 175, 48, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 185);
    ctx.quadraticCurveTo(cx - 35, cy + 225, cx - 20, cy + 265);
    ctx.moveTo(cx + 15, cy + 185);
    ctx.quadraticCurveTo(cx + 35, cy + 225, cx + 20, cy + 265);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  crearCanvasRamillete() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 230;

    // Resplandor cálido
    const halo = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
    halo.addColorStop(0, 'rgba(255, 230, 80, 0.45)');
    halo.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Hojas finas y espigas de campo
    for (let e = -35; e <= 35; e += 14) {
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + e * 0.4, cy + 90);
      ctx.lineTo(cx + e * 3.5, cy - 140 + Math.abs(e) * 1.5);
      ctx.stroke();
    }

    // Tallos naturales atados
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#166534';
    ctx.lineCap = 'round';
    for (let s = -25; s <= 25; s += 8) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.5, cy + 85);
      ctx.quadraticCurveTo(cx + s * 0.2, cy + 165, cx + s * 0.65, cy + 240);
      ctx.stroke();
    }

    // Flores silvestres y margaritas amarillas
    const dibujarMargarita = (mx, my, rad) => {
      ctx.save();
      ctx.translate(mx, my);
      for (let p = 0; p < 12; p++) {
        ctx.rotate((Math.PI * 2) / 12);
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(0, -rad * 0.6, rad * 0.22, rad * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    dibujarMargarita(165, 80, 38);
    dibujarMargarita(345, 80, 38);
    dibujarMargarita(256, 35, 42);
    dibujarMargarita(175, 155, 46);
    dibujarMargarita(335, 155, 46);
    dibujarMargarita(256, 115, 52);

    // Pequeñas campanitas doradas
    for (let c = 0; c < 16; c++) {
      const cxPos = 135 + (c * 17) % 240;
      const cyPos = 60 + (c * 23) % 150;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atado con cuerda de rafia y lazo de oro (NO cono marrón rígido)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 155, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy + 165);
    ctx.quadraticCurveTo(cx - 30, cy + 205, cx - 18, cy + 245);
    ctx.moveTo(cx + 12, cy + 165);
    ctx.quadraticCurveTo(cx + 30, cy + 205, cx + 18, cy + 245);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  // REDISEÑO TOTAL DEL RAMO CENTRAL (Orgánico, Botánico y Majestuoso)
  crearCanvasRamoCentral() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 240;

    // Resplandor cálido esférico de fondo
    const halo = ctx.createRadialGradient(cx, cy, 30, cx, cy, 240);
    halo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    halo.addColorStop(0.3, 'rgba(254, 240, 138, 0.8)');
    halo.addColorStop(0.65, 'rgba(245, 158, 11, 0.35)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Hojas botánicas ricas que rodean la copa del ramo
    const dibujarFollaje = (x, y, ang, w, h) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      const gradLeaf = ctx.createLinearGradient(-w, 0, w, 0);
      gradLeaf.addColorStop(0, '#166534');
      gradLeaf.addColorStop(0.5, '#4ade80');
      gradLeaf.addColorStop(1, '#15803d');
      ctx.fillStyle = gradLeaf;
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-w * 0.8, 0);
      ctx.lineTo(w * 0.8, 0);
      ctx.stroke();
      ctx.restore();
    };

    dibujarFollaje(140, 290, -0.8, 52, 24);
    dibujarFollaje(372, 290, 0.8, 52, 24);
    dibujarFollaje(90, 210, -1.1, 48, 22);
    dibujarFollaje(422, 210, 1.1, 48, 22);
    dibujarFollaje(160, 105, -0.5, 46, 20);
    dibujarFollaje(352, 105, 0.5, 46, 20);

    // Tallos botánicos atados con cinta dorada en la base
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#166534';
    for (let s = -35; s <= 35; s += 10) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.6, cy + 80);
      ctx.quadraticCurveTo(cx + s * 0.3, cy + 160, cx + s * 0.8, cy + 235);
      ctx.stroke();
    }

    // Gran lazo de satén de oro envolviendo los tallos
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 160, 52, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Lazos colgantes
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy + 172);
    ctx.quadraticCurveTo(cx - 40, cy + 210, cx - 28, cy + 250);
    ctx.moveTo(cx + 16, cy + 172);
    ctx.quadraticCurveTo(cx + 40, cy + 210, cx + 28, cy + 250);
    ctx.stroke();

    // Ramillete de girasoles botánicos
    const girasolImg = this.texturas.girasol.image;
    // Capa de fondo
    ctx.drawImage(girasolImg, 70, 70, 160, 160);
    ctx.drawImage(girasolImg, 282, 70, 160, 160);
    ctx.drawImage(girasolImg, 176, 20, 160, 160);
    // Capa frontal
    ctx.drawImage(girasolImg, 110, 135, 175, 175);
    ctx.drawImage(girasolImg, 227, 135, 175, 175);
    ctx.drawImage(girasolImg, 166, 85, 180, 180);

    return new THREE.CanvasTexture(canvas);
  }

  crearCanvasPetaloSuelto() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.4, '#ffd700');
    grad.addColorStop(0.85, '#f59e0b');
    grad.addColorStop(1, '#ea580c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(32, 32, 28, 14, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  crearCanvasHojaVerde() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#86efac');
    grad.addColorStop(0.4, '#22c55e');
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(32, 32, 26, 12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  crearTexturaEtiqueta(texto, icono = '🌻') {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    // Fondo píldora translúcida glassmorphism con sombra profunda
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(20, 20, 600, 140, 70);
    ctx.fill();

    // Doble borde luminoso dorado
    ctx.shadowColor = 'rgba(255, 215, 0, 0.85)';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(26, 26, 588, 128, 64);
    ctx.stroke();

    // Icono y Texto con tipografía nítida
    ctx.font = 'bold 44px Montserrat, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 10;
    ctx.fillText(`${icono}  ${texto}`, 320, 90);

    return new THREE.CanvasTexture(canvas);
  }

  // 2.9 Canvas para la Constelación de La Palomita 🕊️
  crearCanvasPalomitaCelestial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 256;

    // Resplandor celestial blanco-celeste y oro
    const halo = ctx.createRadialGradient(cx, cy, 40, cx, cy, 245);
    halo.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    halo.addColorStop(0.3, 'rgba(186, 230, 253, 0.35)');
    halo.addColorStop(0.65, 'rgba(253, 224, 71, 0.18)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Círculo de constelación estelar sutil
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.stroke();

    // Estrellitas en la órbita de la constelación
    for (let i = 0; i < 12; i++) {
      const ang = (i * Math.PI * 2) / 12;
      const sx = cx + Math.cos(ang) * 200;
      const sy = cy + Math.sin(ang) * 200;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Silueta estilizada de La Palomita volando hacia arriba/derecha
    ctx.save();
    ctx.translate(cx, cy + 10);

    // Ala izquierda extendida con plumas de luz
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(-15, 10);
    ctx.bezierCurveTo(-70, 0, -150, -80, -180, -145);
    ctx.bezierCurveTo(-140, -125, -95, -60, -40, -40);
    ctx.bezierCurveTo(-80, -85, -120, -125, -135, -165);
    ctx.bezierCurveTo(-100, -120, -50, -65, -10, -25);
    ctx.closePath();
    ctx.fill();

    // Ala derecha extendida
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(15, 5);
    ctx.bezierCurveTo(70, -15, 140, -95, 175, -165);
    ctx.bezierCurveTo(135, -120, 85, -65, 45, -35);
    ctx.bezierCurveTo(90, -80, 130, -115, 145, -145);
    ctx.bezierCurveTo(105, -95, 60, -50, 20, -15);
    ctx.closePath();
    ctx.fill();

    // Cola elegante de la paloma
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.moveTo(-10, 45);
    ctx.bezierCurveTo(-45, 95, -70, 150, -50, 175);
    ctx.bezierCurveTo(-20, 140, 0, 95, 0, 60);
    ctx.bezierCurveTo(0, 95, 20, 140, 50, 175);
    ctx.bezierCurveTo(70, 150, 45, 95, 10, 45);
    ctx.closePath();
    ctx.fill();

    // Cuerpo luminoso blanco de La Palomita
    const gradCuerpo = ctx.createLinearGradient(0, -60, 0, 60);
    gradCuerpo.addColorStop(0, '#ffffff');
    gradCuerpo.addColorStop(0.5, '#f0f9ff');
    gradCuerpo.addColorStop(1, '#fef08a');
    ctx.fillStyle = gradCuerpo;
    ctx.beginPath();
    ctx.ellipse(0, 5, 28, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabeza suave
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -48, 22, 0, Math.PI * 2);
    ctx.fill();

    // Pico dorado
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(26, -52);
    ctx.lineTo(44, -48);
    ctx.lineTo(26, -42);
    ctx.closePath();
    ctx.fill();

    // Ramita / Florecilla amarilla de amistad en el pico
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(38, -46);
    ctx.quadraticCurveTo(62, -40, 75, -55);
    ctx.stroke();

    // Pétalos de flor amarilla en la ramita
    ctx.fillStyle = '#ffd700';
    for (let p = 0; p < 5; p++) {
      const pang = (p * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(75 + Math.cos(pang) * 7, -55 + Math.sin(pang) * 7, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(75, -55, 3, 0, Math.PI * 2);
    ctx.fill();

    // Ojo tierno de la palomita
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(15, -51, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, -52, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Aureola de polvo dorado alrededor de La Palomita
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, -50, 32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }

  // 2.10 Canvas para la Nebulosa de la Víbora Sagrada 🐍
  crearCanvasViboraCelestial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 256;

    // Resplandor de nebulosa esmeralda, turquesa y oro
    const halo = ctx.createRadialGradient(cx, cy, 35, cx, cy, 245);
    halo.addColorStop(0, 'rgba(52, 211, 153, 0.55)');
    halo.addColorStop(0.35, 'rgba(16, 185, 129, 0.28)');
    halo.addColorStop(0.7, 'rgba(245, 158, 11, 0.16)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Ondas y constelación circular
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 205, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);

    // Trazado serpentino sagrado en forma de S celestial y espiral armónica
    const pathPuntos = [
      { x: 30, y: -150 },   // Cabeza
      { x: 85, y: -110 },
      { x: 105, y: -45 },
      { x: 65, y: 25 },
      { x: -35, y: 70 },
      { x: -95, y: 125 },
      { x: -80, y: 175 },
      { x: -20, y: 185 },
      { x: 35, y: 155 },
      { x: 45, y: 115 }    // Punta de cola estilizada
    ];

    // Glow exterior del cuerpo
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.35)';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pathPuntos[0].x, pathPuntos[0].y);
    for (let i = 1; i < pathPuntos.length; i++) {
      ctx.lineTo(pathPuntos[i].x, pathPuntos[i].y);
    }
    ctx.stroke();

    // Cuerpo principal con degradado esmeralda a jade y oro
    const gradCuerpo = ctx.createLinearGradient(-100, -150, 100, 180);
    gradCuerpo.addColorStop(0, '#6ee7b7');
    gradCuerpo.addColorStop(0.3, '#10b981');
    gradCuerpo.addColorStop(0.65, '#047857');
    gradCuerpo.addColorStop(0.9, '#f59e0b');
    gradCuerpo.addColorStop(1, '#ffd700');

    ctx.strokeStyle = gradCuerpo;
    ctx.lineWidth = 22;
    ctx.stroke();

    // Núcleo brillante y estriado de escamas luminosas
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    // Patrón geométrico de constelación sobre el lomo
    for (let i = 0; i < pathPuntos.length; i++) {
      const pt = pathPuntos[i];
      // Estrella dorada en cada nodo
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Rombo de luz mística
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 12);
      ctx.lineTo(pt.x + 8, pt.y);
      ctx.lineTo(pt.x, pt.y + 12);
      ctx.lineTo(pt.x - 8, pt.y);
      ctx.closePath();
      ctx.stroke();
    }

    // Cabeza majestuosa de la Víbora Sagrada
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.ellipse(30, -150, 24, 32, -0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Corona cósmica / Joya de sabiduría en la frente
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(32, -182);
    ctx.lineTo(44, -172);
    ctx.lineTo(38, -162);
    ctx.lineTo(26, -162);
    ctx.lineTo(20, -172);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(32, -170, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Ojos sabios dorados
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(22, -154, 5, 0, Math.PI * 2);
    ctx.arc(42, -145, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(22, -154, 2.5, 0, Math.PI * 2);
    ctx.arc(42, -145, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }

  // 2.11 Canvas para el Cúmulo del Zorro Astronauta 🦊
  crearCanvasZorritoCelestial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256, cy = 256;

    // Resplandor cálido de estrella naranja, ámbar y oro
    const halo = ctx.createRadialGradient(cx, cy, 35, cx, cy, 245);
    halo.addColorStop(0, 'rgba(251, 146, 60, 0.55)');
    halo.addColorStop(0.35, 'rgba(245, 158, 11, 0.3)');
    halo.addColorStop(0.7, 'rgba(254, 240, 138, 0.18)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 512, 512);

    // Aro de constelación estelar
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 205, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy + 15);

    // Cola esponjosa y majestuosa curvada al costado derecho
    const gradCola = ctx.createLinearGradient(40, 80, 160, -60);
    gradCola.addColorStop(0, '#c2410c');
    gradCola.addColorStop(0.4, '#ea580c');
    gradCola.addColorStop(0.75, '#f59e0b');
    gradCola.addColorStop(1, '#ffffff');

    ctx.fillStyle = gradCola;
    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.bezierCurveTo(70, 110, 160, 80, 180, 10);
    ctx.bezierCurveTo(195, -50, 165, -110, 120, -120);
    ctx.bezierCurveTo(115, -80, 125, -40, 95, 0);
    ctx.bezierCurveTo(70, 35, 45, 40, 20, 60);
    ctx.closePath();
    ctx.fill();

    // Punta blanca brillante de la cola
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(150, -85);
    ctx.bezierCurveTo(165, -110, 135, -122, 120, -120);
    ctx.bezierCurveTo(115, -80, 125, -55, 145, -45);
    ctx.closePath();
    ctx.fill();

    // Orejas triangulares con borde dorado y pelaje interior blanco
    // Oreja Izquierda
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-60, -40);
    ctx.lineTo(-95, -135);
    ctx.lineTo(-25, -75);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-55, -45);
    ctx.lineTo(-85, -120);
    ctx.lineTo(-35, -75);
    ctx.closePath();
    ctx.fill();

    // Oreja Derecha
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(25, -75);
    ctx.lineTo(95, -135);
    ctx.lineTo(60, -40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(35, -75);
    ctx.lineTo(85, -120);
    ctx.lineTo(55, -45);
    ctx.closePath();
    ctx.fill();

    // Traje espacial / Pecho del Zorro Astronauta
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(0, 75, 48, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Emblema de flor dorada en el traje espacial
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, 75, 10, 0, Math.PI * 2);
    ctx.fill();

    // Cara tierna del zorrito
    const gradCara = ctx.createLinearGradient(0, -60, 0, 30);
    gradCara.addColorStop(0, '#ea580c');
    gradCara.addColorStop(0.6, '#f97316');
    gradCara.addColorStop(1, '#ffffff');

    ctx.fillStyle = gradCara;
    ctx.beginPath();
    ctx.ellipse(0, -10, 62, 54, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mejillas blancas esponjosas
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-60, -5);
    ctx.quadraticCurveTo(-35, 38, 0, 22);
    ctx.quadraticCurveTo(35, 38, 60, -5);
    ctx.quadraticCurveTo(30, 2, 0, 5);
    ctx.quadraticCurveTo(-30, 2, -60, -5);
    ctx.fill();

    // Visor de casco astronauta transparente con resplandor dorado
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -12, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Nariz pequeña triangular
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-7, 3);
    ctx.lineTo(7, 3);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();

    // Ojos vivaces y sonrientes del zorro
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(-26, -15, 6, 8, -0.1, 0, Math.PI * 2);
    ctx.ellipse(26, -15, 6, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Brillos en los ojos
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-24, -18, 2.5, 0, Math.PI * 2);
    ctx.arc(28, -18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Sonrisa amistosa
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, 14);
    ctx.quadraticCurveTo(0, 20, 10, 14);
    ctx.stroke();

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }

  // ========================================================================
  // 3. SECUENCIA DE ENTRADA: TÚNEL OSCURO DE FLORES (WARP SPACE)
  // ========================================================================
  construirTunelEspacialWarp() {
    // 3.1 Nube de flores amarillas que vuelan hacia la cámara (Imagen 2)
    const totalFloresWarp = 240;
    const flowerMaterial = new THREE.SpriteMaterial({
      map: this.texturas.girasol,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < totalFloresWarp; i++) {
      const sprite = new THREE.Sprite(flowerMaterial.clone());
      const radius = 60 + Math.random() * 580;
      const angle = Math.random() * Math.PI * 2;
      const z = -2800 + Math.random() * 3200;

      sprite.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        z
      );

      const scale = 32 + Math.random() * 60;
      sprite.scale.set(scale, scale, 1);
      sprite.userData = {
        baseZ: z,
        speed: 18 + Math.random() * 26,
        rotSpeed: (Math.random() - 0.5) * 0.05
      };

      this.warpGroup.add(sprite);
    }

    // 3.2 Partículas de estrellas espaciales
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 2400;
      starPos[i3 + 1] = (Math.random() - 0.5) * 2400;
      starPos[i3 + 2] = -3400 + Math.random() * 4000;

      const isGold = Math.random() > 0.35;
      starColors[i3] = isGold ? 1.0 : 0.92;
      starColors[i3 + 1] = isGold ? 0.88 : 0.95;
      starColors[i3 + 2] = isGold ? 0.35 : 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 4.8,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.estrellasWarp = new THREE.Points(starGeo, starMat);
    this.warpGroup.add(this.estrellasWarp);
  }

  // ========================================================================
  // 4. GALAXIA ESPIRAL 3D DE POLVO ESTELAR DORADO
  // ========================================================================
  construirGalaxiaEspiral() {
    const particleCount = 15000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const brazos = 3;
    const radioMax = 390;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.6) * radioMax;
      const brazoAngulo = ((i % brazos) * (2 * Math.PI)) / brazos;
      const espiralGiro = r * 0.022;
      const angulo = brazoAngulo + espiralGiro;

      const dispersion = (Math.random() - 0.5) * (r * 0.28 + 12);
      const x = Math.cos(angulo) * r + dispersion;
      const z = Math.sin(angulo) * r + dispersion;
      const y = (Math.random() - 0.5) * (Math.max(6, 45 - r * 0.1));

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const ratio = r / radioMax;
      if (ratio < 0.2) {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.98;
        colors[i3 + 2] = 0.85;
      } else if (ratio < 0.6) {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0.18;
      } else {
        colors[i3] = 0.95;
        colors[i3 + 1] = 0.55;
        colors[i3 + 2] = 0.08;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 4.0,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.galaxyPoints = new THREE.Points(geo, mat);
    this.galaxyGroup.add(this.galaxyPoints);

    // Vórtice central ultraluminoso
    const coreGeo = new THREE.BufferGeometry();
    const coreCount = 2400;
    const corePos = new Float32Array(coreCount * 3);
    const coreCol = new Float32Array(coreCount * 3);

    for (let c = 0; c < coreCount; c++) {
      const c3 = c * 3;
      const rC = Math.random() * 58;
      const theta = Math.random() * Math.PI * 2;
      corePos[c3] = Math.cos(theta) * rC;
      corePos[c3 + 1] = (Math.random() - 0.5) * 18;
      corePos[c3 + 2] = Math.sin(theta) * rC;

      coreCol[c3] = 1.0;
      coreCol[c3 + 1] = 0.96;
      coreCol[c3 + 2] = 0.75;
    }
    coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
    coreGeo.setAttribute('color', new THREE.BufferAttribute(coreCol, 3));

    const coreMat = new THREE.PointsMaterial({
      size: 6.0,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.corePoints = new THREE.Points(coreGeo, coreMat);
    this.galaxyGroup.add(this.corePoints);
  }

  // ========================================================================
  // 5. DOBLE CORAZÓN CONCÉNTRICO DE POLVO ESTELAR 3D (UN CORAZÓN DENTRO DE OTRO)
  // ========================================================================
  construirCorazonPolvoEstelar() {
    // ------------------------------------------------------------------------
    // 5.1 CORAZÓN EXTERIOR GIGANTE (Visible con gran claridad desde lejos)
    // ------------------------------------------------------------------------
    const countOuter = 7800;
    const geoOuter = new THREE.BufferGeometry();
    const posOuter = new Float32Array(countOuter * 3);
    const colOuter = new Float32Array(countOuter * 3);

    const scaleOuter = 7.2;   // Gran escala exterior imponente
    const elevateYOuter = 82;

    for (let i = 0; i < countOuter; i++) {
      const i3 = i * 3;
      const t = Math.random() * Math.PI * 2;

      // Ecuación paramétrica clásica del corazón
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Manto volumétrico ancho y esponjoso tipo nube de nebulosa
      const angTubo = Math.random() * Math.PI * 2;
      const radioTubo = Math.random() * 11.5; // Cinta ancha y resplandeciente
      const offsetTuboX = Math.cos(angTubo) * radioTubo;
      const offsetTuboY = Math.sin(angTubo) * (radioTubo * 0.65);
      const offsetTuboZ = (Math.random() - 0.5) * 34;

      // Espiral de tornado cósmico en la punta inferior que enraíza con el disco galáctico
      let spiralBaseY = 0;
      let spiralBaseX = 0;
      let spiralBaseZ = 0;
      if (Math.abs(t - Math.PI) < 0.65) {
        const f = (0.65 - Math.abs(t - Math.PI)) / 0.65;
        spiralBaseY = -f * 48;
        spiralBaseX = Math.sin(f * 11) * 16;
        spiralBaseZ = Math.cos(f * 11) * 16;
      }

      posOuter[i3] = (hx * scaleOuter) + offsetTuboX + spiralBaseX;
      posOuter[i3 + 1] = (hy * scaleOuter) + elevateYOuter + offsetTuboY + spiralBaseY;
      posOuter[i3 + 2] = offsetTuboZ + spiralBaseZ;

      // Gama de color: Oro cósmico profundo, ámbar y destellos solares
      const brillo = Math.random();
      colOuter[i3] = 1.0;
      colOuter[i3 + 1] = 0.78 + brillo * 0.22;
      colOuter[i3 + 2] = 0.16 + brillo * 0.38;
    }

    geoOuter.setAttribute('position', new THREE.BufferAttribute(posOuter, 3));
    geoOuter.setAttribute('color', new THREE.BufferAttribute(colOuter, 3));

    const matOuter = new THREE.PointsMaterial({
      size: 5.2,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.heartOuterPoints = new THREE.Points(geoOuter, matOuter);
    this.heartPoints = this.heartOuterPoints; // Mantener referencia histórica
    this.galaxyGroup.add(this.heartOuterPoints);

    // ------------------------------------------------------------------------
    // 5.2 CORAZÓN INTERIOR CONCÉNTRICO (Anidado dentro del corazón exterior)
    // ------------------------------------------------------------------------
    const countInner = 4500;
    const geoInner = new THREE.BufferGeometry();
    const posInner = new Float32Array(countInner * 3);
    const colInner = new Float32Array(countInner * 3);

    const scaleInner = 3.8;   // Escala interior que abraza el ramo central
    const elevateYInner = 76;

    for (let j = 0; j < countInner; j++) {
      const j3 = j * 3;
      const t = Math.random() * Math.PI * 2;

      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      const angTubo = Math.random() * Math.PI * 2;
      const radioTubo = Math.random() * 6.5;
      const offsetTuboX = Math.cos(angTubo) * radioTubo;
      const offsetTuboY = Math.sin(angTubo) * (radioTubo * 0.6);
      const offsetTuboZ = (Math.random() - 0.5) * 18;

      posInner[j3] = (hx * scaleInner) + offsetTuboX;
      posInner[j3 + 1] = (hy * scaleInner) + elevateYInner + offsetTuboY;
      posInner[j3 + 2] = offsetTuboZ;

      // Gama de color: Luz blanca pura supernoval y oro cristalino incandescente
      const brillo = Math.random();
      colInner[j3] = 1.0;
      colInner[j3 + 1] = 0.92 + brillo * 0.08;
      colInner[j3 + 2] = 0.60 + brillo * 0.40;
    }

    geoInner.setAttribute('position', new THREE.BufferAttribute(posInner, 3));
    geoInner.setAttribute('color', new THREE.BufferAttribute(colInner, 3));

    const matInner = new THREE.PointsMaterial({
      size: 4.4,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.heartInnerPoints = new THREE.Points(geoInner, matInner);
    this.galaxyGroup.add(this.heartInnerPoints);

    // ------------------------------------------------------------------------
    // 5.3 PUENTES DE POLVO ESTELAR Y RAYOS RADIALES ENTRE AMBOS CORAZONES
    // ------------------------------------------------------------------------
    const countBridge = 1800;
    const geoBridge = new THREE.BufferGeometry();
    const posBridge = new Float32Array(countBridge * 3);
    const colBridge = new Float32Array(countBridge * 3);

    for (let k = 0; k < countBridge; k++) {
      const k3 = k * 3;
      const t = Math.random() * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Interpolación radial entre corazón interno (alpha = 0) y externo (alpha = 1)
      const alpha = Math.random();
      const curScale = scaleInner + alpha * (scaleOuter - scaleInner);
      const curElevY = elevateYInner + alpha * (elevateYOuter - elevateYInner);

      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;
      const jitterZ = (Math.random() - 0.5) * 20;

      posBridge[k3] = (hx * curScale) + jitterX;
      posBridge[k3 + 1] = (hy * curScale) + curElevY + jitterY;
      posBridge[k3 + 2] = jitterZ;

      colBridge[k3] = 1.0;
      colBridge[k3 + 1] = 0.88 + Math.random() * 0.12;
      colBridge[k3 + 2] = 0.45 + Math.random() * 0.45;
    }

    geoBridge.setAttribute('position', new THREE.BufferAttribute(posBridge, 3));
    geoBridge.setAttribute('color', new THREE.BufferAttribute(colBridge, 3));

    const matBridge = new THREE.PointsMaterial({
      size: 3.6,
      map: this.texturas.particula,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.heartBridgePoints = new THREE.Points(geoBridge, matBridge);
    this.galaxyGroup.add(this.heartBridgePoints);

    // ------------------------------------------------------------------------
    // 5.4 RAMO CENTRAL Y ETIQUETA EN EL CENTRO DEL CORAZÓN ANIDADO
    // ------------------------------------------------------------------------
    const centerMat = new THREE.SpriteMaterial({
      map: this.texturas.ramoCentral,
      transparent: true,
      opacity: 1
    });
    this.ramoCentralSprite = new THREE.Sprite(centerMat);
    this.ramoCentralSprite.position.set(0, elevateYInner + 6, 2);
    this.ramoCentralSprite.scale.set(78, 85, 1);
    this.ramoCentralSprite.userData = {
      id: 'sol',
      titulo: 'El Sol de la Amistad ☀️',
      subtitulo: 'El núcleo de nuestra unión sincera'
    };
    this.galaxyGroup.add(this.ramoCentralSprite);
    this.floresInteractivos.push(this.ramoCentralSprite);

    // Etiqueta del corazón central
    const tagCenterTex = this.crearTexturaEtiqueta('Sol de la Amistad', '☀️');
    const tagCenterMat = new THREE.SpriteMaterial({ map: tagCenterTex, transparent: true });
    const tagCenterSprite = new THREE.Sprite(tagCenterMat);
    tagCenterSprite.position.set(0, elevateYInner + 58, 2);
    tagCenterSprite.scale.set(54, 15, 1);
    tagCenterSprite.userData = this.ramoCentralSprite.userData;
    this.galaxyGroup.add(tagCenterSprite);
    this.floresInteractivos.push(tagCenterSprite);
  }

  // ========================================================================
  // 6. RAMOS Y FLORES ORBITANDO EN 3D
  // ========================================================================
  construirFloresYEtiquetasOrbitales() {
    const estaciones = [
      { id: 'ashley_luz', texto: 'Luz de Ashley', icono: '✨', tex: 'ramoGirasoles', r: 110, ang: 0.35, y: 12, s: 52 },
      { id: 'nedally_calma', texto: 'Planeta Nedally', icono: '🌙', tex: 'ramoRosas', r: 125, ang: 2.15, y: 18, s: 50 },
      { id: 'amistad_oro', texto: 'Amistad de Oro', icono: '💛', tex: 'girasol', r: 160, ang: 3.8, y: 8, s: 48 },
      { id: 'siempre_juntos', texto: 'Siempre Juntas', icono: '🌻', tex: 'ramoGirasoles', r: 185, ang: 5.2, y: 22, s: 54 },
      { id: 'carino_sincero', texto: 'Cariño Sincero', icono: '💫', tex: 'ramillete', r: 215, ang: 1.1, y: -6, s: 46 },
      { id: 'refugio_paz', texto: 'Refugio de Paz', icono: '🕊️', tex: 'ramoRosas', r: 235, ang: 2.8, y: 14, s: 50 },
      { id: 'complicidad_unica', texto: 'Complicidad Única', icono: '⭐', tex: 'girasol', r: 260, ang: 4.4, y: 6, s: 48 },
      { id: 'risas_infinitas', texto: 'Risas Compartidas', icono: '☀️', tex: 'ramoGirasoles', r: 285, ang: 5.9, y: 20, s: 52 },
      { id: 'apoyo_firme', texto: 'Apoyo Leal', icono: '🌿', tex: 'ramillete', r: 310, ang: 1.8, y: 10, s: 46 },
      { id: 'gratitud_eterna', texto: 'Gratitud Eterna', icono: '👑', tex: 'ramoRosas', r: 335, ang: 3.3, y: -4, s: 50 },
      { id: 'lazos_inquebrantables', texto: 'Lazos de Verdad', icono: '💛', tex: 'girasol', r: 355, ang: 4.8, y: 16, s: 48 },
      { id: 'primavera_infinita', texto: 'Primavera Eterna', icono: '🌸', tex: 'ramoGirasoles', r: 375, ang: 0.7, y: 12, s: 52 }
    ];

    estaciones.forEach((est, idx) => {
      const x = Math.cos(est.ang) * est.r;
      const z = Math.sin(est.ang) * est.r;
      const y = est.y;

      // Sprite de la Flor/Ramo
      const mat = new THREE.SpriteMaterial({
        map: this.texturas[est.tex],
        transparent: true,
        opacity: 0.98
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, z);
      sprite.scale.set(est.s, est.s * 1.15, 1);
      sprite.userData = {
        id: est.id,
        index: idx + 1,
        texto: est.texto,
        icono: est.icono,
        baseX: x,
        baseY: y,
        baseZ: z,
        r: est.r,
        bobSpeed: 1.2 + (idx % 3) * 0.4,
        bobAmp: 4 + (idx % 2) * 2,
        waveImpulse: 0
      };

      this.galaxyGroup.add(sprite);
      this.floresInteractivos.push(sprite);

      // Etiqueta flotante posicionada con amplitud debajo del ramo
      const labelTex = this.crearTexturaEtiqueta(est.texto, est.icono);
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        transparent: true,
        opacity: 0.95
      });
      const labelSprite = new THREE.Sprite(labelMat);
      labelSprite.position.set(x, y - (est.s * 0.68), z);
      labelSprite.scale.set(44, 12.5, 1);
      labelSprite.userData = sprite.userData;

      this.galaxyGroup.add(labelSprite);
      this.floresInteractivos.push(labelSprite);
    });
  }

  // ========================================================================
  // 6.5 CONSTELACIONES Y NEBULOSAS DE LOS 3 AMIGOS (Palomita 🕊️, Víbora 🐍, Zorro 🦊)
  // ========================================================================
  construirConstelacionesAmigos() {
    const amigosData = [
      {
        id: 'constelacion_palomita',
        nombre: 'Constelación La Palomita',
        icono: '🕊️',
        textura: 'palomitaCelestial',
        r: 330,
        ang: 2.35,
        y: 38,
        s: 68,
        coloresNebula: [
          { r: 1.0, g: 1.0, b: 1.0 },     // Blanco puro
          { r: 0.22, g: 0.74, b: 0.97 }, // Cyan celeste
          { r: 0.99, g: 0.94, b: 0.54 }  // Oro suave
        ],
        tipoForma: 'alas'
      },
      {
        id: 'constelacion_vibora',
        nombre: 'Nebulosa Víbora Sagrada',
        icono: '🐍',
        textura: 'viboraCelestial',
        r: 350,
        ang: 4.55,
        y: -14,
        s: 68,
        coloresNebula: [
          { r: 0.06, g: 0.72, b: 0.51 }, // Esmeralda
          { r: 0.20, g: 0.83, b: 0.60 }, // Jade
          { r: 1.0, g: 0.84, b: 0.0 }    // Oro cósmico
        ],
        tipoForma: 'serpentina'
      },
      {
        id: 'constelacion_zorrito',
        nombre: 'Cúmulo Zorro Astronauta',
        icono: '🦊',
        textura: 'zorritoCelestial',
        r: 315,
        ang: 0.85,
        y: 42,
        s: 68,
        coloresNebula: [
          { r: 0.96, g: 0.62, b: 0.04 }, // Ámbar
          { r: 0.92, g: 0.35, b: 0.05 }, // Naranja fuego
          { r: 1.0, g: 0.95, b: 0.70 }   // Destello blanco-dorado
        ],
        tipoForma: 'remolino'
      }
    ];

    amigosData.forEach((amigo, idx) => {
      const cx = Math.cos(amigo.ang) * amigo.r;
      const cz = Math.sin(amigo.ang) * amigo.r;
      const cy = amigo.y;

      // 1. Cúmulo de polvo estelar / Nebulosa propia (1,250 partículas)
      const partCount = 1250;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(partCount * 3);
      const col = new Float32Array(partCount * 3);

      for (let p = 0; p < partCount; p++) {
        const p3 = p * 3;
        let px = 0, py = 0, pz = 0;

        if (amigo.tipoForma === 'alas') {
          // Despliegue de alas cósmicas
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.pow(Math.random(), 1.4) * 60;
          px = Math.cos(ang) * rad * 1.35;
          py = (Math.random() - 0.5) * 30 + Math.sin(ang * 2) * 12;
          pz = Math.sin(ang) * rad * 0.85;
        } else if (amigo.tipoForma === 'serpentina') {
          // Curva sinusoidal de la serpiente
          const t = (Math.random() - 0.5) * 2;
          px = t * 62 + (Math.random() - 0.5) * 18;
          py = Math.sin(t * Math.PI) * 26 + (Math.random() - 0.5) * 20;
          pz = Math.cos(t * Math.PI) * 24 + (Math.random() - 0.5) * 18;
        } else {
          // Remolino y cola del zorro
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.pow(Math.random(), 1.3) * 56;
          px = Math.cos(ang) * rad;
          py = (Math.random() - 0.5) * 26 + (rad * 0.22);
          pz = Math.sin(ang) * rad * 1.15;
        }

        pos[p3] = cx + px;
        pos[p3 + 1] = cy + py;
        pos[p3 + 2] = cz + pz;

        const colorPick = amigo.coloresNebula[p % amigo.coloresNebula.length];
        const variacion = 0.85 + Math.random() * 0.15;
        col[p3] = colorPick.r * variacion;
        col[p3 + 1] = colorPick.g * variacion;
        col[p3 + 2] = colorPick.b * variacion;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const matNebula = new THREE.PointsMaterial({
        size: 4.8,
        map: this.texturas.particula,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const nebulaPoints = new THREE.Points(geo, matNebula);
      this.galaxyGroup.add(nebulaPoints);

      // 2. Sprite ilustrado celestial del amigo
      const spriteMat = new THREE.SpriteMaterial({
        map: this.texturas[amigo.textura],
        transparent: true,
        opacity: 0.98
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(cx, cy + 4, cz);
      sprite.scale.set(amigo.s, amigo.s, 1);
      sprite.userData = {
        id: amigo.id,
        index: 100 + idx,
        texto: amigo.nombre,
        icono: amigo.icono,
        baseX: cx,
        baseY: cy + 4,
        baseZ: cz,
        r: amigo.r,
        bobSpeed: 1.5 + idx * 0.3,
        bobAmp: 5 + idx * 0.5,
        waveImpulse: 0
      };

      this.galaxyGroup.add(sprite);
      this.floresInteractivos.push(sprite);

      // 3. Etiqueta flotante con el nombre del personaje
      const labelTex = this.crearTexturaEtiqueta(amigo.nombre, amigo.icono);
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        transparent: true,
        opacity: 0.95
      });
      const labelSprite = new THREE.Sprite(labelMat);
      labelSprite.position.set(cx, cy - 42, cz);
      labelSprite.scale.set(52, 14.5, 1);
      labelSprite.userData = sprite.userData;

      this.galaxyGroup.add(labelSprite);
      this.floresInteractivos.push(labelSprite);

      // Guardar referencia para animaciones
      this.constelacionesAmigos.push({
        nebulaMesh: nebulaPoints,
        sprite: sprite,
        rotDir: (idx % 2 === 0) ? 1 : -1
      });
    });
  }

  // ========================================================================
  // 7. HOJAS Y PÉTALOS QUE REVOLOTEAN EN 3D (REACCIÓN A LA ONDA EXPANSIVA)
  // ========================================================================
  construirHojasRevoloteando() {
    const totalHojas = 180;
    for (let i = 0; i < totalHojas; i++) {
      const esPetalo = Math.random() > 0.35;
      const map = esPetalo ? this.texturas.petaloSuelto : this.texturas.hojaVerde;
      const mat = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0.88 });
      const sprite = new THREE.Sprite(mat);

      const r = 30 + Math.random() * 320;
      const ang = Math.random() * Math.PI * 2;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      const y = (Math.random() - 0.5) * 20;

      sprite.position.set(x, y, z);
      const sz = 7 + Math.random() * 9;
      sprite.scale.set(sz, sz, 1);

      sprite.userData = {
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0,
        vz: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        swaySpeed: 1 + Math.random() * 2,
        swayAmp: 0.4 + Math.random() * 0.8,
        swayOffset: Math.random() * Math.PI * 2
      };

      this.galaxyGroup.add(sprite);
      this.hojasRevoloteando.push(sprite);
    }
  }

  // DISPARAR ONDA EXPANSIVA AL TOCAR EL CENTRO (Hojas revoloteando de forma hermosa)
  dispararOndaExpansiva() {
    // 1. Crear anillo de onda luminosa en 3D
    const ringGeo = new THREE.RingGeometry(2, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 10, 0);

    this.galaxyGroup.add(ring);
    this.ondasActivas.push({
      mesh: ring,
      radio: 5,
      maxRadio: 460,
      velocidad: 240, // Expansión rápida y fluida
      vida: 1.0
    });

    // 2. Impulso a los pétalos y hojas para que revoloteen en el aire
    this.hojasRevoloteando.forEach((hoja, idx) => {
      const dist = Math.sqrt(hoja.position.x * hoja.position.x + hoja.position.z * hoja.position.z);
      const delay = (dist / 240) * 1000; // La onda los alcanza a medida que se expande

      setTimeout(() => {
        hoja.userData.vy = 22 + Math.random() * 26; // Salto alto hacia el cielo
        hoja.userData.vx += (Math.random() - 0.5) * 12;
        hoja.userData.vz += (Math.random() - 0.5) * 12;
        hoja.userData.rotSpeed = (Math.random() - 0.5) * 0.35; // Giros acrobáticos
      }, delay);
    });

    // 3. Onda de balanceo en las flores
    this.floresInteractivos.forEach(flor => {
      if (flor.userData && flor.userData.r) {
        const delay = (flor.userData.r / 240) * 1000;
        setTimeout(() => {
          flor.userData.waveImpulse = 1.0;
        }, delay);
      }
    });
  }

  // ========================================================================
  // 8. LLUVIA DE METEOROS 3D ESPECTACULAR (NOTORIA Y BRILLANTE)
  // ========================================================================
  construirSistemaMeteoros3D() {
    this.meteorGroup = new THREE.Group();
    this.scene.add(this.meteorGroup);
  }

  lanzarMeteoro3D() {
    // Origen en la parte superior del cielo cósmico
    const startX = (Math.random() - 0.5) * 900;
    const startY = 320 + Math.random() * 200;
    const startZ = -400 + Math.random() * 800;

    // Dirección diagonal veloz
    const dir = new THREE.Vector3(
      -1.2 + (Math.random() - 0.5) * 0.4,
      -1.0 + (Math.random() - 0.5) * 0.3,
      0.6 + (Math.random() - 0.5) * 0.4
    ).normalize();

    const speed = 750 + Math.random() * 350;

    // Cabeza del cometa brillante
    const headMat = new THREE.SpriteMaterial({
      map: this.texturas.cabezaMeteoro,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    const head = new THREE.Sprite(headMat);
    head.position.set(startX, startY, startZ);
    head.scale.set(28, 28, 1);

    // Estela luminosa larga
    const tailLength = 110 + Math.random() * 70;
    const tailGeo = new THREE.BufferGeometry();
    const tailPositions = new Float32Array([
      startX, startY, startZ,
      startX - dir.x * tailLength, startY - dir.y * tailLength, startZ - dir.z * tailLength
    ]);
    const tailColors = new Float32Array([
      1.0, 1.0, 1.0,
      1.0, 0.75, 0.1
    ]);
    tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3));
    tailGeo.setAttribute('color', new THREE.BufferAttribute(tailColors, 3));

    const tailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      linewidth: 3,
      blending: THREE.AdditiveBlending
    });
    const tail = new THREE.Line(tailGeo, tailMat);

    this.meteorGroup.add(head);
    this.meteorGroup.add(tail);

    this.meteorosActivos.push({
      head,
      tail,
      pos: new THREE.Vector3(startX, startY, startZ),
      dir,
      speed,
      tailLength,
      vida: 1.0,
      duracionTotal: 1.6
    });
  }

  toggleModoMeteoros() {
    this.modoMeteorosIntenso = !this.modoMeteorosIntenso;
    if (this.modoMeteorosIntenso) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => this.lanzarMeteoro3D(), i * 160);
      }
    }
    return this.modoMeteorosIntenso;
  }

  // ========================================================================
  // 9. VUELO ESPACIAL: TRANSICIÓN COMPLETA Y REPETIBLE (SOLUCIÓN FIX REPETIR VUELO)
  // ========================================================================
  iniciarVuelo() {
    this.faseActual = 'warp';
    this.tiempoVuelo = 0;
    this.camera.position.set(0, 40, 1750);
    this.camera.lookAt(0, 0, 0);

    this.galaxyGroup.scale.set(0.05, 0.05, 0.05);
    this.galaxyGroup.position.set(0, 0, 0);

    // RESTAURACIÓN TOTAL DEL TÚNEL DE FLORES (Imagen 2)
    this.warpGroup.visible = true;
    this.warpGroup.children.forEach(child => {
      if (child.material) {
        child.material.opacity = (child instanceof THREE.Sprite) ? 0.96 : 0.88;
      }
      if (child.userData && child.userData.baseZ !== undefined) {
        child.position.z = child.userData.baseZ;
      }
    });
  }

  actualizarVuelo(delta) {
    if (this.faseActual !== 'warp') return;

    this.tiempoVuelo += delta;
    const progreso = Math.min(this.tiempoVuelo / this.duracionVuelo, 1.0);

    // Curva cúbica ease-in-out
    const t = progreso < 0.5
      ? 4 * progreso * progreso * progreso
      : 1 - Math.pow(-2 * progreso + 2, 3) / 2;

    const targetZ = THREE.MathUtils.lerp(1750, 180, t);
    const targetY = THREE.MathUtils.lerp(40, 140, t);

    this.camera.position.z = targetZ;
    this.camera.position.y = targetY;
    this.camera.lookAt(0, 40 * (1 - t), 0);

    const escalaGalaxia = THREE.MathUtils.lerp(0.05, 1.0, t);
    this.galaxyGroup.scale.set(escalaGalaxia, escalaGalaxia, escalaGalaxia);

    // Desvanecer suavemente el túnel cuando se acerca al centro
    if (progreso > 0.65) {
      const alphaWarp = (1 - progreso) / 0.35;
      this.warpGroup.children.forEach(child => {
        if (child.material) child.material.opacity = alphaWarp;
      });
    }

    if (progreso >= 1.0) {
      this.faseActual = 'galaxia';
      this.warpGroup.visible = false;
      this.actualizarPosicionCamaraOrbital();
    }
  }

  // ========================================================================
  // 10. CONTROLES DE ROTACIÓN 3D ORBITAL CON AUTO-ROTACIÓN IDLE CONTINUA
  // ========================================================================
  setupEventListeners() {
    const el = this.container;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // MOUSE
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.hasMoved = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.ultimoInteraccionTiempo = Date.now();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        this.hasMoved = true;
      }

      this.targetSpherical.theta -= deltaX * 0.0065;
      this.targetSpherical.phi -= deltaY * 0.005;
      this.targetSpherical.phi = Math.max(0.35, Math.min(Math.PI / 2.05, this.targetSpherical.phi));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.ultimoInteraccionTiempo = Date.now();
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isDragging && !this.hasMoved) {
        this.manejarClick(e.clientX, e.clientY);
      }
      this.isDragging = false;
      this.ultimoInteraccionTiempo = Date.now();
    });

    // TOUCH
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.hasMoved = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.ultimoInteraccionTiempo = Date.now();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.previousMousePosition.x;
      const deltaY = touch.clientY - this.previousMousePosition.y;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        this.hasMoved = true;
      }

      this.targetSpherical.theta -= deltaX * 0.008;
      this.targetSpherical.phi -= deltaY * 0.006;
      this.targetSpherical.phi = Math.max(0.35, Math.min(Math.PI / 2.05, this.targetSpherical.phi));

      this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
      this.ultimoInteraccionTiempo = Date.now();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.isDragging && !this.hasMoved && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        this.manejarClick(touch.clientX, touch.clientY);
      }
      this.isDragging = false;
      this.ultimoInteraccionTiempo = Date.now();
    });

    // ZOOM
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetSpherical.radius += e.deltaY * 0.18;
      this.targetSpherical.radius = Math.max(120, Math.min(420, this.targetSpherical.radius));
      this.ultimoInteraccionTiempo = Date.now();
    }, { passive: false });
  }

  actualizarPosicionCamaraOrbital() {
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.08;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.08;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.08;

    // AUTO-ROTACIÓN EN MODO IDLE: Si el usuario no está tocando, gira solito continuamente
    const tiempoInactivo = Date.now() - this.ultimoInteraccionTiempo;
    if (!this.isDragging && tiempoInactivo > this.tiempoParaReanudarAutoRotacion) {
      this.targetSpherical.theta += this.velocidadAutoRotacion;
    }

    const sinPhiRadius = Math.sin(this.spherical.phi) * this.spherical.radius;
    this.camera.position.x = sinPhiRadius * Math.sin(this.spherical.theta);
    this.camera.position.y = Math.cos(this.spherical.phi) * this.spherical.radius;
    this.camera.position.z = sinPhiRadius * Math.cos(this.spherical.theta);

    this.camera.lookAt(0, 32, 0);
  }

  // ========================================================================
  // 11. RAYCASTING: CLIC / TOQUE EN FLORES Y CENTRO (ONDA EXPANSIVA)
  // ========================================================================
  manejarClick(clientX, clientY) {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.floresInteractivos);

    if (intersects.length > 0) {
      const florObj = intersects[0].object;

      // Si se tocó el centro (ramoCentral o sol)
      if (florObj.userData && (florObj.userData.id === 'sol' || florObj === this.ramoCentralSprite)) {
        this.dispararOndaExpansiva();
      }

      if (florObj.userData && this.onFlorClick) {
        this.onFlorClick(florObj.userData);
      }
    } else {
      // Si tocó el centro espacial de la galaxia (vórtice)
      const ray = this.raycaster.ray;
      const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      ray.intersectPlane(planeY, intersectionPoint);

      if (intersectionPoint && intersectionPoint.length() < 95) {
        this.dispararOndaExpansiva();
      }
    }
  }

  // ========================================================================
  // 12. BUCLE DE ANIMACIÓN Y RENDER
  // ========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Fase de vuelo cósmico de entrada
    if (this.faseActual === 'warp') {
      this.actualizarVuelo(delta);

      this.warpGroup.children.forEach(sprite => {
        if (sprite.userData && sprite.userData.speed) {
          sprite.position.z += sprite.userData.speed * (delta * 60);
          sprite.material.rotation += sprite.userData.rotSpeed;
          if (sprite.position.z > 1900) {
            sprite.position.z = -2800;
          }
        }
      });
    } else if (this.faseActual === 'galaxia') {
      // Rotación suave del disco de la galaxia
      this.galaxyPoints.rotation.y += 0.001;
      this.corePoints.rotation.y += 0.003;

      // Doble latido concéntrico orgánico del corazón (claramente visible a cualquier distancia)
      if (this.heartOuterPoints) {
        const pulseOuter = 1.0 + Math.sin(elapsedTime * 2.2) * 0.038;
        this.heartOuterPoints.scale.set(pulseOuter, pulseOuter, pulseOuter);
      }
      if (this.heartInnerPoints) {
        const pulseInner = 1.0 + Math.sin(elapsedTime * 3.4) * 0.052;
        this.heartInnerPoints.scale.set(pulseInner, pulseInner, pulseInner);
      }
      if (this.heartBridgePoints) {
        const pulseBridge = 1.0 + Math.sin(elapsedTime * 2.8) * 0.028;
        this.heartBridgePoints.scale.set(pulseBridge, pulseBridge, pulseBridge);
      }

      // Rotación mística suave de las nebulosas de las constelaciones de los 3 amigos
      if (this.constelacionesAmigos && this.constelacionesAmigos.length > 0) {
        this.constelacionesAmigos.forEach(item => {
          if (item.nebulaMesh) {
            item.nebulaMesh.rotation.y += 0.0018 * item.rotDir;
            item.nebulaMesh.rotation.z += 0.0009 * item.rotDir;
          }
        });
      }

      // Animación de flotación orgánica (bobbing) y reacción a onda
      this.floresInteractivos.forEach(flor => {
        if (flor.userData && flor.userData.bobSpeed) {
          let waveOffset = 0;
          if (flor.userData.waveImpulse > 0) {
            waveOffset = Math.sin(flor.userData.waveImpulse * Math.PI) * 14;
            flor.userData.waveImpulse -= delta * 1.5;
            if (flor.userData.waveImpulse < 0) flor.userData.waveImpulse = 0;
          }
          flor.position.y = flor.userData.baseY + Math.sin(elapsedTime * flor.userData.bobSpeed) * flor.userData.bobAmp + waveOffset;
        }
      });

      // Animación de las hojas revoloteando (Física de caída y viento)
      this.hojasRevoloteando.forEach(hoja => {
        const u = hoja.userData;
        // Gravedad y resistencia del aire
        if (u.vy > 0) {
          hoja.position.y += u.vy * delta * 14;
          hoja.position.x += u.vx * delta * 14;
          hoja.position.z += u.vz * delta * 14;
          u.vy -= delta * 28; // Gravedad suave
          hoja.material.rotation += u.rotSpeed;
        } else {
          // Descenso suave con vaivén
          hoja.position.y += (u.baseY - hoja.position.y) * 0.05;
          hoja.position.x += Math.sin(elapsedTime * u.swaySpeed + u.swayOffset) * u.swayAmp * delta * 20;
          hoja.material.rotation += u.rotSpeed * 0.2;
        }
      });

      // Animación y expansión de las ondas expansivas
      for (let i = this.ondasActivas.length - 1; i >= 0; i--) {
        const onda = this.ondasActivas[i];
        onda.radio += onda.velocidad * delta;
        onda.vida -= delta * 0.55;

        onda.mesh.scale.set(onda.radio / 8, onda.radio / 8, 1);
        onda.mesh.material.opacity = Math.max(0, onda.vida);

        if (onda.vida <= 0 || onda.radio >= onda.maxRadio) {
          this.galaxyGroup.remove(onda.mesh);
          onda.mesh.geometry.dispose();
          onda.mesh.material.dispose();
          this.ondasActivas.splice(i, 1);
        }
      }

      // Actualizar cámara orbital interactiva
      this.actualizarPosicionCamaraOrbital();
    }

    // Actualizar meteoros 3D en el cielo
    this.actualizarMeteoros(delta);

    // Generador periódico de meteoros
    const intervaloMeteoro = this.modoMeteorosIntenso ? 0.22 : 1.8;
    if (elapsedTime - this.tiempoUltimoMeteoro > intervaloMeteoro) {
      this.lanzarMeteoro3D();
      this.tiempoUltimoMeteoro = elapsedTime;
    }

    this.renderer.render(this.scene, this.camera);
  }

  actualizarMeteoros(delta) {
    for (let i = this.meteorosActivos.length - 1; i >= 0; i--) {
      const m = this.meteorosActivos[i];
      m.vida -= delta / m.duracionTotal;

      // Avanzar posición
      m.pos.addScaledVector(m.dir, m.speed * delta);
      m.head.position.copy(m.pos);

      // Actualizar estela
      const tailPos = m.tail.geometry.attributes.position.array;
      tailPos[0] = m.pos.x;
      tailPos[1] = m.pos.y;
      tailPos[2] = m.pos.z;
      tailPos[3] = m.pos.x - m.dir.x * m.tailLength;
      tailPos[4] = m.pos.y - m.dir.y * m.tailLength;
      tailPos[5] = m.pos.z - m.dir.z * m.tailLength;
      m.tail.geometry.attributes.position.needsUpdate = true;

      // Opacidad según vida
      m.head.material.opacity = Math.max(0, m.vida);
      m.tail.material.opacity = Math.max(0, m.vida * 0.95);

      if (m.vida <= 0 || m.pos.y < -300) {
        this.meteorGroup.remove(m.head);
        this.meteorGroup.remove(m.tail);
        m.head.material.dispose();
        m.tail.geometry.dispose();
        m.tail.material.dispose();
        this.meteorosActivos.splice(i, 1);
      }
    }
  }

  resetearVista() {
    this.targetSpherical.theta = 0.8;
    this.targetSpherical.phi = 1.15;
    this.targetSpherical.radius = 260;
    this.autoRotacion = true;
    this.ultimoInteraccionTiempo = Date.now() - 2000;
  }
}

window.GalaxiaFlores3D = GalaxiaFlores3D;
