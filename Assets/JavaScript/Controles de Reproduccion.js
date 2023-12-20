// --------------------------------------------------------------------------------
// |                               TIME POSITION                                  |
// --------------------------------------------------------------------------------

const timePosition = document.getElementById("time-position");
const timePositioner = new CronometroConCentisegundos(timePosition);

// ---------------------------------------------------------------
// |              REPRODUCCIÓN DE NOTAS Y RITMOS                 |
// ---------------------------------------------------------------

const BTN_PLAY_PAUSA = document.getElementById("boton-play-pausa");
const TRIANGULO_PLAY = document.getElementById("triangulo-play");
const RECTANGULOS_PAUSA = document.querySelectorAll(".rectangulo-pausa");
const BTN_STOP = document.getElementById("boton-stop");
const TRANSPORT_BAR = document.getElementById("Transport-Bar");
let estiloParaEliminarBordeDelTransportBar;

let animacionActual;
let lastAnimationTime = 0;
let ultimoRequestAnimate;
let ultimaPosicionXRelativaTransportBar = 0;
let tempoDeLaAnimacion;
let TimeOutParaEmpezarAReproducirMelodiaDeNuevo;
// MOdificar esta variable con un input number
let CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS = 2;

function reproducirNotasYRitmos() {
  const contenedorRect =
    CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect();
  const transportBarRect = TRANSPORT_BAR.getBoundingClientRect();

  // Calcula la posición X relativa al contenedor incluyendo el scroll realizado
  const posicionXRelativa =
    transportBarRect.left -
    contenedorRect.left +
    CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft;
  ultimaPosicionXRelativaTransportBar = posicionXRelativa;

  for (let i = 0; i < todasLasPosicionesRelativasAlMarco.length - 2; i++) {
    if (
      posicionXRelativa > todasLasPosicionesRelativasAlMarco[i] &&
      posicionXRelativa <= todasLasPosicionesRelativasAlMarco[i + 1]
    ) {
      indiceCuadroSemicorcheaEnReproduccion = i;
      break;
    }
  }

  if (!estiloParaEliminarBordeDelTransportBar) {
    if (
      posicionXRelativa >=
      todasLasPosicionesRelativasAlMarco[
        devolverCantidadDeCompassesMinimaActual() * 16
      ] -
        1
    ) {
      // if (!TimeOutParaEmpezarAReproducirMelodiaDeNuevo) {
      // TimeOutParaEmpezarAReproducirMelodiaDeNuevo = setTimeout(() => {
      indiceCuadroSemicorcheaEnReproduccion = 0;
      if (estaPausado) return;
      // Si esta pausado no tiene porque reproducirse la melodia
      animacionActual = reproducirMelodiaAnimacion();

      timePositioner.reiniciarYSeguir();

      actualizarDurationSemicorcheas();
      // TimeOutParaEmpezarAReproducirMelodiaDeNuevo = undefined;
      // }, duracionSemicorcheas * 1000);
      // }

      if (
        posicionXRelativa >=
        todasLasPosicionesRelativasAlMarco[
          todasLasPosicionesRelativasAlMarco.length - 1
        ] -
          Todos_los_cuadros_semicorchea[0].offsetWidth / 2
      ) {
        estiloParaEliminarBordeDelTransportBar = insertarReglasCSSAdicionales(`
                    #Transport-Bar::before{
                        border-right-width:0;
                    }`);
      }
    }
  } else {
    if (indiceCuadroSemicorcheaEnReproduccion == 0) {
      eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
    }
  }

  if (indiceCuadroSemicorcheaEnReproduccion !== ultimoIndiceX) {
    NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorDeMelodias) => {
      if (
        notaSecuenciadorDeMelodias.indiceTablaX ==
        indiceCuadroSemicorcheaEnReproduccion
      ) {
        // AQUI ESTA LA CLAVE PARA HACER QUE SE REPRODUZCAN LAS NOTAS CON LONGITUD VARIABLE EN TIEMPO REAL
        notaSecuenciadorDeMelodias.notaSintetizador.hacerSonarNota(
          notaSecuenciadorDeMelodias.longitudSemicorcheas * duracionSemicorcheas
        );
      }
    });

    Todos_los_cuadros_semicorchea_ritmos.forEach(
      (cuadroSemicorcheaRitmo, index) => {
        if (
          (index -
            (indiceCuadroSemicorcheaEnReproduccion %
              (16 * CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS))) %
            32 !==
          0
        )
          return;
        // Agregando Borde
        cuadroSemicorcheaRitmo.style.border = `0.2vw solid blue`;

        if (
          cuadroSemicorcheaRitmo.classList.contains("Semicorchea-Ritmo-Activa")
        ) {
          reproducirDrum(Object.keys(DRUMS_RUTAS)[Math.floor(index / 32)]);
        }

        // Eliminando borde de la columna anterior
        Todos_los_cuadros_semicorchea_ritmos[
          index % 32 === 0
            ? index + CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS * 16 - 1
            : index - 1
        ].style.border = "";
      }
    );

    ultimoIndiceX = indiceCuadroSemicorcheaEnReproduccion;
  }

  ultimoRequestAnimate = requestAnimationFrame(reproducirNotasYRitmos);
}

