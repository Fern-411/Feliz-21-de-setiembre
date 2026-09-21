/**
 * ==========================================================================
 * APP.JS - Lógica de la Galaxia 3D de Flores Amarillas
 * 21 de Septiembre: Dedicatoria de AMISTAD SINCERA para Ashley & Nedally
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Base de datos de dedicatorias (100% Amistad Sincera, Cero Romance)
  const DEDICATORIAS_AMISTAD = {
    sol: {
      destinatario: 'Nuestra Gran Amistad 🌟',
      subtitulo: 'El Zorrito 🦊, La Palomita 🕊️ y la Víbora Sagrada 🐍 para Ashley & Nedally',
      mensaje: 'En este universo de flores amarillas no existe distancia, tiempo ni obstáculo que pueda quebrantar lo que hemos construido. Esta galaxia es un homenaje preparado con todo el corazón por el <strong>Zorrito</strong> 🦊, <strong>La Palomita</strong> 🕊️ y la <strong>Víbora Sagrada</strong> 🐍 para dos grandes amigas: <strong>Ashley</strong> y <strong>Nedally</strong>. Cada flor y cada estrella dorada representa la lealtad, la confianza y la alegría inmensa de saber que siempre contaremos los unos con los otros. ¡Gracias por brindarnos una amistad tan sincera, noble y llena de paz! ¡Feliz 21 de septiembre!',
      macetaTag: 'Amistad Verdadera 🌻'
    },
    ashley_luz: {
      destinatario: 'Para Ashley ✨',
      subtitulo: 'Autenticidad, energía y una sonrisa contagiosa',
      mensaje: 'Ashley, tenerte como amiga es una verdadera bendición. Tu autenticidad, tu sentido del humor inconfundible y esa energía tan positiva tienen el poder de alegrar cualquier jornada pesada. Gracias por ser esa amiga de oro con quien da gusto compartir risas, proyectos y metas. ¡Que este 21 de septiembre todo el universo brille para ti!',
      macetaTag: 'Para Ashley 🌻'
    },
    nedally_calma: {
      destinatario: 'Para Nedally 🌙',
      subtitulo: 'Serenidad, empatía y un corazón de oro',
      mensaje: 'Nedally, tu calma y tu dulzura son un refugio incomparable en medio del ruido del día a día. Tienes esa capacidad tan noble de escuchar con el corazón, de brindar palabras sensatas cuando hacen falta y de cuidar a tus amistades con una lealtad que vale millones. Gracias por ser una amiga incondicional, generosa y de tanta confianza. ¡Feliz 21 de septiembre!',
      macetaTag: 'Para Nedally 🌻'
    },
    amistad_oro: {
      destinatario: 'Ashley & Nedally 💛',
      subtitulo: 'Un vínculo que no se compra ni se improvisa',
      mensaje: 'Los verdaderos amigos son como las estrellas: no siempre se ven, pero sabemos con total certeza que están ahí cuidándonos. Esta flor simboliza el valor de nuestra amistad, forjada en la sinceridad, en el respeto mutuo y en el deseo genuino de vernos triunfar. Es un honor inmenso caminar a su lado en esta etapa de la vida.',
      macetaTag: 'Para Mis Amigas 🌻'
    },
    siempre_juntos: {
      destinatario: 'Amistad Incondicional ✨',
      subtitulo: 'Compañerismo en cada paso y en cada meta',
      mensaje: 'Celebrar este 21 de septiembre no es solo un detalle de flores amarillas, sino reafirmar el compromiso de seguir apoyándonos pase lo que pase. Que pasen los ciclos, que cambien las circunstancias o que vengan nuevos retos; sé que nuestra amistad seguirá firme, viva y creciendo con la misma fuerza con la que florecen los girasoles en primavera.',
      macetaTag: 'Juntas Siempre 🌻'
    },
    carino_sincero: {
      destinatario: 'Para Ashley ✨',
      subtitulo: 'Gratitud por tu alegría y lealtad',
      mensaje: 'Ashley, admiro muchísimo tu determinación, tu carisma y esa chispa tan propia que te hace única. Gracias por los consejos sinceros, por sumar siempre buena vibra a nuestras conversaciones y por ser alguien en quien se puede confiar con los ojos cerrados. Tu amistad es un tesoro que valoro profundamente.',
      macetaTag: 'Con Cariño, Ashley 🌻'
    },
    refugio_paz: {
      destinatario: 'Para Nedally 🌙',
      subtitulo: 'Paz, lealtad y apoyo constante',
      mensaje: 'Nedally, hay personas cuya sola presencia transmite paz y tranquilidad, y tú eres una de ellas. Gracias por estar presente en los momentos buenos y en los no tan fáciles, por tu madurez, por tu bondad desinteresada y por esa calidez humana que te caracteriza. Contar con tu amistad sincera hace todo más ligero y bonito.',
      macetaTag: 'Con Cariño, Nedally 🌻'
    },
    complicidad_unica: {
      destinatario: 'Nuestra Complicidad 🌟',
      subtitulo: 'Entenderse con una mirada y compartir risas',
      mensaje: 'No hay nada más valioso que una amistad donde no hace falta fingir nada: donde podemos mostrarnos tal cual somos, hablar de cualquier tema con naturalidad y reírnos de las cosas más simples. Esta complicidad que compartimos es un regalo de la vida, y estas flores amarillas son un homenaje a cada recuerdo vivido juntos.',
      macetaTag: 'Complicidad Pura 🌻'
    },
    risas_infinitas: {
      destinatario: 'Para Ashley ✨',
      subtitulo: 'Por cada anécdota y momento divertido',
      mensaje: 'Ashley, cada trasnochada de estudio, cada debate y cada anécdota que hemos compartido son recuerdos que atesoro con mucho cariño. Gracias por ponerle entusiasmo y buena onda a la rutina y por ser ese apoyo incondicional que siempre impulsa a los demás hacia adelante. ¡Que la vida te colme de bendiciones!',
      macetaTag: 'Para Ashley 🌻'
    },
    apoyo_firme: {
      destinatario: 'Para Nedally 🌙',
      subtitulo: 'Firmeza, honestidad y nobleza de alma',
      mensaje: 'Nedally, la lealtad es una virtud que brilla con fuerza en ti. Saber que cuento con tu consejo honesto y tu apoyo leal es algo por lo que siempre estaré agradecido. Que este 21 de septiembre te recuerde lo especial que eres y la huella tan bonita y positiva que dejas en quienes te rodean.',
      macetaTag: 'Para Nedally 🌻'
    },
    gratitud_eterna: {
      destinatario: 'Ashley & Nedally 💛',
      subtitulo: 'Gracias por formar parte de mi historia',
      mensaje: 'Hoy quiero agradecerles de corazón por su paciencia, por su tiempo, por sus enseñanzas y por cada conversación enriquecedora. Cada etapa es infinitamente más amena y significativa cuando se cuenta con amigas tan valiosas, trabajadoras y leales como ustedes dos. ¡Gracias por existir en mi vida!',
      macetaTag: 'Gratitud Total 🌻'
    },
    lazos_inquebrantables: {
      destinatario: 'Una Amistad para Toda la Vida ✨',
      subtitulo: 'Raíces profundas y alas hacia el futuro',
      mensaje: 'Las flores amarillas son símbolo de prosperidad, energía y lealtad inquebrantable. Esta galaxia es el reflejo de lo que hemos construido: un lazo que nació como compañerismo y que se ha consolidado en una amistad madura, respetuosa y duradera que perdurará a través de los años.',
      macetaTag: 'Amistad de Oro 🌻'
    },
    primavera_infinita: {
      destinatario: 'Para Ashley y Nedally 🌟',
      subtitulo: 'Deseos sinceros de éxito y felicidad',
      mensaje: 'Que este 21 de septiembre sea el preludio de miles de primaveras maravillosas. Deseo con todo mi corazón que triunfen en sus carreras profesionales, que alcancen cada una de sus metas y que nunca les falte salud, paz ni motivos para sonreír. ¡Siempre contarán con un amigo incondicional en mí!',
      macetaTag: 'Para Ambas 🌻'
    },
    constelacion_palomita: {
      destinatario: 'Constelación La Palomita 🕊️',
      subtitulo: 'Paz, dulzura y el vuelo más sincero de la amistad',
      mensaje: 'Desde las alturas más luminosas de este cosmos, <strong>La Palomita</strong> cuida los pasos de <strong>Ashley</strong> y <strong>Nedally</strong>. Simboliza la pureza de intención, la calma en días difíciles y el abrazo sincero que la distancia jamás podrá borrar. Que su vuelo celestial les recuerde siempre que en esta amistad siempre encontrarán un remanso de paz, comprensión y alegría compartida.',
      macetaTag: 'La Palomita 🕊️'
    },
    constelacion_vibora: {
      destinatario: 'Nebulosa Víbora Sagrada 🐍',
      subtitulo: 'Sabiduría, protección y lealtad inquebrantable',
      mensaje: 'Envuelta en destellos esmeralda y oro cósmico, la <strong>Víbora Sagrada</strong> es guardiana de nuestro lazo. Representa la sabiduría para aconsejar, la serenidad en cada reto y la lealtad que no vacila jamás. Para <strong>Ashley</strong> y <strong>Nedally</strong>, inspiradoras de grandes metas: que nunca les falte la fortaleza ni la certeza de que este trío de amigos siempre estará para apoyarlas y celebrar sus triunfos.',
      macetaTag: 'Víbora Sagrada 🐍'
    },
    constelacion_zorrito: {
      destinatario: 'Cúmulo Zorro Astronauta 🦊',
      subtitulo: 'Valentía, alegría contagiosa y espíritu explorador',
      mensaje: 'Surcando los senderos dorados de la galaxia, el <strong>Zorro Astronauta</strong> enciende la chispa de la aventura y la risa espontánea. <strong>Ashley</strong> y <strong>Nedally</strong>, este zorro cósmico les recuerda que los mejores viajes de la vida se hacen en compañía de verdaderas amigas. ¡Gracias por cada anécdota, por la buena energía y por hacer que cada día sea más brillante!',
      macetaTag: 'Zorro Astronauta 🦊'
    }
  };

  const KEYS_DEDICATORIAS = Object.keys(DEDICATORIAS_AMISTAD);
  let indiceActual = 0;

  // 2. Elementos del DOM
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const warpHud = document.getElementById('warp-hud');
  const galaxyHint = document.getElementById('galaxy-hint');

  const bgMusic = document.getElementById('bg-music');
  const btnToggleMusic = document.getElementById('btn-toggle-music');
  const musicLabel = document.getElementById('music-label');
  const equalizer = document.getElementById('equalizer');

  const btnOpenModal = document.getElementById('btn-open-modal');
  const btnResetView = document.getElementById('btn-reset-view');
  const btnReplayWarp = document.getElementById('btn-replay-warp');
  const btnLluvia = document.getElementById('btn-lluvia');

  // Controles de zoom de la galaxia 3D
  const btnGalaxyZoomIn = document.getElementById('btn-galaxy-zoom-in');
  const btnGalaxyZoomOut = document.getElementById('btn-galaxy-zoom-out');

  // Control de vista completa del escenario inicial
  const btnToggleSceneView = document.getElementById('btn-toggle-scene-view');
  const sceneViewLabel = document.getElementById('scene-view-label');
  const sceneViewIcon = document.getElementById('scene-view-icon');

  const modalTarjeta = document.getElementById('modal-tarjeta-floral');
  const tarjetaDestinatario = document.getElementById('tarjeta-destinatario');
  const tarjetaSubtitulo = document.getElementById('tarjeta-subtitulo');
  const tarjetaMensaje = document.getElementById('tarjeta-mensaje');
  const tarjetaMacetaTag = document.getElementById('tarjeta-maceta-tag');
  const btnTarjetaPrev = document.getElementById('btn-tarjeta-prev');
  const btnTarjetaNext = document.getElementById('btn-tarjeta-next');
  const btnTarjetaCerrar = document.getElementById('btn-tarjeta-cerrar');

  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  let audioIniciado = false;

  const mostrarToast = (mensaje, duracion = 3400) => {
    toastMessage.textContent = mensaje;
    toastNotice.classList.add('show');
    clearTimeout(toastNotice._timer);
    toastNotice._timer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, duracion);
  };

  // 3. Inicializar el motor de chispas en pantalla (petalos.js)
  const sistemaParticulas = new SistemaParticulas('canvas-petalos');

  // 3.1 Inicializar el motor de viento, hojas del árbol y flores (viento-escena.js)
  let motorVientoEscena = null;
  if (typeof VientoFloresEscena !== 'undefined') {
    motorVientoEscena = new VientoFloresEscena('canvas-tree-leaves');
  }

  // 4. Inicializar la Galaxia 3D Three.js
  const galaxia3D = new GalaxiaFlores3D('webgl-galaxy', (florData) => {
    // Cuando el usuario hace clic o toca una flor 3D
    const id = florData.id || 'sol';
    const foundIndex = KEYS_DEDICATORIAS.indexOf(id);
    if (foundIndex !== -1) {
      indiceActual = foundIndex;
    }
    abrirModalTarjeta(indiceActual);
  });

  // 4.1 COMPROBACIÓN DE FECHA Y CELEBRACIÓN DE MEDIANOCHE (21 DE SEPTIEMBRE)
  function esDia21Septiembre() {
    const ahora = new Date();
    // En JS getMonth() es 0-indexed (8 = septiembre). getDate() es 21
    if (ahora.getMonth() === 8 && ahora.getDate() === 21) {
      return true;
    }
    const inicioDia21 = new Date(ahora.getFullYear(), 8, 21, 0, 0, 0);
    const finDia21 = new Date(ahora.getFullYear(), 8, 21, 23, 59, 59);
    return (ahora >= inicioDia21 && ahora <= finDia21);
  }

  // Estado de celebración medianoche
  let yaCelebroMedianoche = false;
  const celebracionDia21 = document.getElementById('celebracion-dia-21');
  const btnCerrarCelebracion = document.getElementById('btn-cerrar-celebracion');

  if (btnCerrarCelebracion && celebracionDia21) {
    btnCerrarCelebracion.addEventListener('click', () => {
      celebracionDia21.classList.remove('is-celebrating');
    });
  }

  // Fanfarria sonora de celebración del 21 (Web Audio API)
  function reproducirFanfarria21Septiembre() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Acorde triunfal arpegiado festivo (C5 -> E5 -> G5 -> C6 -> E6)
      const notas = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notas.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        g.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.12);
        g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.12 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.log('Audio fanfarria no disponible:', e);
    }
  }

  // Disparar la Gran Celebración del 21 de Septiembre
  function activarCelebracion21Septiembre() {
    if (yaCelebroMedianoche) return;
    yaCelebroMedianoche = true;

    // 1. Mostrar banner dorado fulgurante
    if (celebracionDia21) {
      celebracionDia21.classList.add('is-celebrating');
    }

    // 2. Lluvia masiva de hojas y pétalos del gran árbol
    if (motorVientoEscena) {
      motorVientoEscena.sacudirArbol(window.innerWidth * 0.5, window.innerHeight * 0.25);
      setTimeout(() => {
        if (motorVientoEscena) motorVientoEscena.sacudirArbol(window.innerWidth * 0.38, window.innerHeight * 0.2);
      }, 700);
      setTimeout(() => {
        if (motorVientoEscena) motorVientoEscena.sacudirArbol(window.innerWidth * 0.62, window.innerHeight * 0.22);
      }, 1400);
    }

    // 3. Fuegos artificiales cósmicos en pantalla (múltiples explosiones de chispas)
    const puntosFuegos = [
      { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.75, y: window.innerHeight * 0.28 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.18 },
      { x: window.innerWidth * 0.35, y: window.innerHeight * 0.45 },
      { x: window.innerWidth * 0.65, y: window.innerHeight * 0.42 }
    ];

    puntosFuegos.forEach((pt, i) => {
      setTimeout(() => {
        sistemaParticulas.crearExplosion(pt.x, pt.y);
      }, i * 300);
    });

    // 4. Fanfarria sonora de celebración
    reproducirFanfarria21Septiembre();

    // 5. Transformar botón de lanzamiento para el gran día
    btnOpenGift.classList.add('btn-celebracion-pulse');
    const txtMain = btnOpenGift.querySelector('.btn-text-main');
    if (txtMain) txtMain.textContent = '¡Es Hora! Iniciar Viaje Espacial';

    // 6. Notificación Toast festiva
    mostrarToast('🎉 ¡FELIZ 21 DE SEPTIEMBRE ASHLEY Y NEDALLY! ¡El universo florece para ustedes! 🌻✨', 6000);
  }

  // Permitir probar la celebración en cualquier momento desde consola o haciendo clic en el título de la cuenta regresiva
  window.probarCelebracion21 = () => {
    yaCelebroMedianoche = false;
    activarCelebracion21Septiembre();
  };

  const hudHeaderTitle = document.querySelector('.hud-header-title');
  if (hudHeaderTitle) {
    hudHeaderTitle.style.cursor = 'pointer';
    hudHeaderTitle.title = '¡Toca aquí para previsualizar la celebración de medianoche! ✨';
    hudHeaderTitle.addEventListener('click', () => {
      window.probarCelebracion21();
    });
  }

  // 4.2 CUENTA REGRESIVA EN VIVO PARA EL 21 DE SEPTIEMBRE (HUD SUPERIOR)
  const elDays = document.getElementById('countdown-days');
  const elHours = document.getElementById('countdown-hours');
  const elMinutes = document.getElementById('countdown-minutes');
  const elSeconds = document.getElementById('countdown-seconds');
  const hyperdriveFlash = document.getElementById('hyperdrive-flash');
  const vueloTiempoTxt = document.getElementById('vuelo-tiempo-txt');

  function actualizarCuentaRegresiva() {
    const ahora = new Date();
    let anioMeta = ahora.getFullYear();
    let fechaMeta = new Date(anioMeta, 8, 21, 0, 0, 0); // 21 de Septiembre (mes 8 = septiembre en JS)

    // Si ya pasó el 21 de septiembre de este año (después de las 23:59:59 del 21)
    const finDia21 = new Date(anioMeta, 8, 21, 23, 59, 59);
    if (ahora > finDia21) {
      fechaMeta = new Date(anioMeta + 1, 8, 21, 0, 0, 0);
    }

    const diferencia = fechaMeta - ahora;

    if (diferencia <= 0 && ahora <= finDia21) {
      // ¡Hoy es 21 de Septiembre!
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      if (vueloTiempoTxt) vueloTiempoTxt.textContent = '00h 00m (¡Ya es 21!)';
      activarCelebracion21Septiembre();
      return;
    }

    const segundosTotales = Math.max(0, Math.floor(diferencia / 1000));
    const dias = Math.floor(segundosTotales / (3600 * 24));
    const horas = Math.floor((segundosTotales % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (elDays) elDays.textContent = pad(dias);
    if (elHours) elHours.textContent = pad(horas);
    if (elMinutes) elMinutes.textContent = pad(minutos);
    if (elSeconds) elSeconds.textContent = pad(segundos);

    if (vueloTiempoTxt) {
      vueloTiempoTxt.textContent = `${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`;
    }
  }

  actualizarCuentaRegresiva();
  setInterval(actualizarCuentaRegresiva, 1000);

  // 4.3 MODAL DE CONFIRMACIÓN: VUELO ANTICIPADO (OPCIÓN 2)
  const modalVueloAnticipado = document.getElementById('modal-vuelo-anticipado');
  const btnCerrarModalVuelo = document.getElementById('btn-cerrar-modal-vuelo');
  const vueloBackdrop = document.getElementById('vuelo-anticipado-backdrop');
  const btnDespegarAnticipado = document.getElementById('btn-despegar-anticipado');
  const btnEsperarHora = document.getElementById('btn-esperar-hora');

  function abrirModalVueloAnticipado() {
    if (modalVueloAnticipado) {
      modalVueloAnticipado.classList.add('is-active');
      reproducirSonidoPersonaje('zorrito');
    }
  }

  function cerrarModalVueloAnticipado() {
    if (modalVueloAnticipado) {
      modalVueloAnticipado.classList.remove('is-active');
    }
  }

  if (btnCerrarModalVuelo) btnCerrarModalVuelo.addEventListener('click', cerrarModalVueloAnticipado);
  if (vueloBackdrop) vueloBackdrop.addEventListener('click', cerrarModalVueloAnticipado);
  if (btnEsperarHora) {
    btnEsperarHora.addEventListener('click', () => {
      cerrarModalVueloAnticipado();
      mostrarToast('⏳ ¡Perfecto! Pueden seguir disfrutando del gran árbol y los personajes hasta medianoche 🍃', 3800);
    });
  }

  if (btnDespegarAnticipado) {
    btnDespegarAnticipado.addEventListener('click', () => {
      cerrarModalVueloAnticipado();
      ejecutarDespegueCohete();
    });
  }

  // 4.2 INTERACCIÓN CON LOS PROTAGONISTAS (Zorro Astronauta 🦊, Paloma 🕊️, Víbora Sagrada 🐍)
  const MENSAJES_PROTAGONISTAS = {
    zorrito: {
      autor: "Zorro Astronauta 🦊",
      avatar: "🦊",
      mensaje: "¡Sistemas de vuelo listos! ¿Preparadas para despegar hacia su galaxia, Ashley y Nedally? 🚀"
    },
    paloma: {
      autor: "La Palomita 🕊️",
      avatar: "🕊️",
      mensaje: "¡Que la paz, el cariño sincero y las risas siempre iluminen su camino en las estrellas! ✨"
    },
    vibora: {
      autor: "Víbora Sagrada 🐍",
      avatar: "🐍",
      mensaje: "¡La lealtad, la sabiduría y la verdadera amistad florecen eternamente en este 21 de septiembre! 💛"
    }
  };

  const heroDialogueDock = document.getElementById('hero-dialogue-dock');
  const dockDialogueAvatar = document.getElementById('dock-dialogue-avatar');
  const dockDialogueAuthor = document.getElementById('dock-dialogue-author');
  const dockDialogueMsg = document.getElementById('dock-dialogue-msg');
  const dockDialogueClose = document.getElementById('dock-dialogue-close');
  let timerDockDialogue = null;

  if (dockDialogueClose) {
    dockDialogueClose.addEventListener('click', (e) => {
      e.stopPropagation();
      if (heroDialogueDock) heroDialogueDock.classList.remove('is-active');
      clearTimeout(timerDockDialogue);
    });
  }

  // Sintetizador de audio melódico/mágico para cada personaje (Web Audio API)
  function reproducirSonidoPersonaje(amigoId) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (amigoId === 'zorrito') {
        // Arpegio brillante y jovial de 4 notas sci-fi (C5 -> E5 -> G5 -> C6)
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
          g.gain.setValueAtTime(0.01, ctx.currentTime + i * 0.09);
          g.gain.linearRampToValueAtTime(0.28, ctx.currentTime + i * 0.09 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.32);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.33);
        });
      } else if (amigoId === 'paloma') {
        // Campanas celestiales pacíficas / arpa de viento (F5 -> A5 -> C6 -> E6)
        const freqs = [698.46, 880.00, 1046.50, 1318.51];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.11);
          g.gain.setValueAtTime(0.01, ctx.currentTime + i * 0.11);
          g.gain.linearRampToValueAtTime(0.24, ctx.currentTime + i * 0.11 + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + i * 0.11 + 0.7);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.11);
          osc.stop(ctx.currentTime + i * 0.11 + 0.72);
        });
      } else if (amigoId === 'vibora') {
        // Resonancia mística y armónica dorada (cuenco sagrado)
        const base = 220; // A3
        const armónicos = [1, 2, 2.76, 5.4];
        armónicos.forEach((mul, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(base * mul, ctx.currentTime);
          g.gain.setValueAtTime(0.01, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.24 / (i + 1), ctx.currentTime + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 1.25);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 1.3);
        });
      }
    } catch (err) {
      console.log('Audio no disponible:', err);
    }

    // Voz de síntesis opcional suave en español
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const texto = MENSAJES_PROTAGONISTAS[amigoId]?.mensaje;
        if (texto) {
          const utter = new SpeechSynthesisUtterance(texto);
          utter.lang = 'es-ES';
          utter.rate = 1.05;
          utter.pitch = amigoId === 'zorrito' ? 1.2 : (amigoId === 'paloma' ? 1.1 : 0.85);
          window.speechSynthesis.speak(utter);
        }
      } catch (e) {}
    }
  }

  document.querySelectorAll('.hero-hotspot').forEach(hotspot => {
    const interactuarHeroe = (e) => {
      const amigoId = hotspot.getAttribute('data-amigo');
      const info = MENSAJES_PROTAGONISTAS[amigoId];
      if (!info) return;

      const rect = hotspot.getBoundingClientRect();
      const x = (e.clientX && e.clientX > 0) ? e.clientX : (rect.left + rect.width / 2);
      const y = (e.clientY && e.clientY > 0) ? e.clientY : (rect.top + rect.height / 2);
      sistemaParticulas.crearExplosion(x, y);

      hotspot.classList.add('active');
      setTimeout(() => hotspot.classList.remove('active'), 2800);

      // Reproducir sonido especial del personaje (Web Audio API + voz)
      reproducirSonidoPersonaje(amigoId);

      // Mostrar diálogo encima del botón de lanzamiento
      if (heroDialogueDock && dockDialogueAvatar && dockDialogueAuthor && dockDialogueMsg) {
        dockDialogueAvatar.textContent = info.avatar;
        dockDialogueAuthor.textContent = info.autor;
        dockDialogueMsg.textContent = info.mensaje;
        heroDialogueDock.classList.add('is-active');

        clearTimeout(timerDockDialogue);
        timerDockDialogue = setTimeout(() => {
          heroDialogueDock.classList.remove('is-active');
        }, 8500);
      }
    };

    hotspot.addEventListener('click', interactuarHeroe);
    hotspot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        interactuarHeroe(e);
      }
    });
  });

  // Sintetizador de audio para el susurro del viento y las hojas del árbol (Web Audio API)
  function reproducirSonidoViento() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // 1. Ráfaga de brisa suave con ruido blanco modulado
      const duracion = 2.4;
      const bufferSize = ctx.sampleRate * duracion;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(260, ctx.currentTime);
      bandpass.frequency.linearRampToValueAtTime(560, ctx.currentTime + 0.7);
      bandpass.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duracion);
      bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + duracion);

      // 2. Chispas y tintineo mágico de hojas doradas (campanillas sutiles)
      const notasHojas = [1046.50, 1318.51, 1567.98, 2093.00];
      notasHojas.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.2 + idx * 0.14);
        oscGain.gain.setValueAtTime(0.01, ctx.currentTime + 0.2 + idx * 0.14);
        oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2 + idx * 0.14 + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.2 + idx * 0.14 + 0.65);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.2 + idx * 0.14);
        osc.stop(ctx.currentTime + 0.2 + idx * 0.14 + 0.68);
      });
    } catch (e) {
      console.log('Audio viento no disponible:', e);
    }
  }

  // 4.3 INTERACCIÓN CON LA COPA DEL ÁRBOL: SACUDIR HOJAS Y CORRER VIENTO
  const treeCanopyInteractive = document.getElementById('tree-canopy-interactive');
  if (treeCanopyInteractive) {
    const sacudirCopaArbol = (e) => {
      // Sacudida visual de la copa
      treeCanopyInteractive.classList.remove('tree-canopy-rustle');
      void treeCanopyInteractive.offsetWidth; // Reflow for animation restart
      treeCanopyInteractive.classList.add('tree-canopy-rustle');

      // Desatar lluvia torrencial de pétalos y viento en el motor
      if (motorVientoEscena) {
        motorVientoEscena.sacudirArbol(e.clientX, e.clientY);
      }

      // Impulsar ráfaga en la pantalla (acelera olas del campo y flores)
      welcomeOverlay.classList.add('gust-active');
      setTimeout(() => welcomeOverlay.classList.remove('gust-active'), 3400);

      // Reproducir sonido de brisa y tintineo
      reproducirSonidoViento();

      // Chispas doradas en el punto tocado
      const x = (e.clientX && e.clientX > 0) ? e.clientX : (window.innerWidth * 0.48);
      const y = (e.clientY && e.clientY > 0) ? e.clientY : (window.innerHeight * 0.22);
      sistemaParticulas.crearExplosion(x, y);

      mostrarToast('🍃 ¡Una brisa dorada sacude el árbol y caen miles de pétalos! ✨', 3500);
    };

    treeCanopyInteractive.addEventListener('click', sacudirCopaArbol);
    treeCanopyInteractive.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sacudirCopaArbol(e);
      }
    });
  }

  // Sintetizador de audio para el rugido del motor del cohete (Web Audio API)
  function reproducirSonidoDespegue() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Buffer de ruido blanco para el rugido de propulsión
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filtro pasa-bajos para sonido grave y potente de cohete
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 1.2);

      // Envolvente de ganancia
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 2.1);
    } catch (err) {
      console.log('Audio de despegue no soportado:', err);
    }
  }

  // 5. APERTURA / ANIMACIÓN CINEMATOGRÁFICA DE DESPEGUE DEL COHETE 🚀
  let despegueEnProceso = false;

  function ejecutarDespegueCohete() {
    if (despegueEnProceso) return;
    despegueEnProceso = true;

    // Cerrar modal de confirmación si estaba abierto
    cerrarModalVueloAnticipado();

    // 1. Chispas y destellos en el botón de lanzamiento
    const rect = btnOpenGift.getBoundingClientRect();
    sistemaParticulas.crearExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // 2. Encender motores: Rugido de audio y vibración de pantalla
    reproducirSonidoDespegue();
    welcomeOverlay.classList.add('is-rumbling');
    welcomeOverlay.classList.add('is-launching');

    // Chispas de llamarada dorada en la tobera del cohete ilustrado
    const coheteUnit = document.getElementById('rocket-launch-fx') || document.getElementById('rocket-launch-unit');
    if (coheteUnit) {
      const cRect = coheteUnit.getBoundingClientRect();
      for (let k = 0; k < 6; k++) {
        setTimeout(() => {
          sistemaParticulas.crearExplosion(cRect.left + cRect.width / 2, cRect.top + 30);
        }, k * 140);
      }
    }

    // Iniciar la música de fondo
    iniciarMusica();

    mostrarToast('🚀 ¡Motores encendidos! ¡Despegando hacia la gran galaxia de flores amarillas!', 4500);

    // 3. Fase de hipervelocidad: Destello de luz al cruzar el cielo (1.35s)
    setTimeout(() => {
      if (hyperdriveFlash) hyperdriveFlash.classList.add('active');
    }, 1350);

    // 4. Entrada al túnel espacial 3D de flores amarillas (1.8s)
    setTimeout(() => {
      // Iniciar vuelo cósmico de Three.js
      galaxia3D.iniciarVuelo();

      // Desvanecer overlay de bienvenida y remover clases
      welcomeOverlay.classList.add('hidden');
      welcomeOverlay.classList.remove('is-rumbling', 'is-launching');
      document.body.classList.remove('not-loaded');
      if (motorVientoEscena) motorVientoEscena.detener();

      if (hyperdriveFlash) {
        setTimeout(() => hyperdriveFlash.classList.remove('active'), 400);
      }

      // Mostrar HUD de vuelo warp espacial
      warpHud.classList.add('active');
    }, 1800);

    // 5. Llegada al centro de la Galaxia 3D (~6.2s totales)
    setTimeout(() => {
      warpHud.classList.remove('active');
      galaxyHint.classList.add('active');
      mostrarToast('🪐 ¡Llegaste a la Galaxia! Arrastra para rotar en 3D y toca las flores 🌻', 4500);
      despegueEnProceso = false;
    }, 6200);
  }

  // AL HACER CLIC EN EL BOTÓN INICIAR VIAJE ESPACIAL:
  btnOpenGift.addEventListener('click', () => {
    if (despegueEnProceso) return;

    // Si ya es 21 de septiembre, despega directamente
    if (esDia21Septiembre()) {
      ejecutarDespegueCohete();
    } else {
      // Si aún falta para la medianoche, abre el modal de Vuelo Anticipado (Opción 2)
      abrirModalVueloAnticipado();
    }
  });

  // 6. CONTROL DEL REPRODUCTOR DE MÚSICA
  function iniciarMusica() {
    bgMusic.volume = 0.65;
    bgMusic.play()
      .then(() => {
        audioIniciado = true;
        actualizarEstadoAudio(true);
      })
      .catch((err) => {
        console.log('Autoplay prevenido:', err);
        actualizarEstadoAudio(false);
      });
  }

  function actualizarEstadoAudio(reproduciendo) {
    if (reproduciendo) {
      musicLabel.textContent = 'Música';
      equalizer.classList.remove('paused');
      btnToggleMusic.setAttribute('title', 'Pausar música');
    } else {
      musicLabel.textContent = 'Pausada';
      equalizer.classList.add('paused');
      btnToggleMusic.setAttribute('title', 'Reanudar música');
    }
  }

  btnToggleMusic.addEventListener('click', () => {
    if (!audioIniciado) {
      iniciarMusica();
      return;
    }

    if (bgMusic.paused) {
      bgMusic.play();
      actualizarEstadoAudio(true);
      mostrarToast('🎵 Música reanudada');
    } else {
      bgMusic.pause();
      actualizarEstadoAudio(false);
      mostrarToast('⏸️ Música en pausa');
    }
  });

  // 7. BOTONES DE ACCIÓN SUPERIORES
  btnOpenModal.addEventListener('click', () => {
    abrirModalTarjeta(indiceActual);
  });

  btnResetView.addEventListener('click', () => {
    galaxia3D.resetearVista();
    mostrarToast('🪐 Vista de la galaxia centrada');
  });

  btnReplayWarp.addEventListener('click', () => {
    galaxyHint.classList.remove('active');
    galaxia3D.iniciarVuelo();
    warpHud.classList.add('active');
    mostrarToast('✨ Repitiendo viaje espacial hacia la galaxia...');
    setTimeout(() => {
      warpHud.classList.remove('active');
      galaxyHint.classList.add('active');
    }, 4800);
  });

  btnLluvia.addEventListener('click', () => {
    const meteorosActivos = galaxia3D.toggleModoMeteoros();
    const esIntensa = sistemaParticulas.toggleLluviaIntensa();

    if (meteorosActivos || esIntensa) {
      btnLluvia.style.background = 'rgba(234, 179, 8, 0.45)';
      btnLluvia.style.borderColor = 'rgba(255, 215, 0, 0.9)';
      btnLluvia.style.boxShadow = '0 0 16px rgba(255, 215, 0, 0.6)';
      mostrarToast('🌠 ¡Lluvia de meteoros y pétalos dorados activada!');
    } else {
      btnLluvia.style.background = '';
      btnLluvia.style.borderColor = '';
      btnLluvia.style.boxShadow = '';
      mostrarToast('✨ Modo de cielo cósmico sereno');
    }
  });

  // 7.1 CONTROLES DE ZOOM DE LA GALAXIA 3D (BOTONES FLOTANTES)
  if (btnGalaxyZoomIn) {
    btnGalaxyZoomIn.addEventListener('click', (e) => {
      e.stopPropagation();
      galaxia3D.ajustarZoom(-75);
    });
  }

  if (btnGalaxyZoomOut) {
    btnGalaxyZoomOut.addEventListener('click', (e) => {
      e.stopPropagation();
      galaxia3D.ajustarZoom(75);
    });
  }

  // 7.2 CONTROL DE VISTA COMPLETA DEL ESCENARIO DE BIENVENIDA (ESPECIAL CELULARES)
  if (btnToggleSceneView && welcomeOverlay) {
    btnToggleSceneView.addEventListener('click', (e) => {
      e.stopPropagation();
      const estaCompleto = welcomeOverlay.classList.toggle('scene-fit-all');
      if (estaCompleto) {
        if (sceneViewLabel) sceneViewLabel.textContent = 'Vista de Cerca';
        if (sceneViewIcon) sceneViewIcon.textContent = '🔍';
        btnToggleSceneView.title = 'Regresar a vista inmersiva de cerca';
        mostrarToast('🖼️ Escenario Completo: Puedes ver al Zorro, la Palomita y la Víbora Sagrada 🌻', 3500);
      } else {
        if (sceneViewLabel) sceneViewLabel.textContent = 'Ver Escenario Completo';
        if (sceneViewIcon) sceneViewIcon.textContent = '🔍';
        btnToggleSceneView.title = 'Ver todo el escenario panorámico en 16:9';
        mostrarToast('✨ Vista de Cerca activada', 2000);
      }
    });

    // Soporte táctil: Pan horizontal y pellizco en bienvenida para teléfonos móviles
    let touchStartX = 0;
    let bgPosX = 50;
    const bgLayer = welcomeOverlay.querySelector('.cinematic-bg-layer');

    welcomeOverlay.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      } else if (e.touches.length === 2) {
        // Pellizco con 2 dedos alterna la vista completa del escenario
        btnToggleSceneView.click();
      }
    }, { passive: true });

    welcomeOverlay.addEventListener('touchmove', (e) => {
      if (welcomeOverlay.classList.contains('scene-fit-all')) return;
      if (e.touches.length === 1 && bgLayer) {
        const deltaX = e.touches[0].clientX - touchStartX;
        touchStartX = e.touches[0].clientX;
        bgPosX = Math.max(10, Math.min(90, bgPosX - (deltaX * 0.12)));
        bgLayer.style.backgroundPosition = `${bgPosX}% bottom`;
      }
    }, { passive: true });
  }

  // 8. MODAL DE TARJETA FLORAL (Inspirado en la Imagen de Referencia)
  function abrirModalTarjeta(indice) {
    if (indice < 0) indice = KEYS_DEDICATORIAS.length - 1;
    if (indice >= KEYS_DEDICATORIAS.length) indice = 0;
    indiceActual = indice;

    const key = KEYS_DEDICATORIAS[indiceActual];
    const data = DEDICATORIAS_AMISTAD[key];

    // Rellenar contenido con el mensaje de amistad sincera
    tarjetaDestinatario.innerHTML = data.destinatario;
    tarjetaSubtitulo.textContent = data.subtitulo;
    tarjetaMensaje.innerHTML = data.mensaje;
    tarjetaMacetaTag.textContent = data.macetaTag;

    modalTarjeta.classList.add('active');
  }

  function cerrarModalTarjeta() {
    modalTarjeta.classList.remove('active');
  }

  btnTarjetaCerrar.addEventListener('click', cerrarModalTarjeta);

  btnTarjetaPrev.addEventListener('click', () => {
    abrirModalTarjeta(indiceActual - 1);
  });

  btnTarjetaNext.addEventListener('click', () => {
    abrirModalTarjeta(indiceActual + 1);
  });

  // Cerrar al hacer clic en el fondo oscuro del modal
  modalTarjeta.addEventListener('click', (e) => {
    if (e.target === modalTarjeta) {
      cerrarModalTarjeta();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalTarjeta.classList.contains('active')) {
      cerrarModalTarjeta();
    }
  });

  // Chispas interactivas al tocar la pantalla cuando no se arrastra
  window.addEventListener('click', (e) => {
    if (
      !e.target.closest('.btn-action') &&
      !e.target.closest('.tarjeta-floral-card') &&
      !e.target.closest('.envelope-card')
    ) {
      sistemaParticulas.crearExplosion(e.clientX, e.clientY);
    }
  });
});