//Esta funcion es para evitar que siga sonando la melodia al momento de pausar o parar la animacion
let desconectarYcrearNuevaSalidaDeAudio = () => {
  nodoSalidaSintetizador.disconnect();
  nodoSalidaSintetizador = undefined;
  nodoSalidaSintetizador = ENTORNO_AUDIO_SINTH.createGain();
  nodoSalidaSintetizador.connect(nodoCompresorSintetizador);
};

let eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar = () => {
  if (estiloParaEliminarBordeDelTransportBar) {
    eliminarReglasCSSAdicionales(estiloParaEliminarBordeDelTransportBar);
    estiloParaEliminarBordeDelTransportBar = undefined;
  }
};

RECTANGULOS_PAUSA.forEach((rectanguloPausa) => {
  rectanguloPausa.classList.toggle("no-desplegado");
});

let Tempo_al_empezar_Reproduccion;
let duracionSemicorcheaAlEmpezarReproduccion;

function reproducirMelodiaAnimacion() {
  let indiceInicialDeLaAnimacion =
    ultimoIndiceX && ultimoIndiceX != 0 ? ultimoIndiceX + 1 : 0;

  let posicionDeInicio =
    todasLasPosicionesRelativasAlMarco[indiceInicialDeLaAnimacion] -
    todasLasPosicionesRelativasAlMarco[0];

  Tempo_al_empezar_Reproduccion = TEMPO.value;
  duracionSemicorcheaAlEmpezarReproduccion = 60 / (TEMPO.value * 4);
  duracionSemicorcheas = duracionSemicorcheaAlEmpezarReproduccion;
  return TRANSPORT_BAR.animate(
    [
      { transform: `translateX(${pixelsToVWVH(posicionDeInicio, "vw")}vw)` },
      {
        transform: `translateX(${pixelsToVWVH(
          PIANO_ROLL.clientWidth,
          "vw"
        )}vw)`,
      },
    ],
    {
      iterations: 1,
      easing: "linear",
      fill: "forwards",
      duration:
        duracionSemicorcheaAlEmpezarReproduccion *
        (16 * CANTIDAD_DE_COMPASES - indiceInicialDeLaAnimacion) *
        1000,
    }
  );
}

function volverTransportBarAPosicion(posicionPX) {
  TRANSPORT_BAR.animate([{ transform: `translateX(${posicionPX}px)` }], {
    iterations: 1,
    easing: "linear",
    fill: "forwards",
    duration: 0,
  });
}

function pausarMelodia() {
  if (animacionActual) {
    animacionActual.pause();
    desconectarYcrearNuevaSalidaDeAudio();
  }

  if (ultimoRequestAnimate) {
    cancelAnimationFrame(ultimoRequestAnimate);
  }

  NotaSintetizador.quitarTodasLasPulsaciones();
  NotaSintetizador.pausarTodasLasNotasQueEstanSonandoConTecla();
}

function pararMelodia() {
  if (ultimoRequestAnimate) {
    cancelAnimationFrame(ultimoRequestAnimate);
  }

  if (animacionActual) {
    animacionActual.cancel();
    animacionActual = undefined;
  }
  animacionActual = new Animation();

  ultimoIndiceX = undefined;
  indiceCuadroSemicorcheaEnReproduccion = 0;

  volverTransportBarAPosicion(0);
  desconectarYcrearNuevaSalidaDeAudio();

  NotaSintetizador.quitarTodasLasPulsaciones();
}

function reproducirMelodiaYRitmo() {
  animacionActual = reproducirMelodiaAnimacion();
  reproducirNotasYRitmos();
}

// EVENTO DE CURSOR GRAB SOLO EN TRIANGULO DEL TRANSPORT BAR
delegarEvento("mousemove", TRANSPORT_BAR, (e) => {
  if (e.offsetY <= VWVHTopixels("vh", 3.3)[0]) {
    TRANSPORT_BAR.style.cursor = "grab";
  } else {
    TRANSPORT_BAR.style.cursor = "initial";
  }
});

function actualizarDurationSemicorcheas() {
  if (animacionActual) {
    animacionActual.playbackRate = TEMPO.value / Tempo_al_empezar_Reproduccion;
  }
  duracionSemicorcheas = 60 / (TEMPO.value * 4);
  
  if(!ultimoIndiceX) return;
  timePositioner.establecerTiempoTranscurrido(duracionSemicorcheas * (ultimoIndiceX + 1));
}

TEMPO.addEventListener("change", actualizarDurationSemicorcheas);
TEMPO.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY > 0) {
    TEMPO.stepDown();
  } else {
    TEMPO.stepUp();
  }
  actualizarDurationSemicorcheas();
});

TEMPO.addEventListener("mousedown", (e) => {
  if (e.button == 1) {
    TEMPO.value = TEMPO.defaultValue;
    actualizarDurationSemicorcheas();
  }
});

let cambiarBotonAPlayOPausa = () => {
  TRIANGULO_PLAY.classList.toggle("no-desplegado");
  RECTANGULOS_PAUSA.forEach((rectanguloPausa) => {
    rectanguloPausa.classList.toggle("no-desplegado");
  });
  BTN_PLAY_PAUSA.classList.toggle("boton-reproduccion-pulsado");
};

function reproducirTodo() {
  seEstaReproduciendo = true;
  estaPausado = false;
  reproducirMelodiaYRitmo();
  cambiarBotonAPlayOPausa();
  timePositioner.iniciar();
}

function pausarTodo() {
  if (seEstaReproduciendo) {
    pausarMelodia();
    seEstaReproduciendo = false;
    estaPausado = true;
    cambiarBotonAPlayOPausa();
    timePositioner.pausar();
  }
}

/**
 *
 * @returns devuelve true si cuando se paro no estaba pausado, y false si esta pausado.
 */
function pararTodo() {
  timePositioner.parar();

  Todos_los_cuadros_semicorchea_ritmos.forEach((cuadroSemicorcheaRitmo) => {
    cuadroSemicorcheaRitmo.style.border = "";
  });
  eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
  if (seEstaReproduciendo || estaPausado) {
    pararMelodia();
  }

  seEstaReproduciendo = false;

  if (!estaPausado) {
    estaPausado = true;
    cambiarBotonAPlayOPausa();
    return true;
  } else {
    return false;
  }
}

function reproducirPausarTodo() {
  if (!seEstaReproduciendo) {
    reproducirTodo();
  } else {
    pausarTodo();
  }
  eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
}

// EVENTOS RELACIONADOS CON LOS METODO DE REPRODUCCION
delegarEvento(
  "click",
  "#boton-play-pausa, #boton-play-pausa *",
  reproducirPausarTodo
);

delegarEvento("click", "#boton-stop, #boton-stop *", pararTodo);

function arrastrarTransportBar(eventoMouseDown) {
  if (eventoMouseDown.target == TRANSPORT_BAR) {
    if (!(eventoMouseDown.offsetY <= VWVHTopixels("vh", 3.3)[0])) {
      return false;
    }
  }

  let cambioDeCursor = cambiarCursorParaTodaLaPagina("grabbing");

  let stopExitosamente;

  let empezarArrastrarTransportBar = (e) => {
    if (!stopExitosamente) stopExitosamente = pararTodo();

    let posicionNueva = e.clientX - PIANO_ROLL.getBoundingClientRect().left;

    posicionNueva = Math.max(
      0,
      Math.min(
        posicionNueva,
        PIANO_ROLL.getBoundingClientRect().right +
          CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft
      )
    );


    for (let i = 0; i < todasLasPosicionesRelativasAlMarco.length; i++) {
      if (
        posicionNueva >=
          todasLasPosicionesRelativasAlMarco[i] -
            todasLasPosicionesRelativasAlMarco[0] &&
        posicionNueva <=
          todasLasPosicionesRelativasAlMarco[i + 1] -
            todasLasPosicionesRelativasAlMarco[0]
      ) {
        posicionNueva =
          todasLasPosicionesRelativasAlMarco[i] -
          todasLasPosicionesRelativasAlMarco[0];
        if (i == 64) {
          if (!estiloParaEliminarBordeDelTransportBar) {
            estiloParaEliminarBordeDelTransportBar =
              insertarReglasCSSAdicionales(`
                              #Transport-Bar::before{
                                  border-right-width:0;
                              }`);
          }
        } else {
          if (estiloParaEliminarBordeDelTransportBar) {
            eliminarReglasCSSAdicionales(
              estiloParaEliminarBordeDelTransportBar
            );
            estiloParaEliminarBordeDelTransportBar = undefined;
          }
        }

        timePositioner.establecerTiempoTranscurrido(i*duracionSemicorcheas);

        ultimoIndiceX = i - 1;

        break;
      }
    }

    volverTransportBarAPosicion(posicionNueva);
  };

  //FORZANDO ARRASTRE CON UN SOLO MOUSEDOWN SIN NECESIDAD DE DISPARAR EL EVENTO MOUSEMOVE,
  // PORQUE LAMENTABLEMENTE AVECES EL USUARIO NO LA DISPARARA CON SOLO HACER CLICK
  empezarArrastrarTransportBar(eventoMouseDown);

  let eventoMouseMove = delegarEvento(
    "mousemove",
    `*`,
    empezarArrastrarTransportBar
  );

  let eventoMouseUp = delegarEvento("mouseup", `*`, () => {
    if (stopExitosamente) reproducirTodo();
    eliminarEventoDelegado("mousemove", eventoMouseMove);
    eliminarEventoDelegado("mouseup", eventoMouseUp);
    cambioDeCursor.volverAlCursorOriginal();
  });
}

delegarEvento("mousedown", TRANSPORT_BAR, arrastrarTransportBar);
delegarEvento(
  "mousedown",
  `#NUMEROS-COMPASS, #NUMEROS-COMPASS *`,
  arrastrarTransportBar
);

// --------------------------------------------------------------------------------
// |                 EVENTO DE TECLADO PARA LAS NOTAS + GRABACION                 |
// --------------------------------------------------------------------------------

// EVENTO DE BOTON GRABAR

const BOTON_GRABAR = document.getElementById("boton-grabar");
const CLASE_BOTON_EN_GRABACION = "grabando";

let grabarOPararGrabacion = () => {
  seEstaGrabando = BOTON_GRABAR.classList.toggle(CLASE_BOTON_EN_GRABACION);
  BOTON_GRABAR.title = seEstaGrabando ? "Parar Grabacion" : "Grabar Notas";
};

delegarEvento("click", "#boton-grabar, #boton-grabar *", grabarOPararGrabacion);

//EVENTO DE TECLADO PARA SINTETIZADOR DE VARIAS TECLAS CON UN OBJETO MAP

let teclasPulsadas = new Map();

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.shiftKey || e.altKey) return;
  //Comprobando si la tecla pulsada se encuentra en nuestra lista de teclas pulsadas
  //para agregarla
  if (
    teclasPulsadas.has(e.keyCode) ||
    !notasSintetizadorPorTeclasDelTeclado[e.keyCode]
  )
    return false;

  let PromesaParaTerminarDeTocarNota = new Promise((resolve) => {
    teclasPulsadas.set(e.keyCode, resolve);
  });

  notasSintetizadorPorTeclasDelTeclado[e.keyCode].hacerSonarNota(
    PromesaParaTerminarDeTocarNota
  );

  if (!seEstaReproduciendo || !seEstaGrabando) return;

  new NotaSecuenciadorDeMelodias(PromesaParaTerminarDeTocarNota, {
    indiceInicioX: indiceCuadroSemicorcheaEnReproduccion,
    indiceInicioY: NotaSintetizador.todasLasNotasSintetizador.findIndex(
      (notaSintetizador) => {
        return notaSintetizador.codigoTecla === e.keyCode;
      }
    ),
  });
});

window.addEventListener("keyup", (e) => {
  if (!teclasPulsadas.has(e.keyCode)) {
    if (e.keyCode == 107) {
      NotaSintetizador.subirOctavaAlSintetizador();
    } else if (e.keyCode == 109) {
      NotaSintetizador.bajarOctavaAlSintetizador();
    }
    return false;
  }

  let resolveRecibido = teclasPulsadas.get(e.keyCode);
  resolveRecibido();

  teclasPulsadas.delete(e.keyCode);
});
