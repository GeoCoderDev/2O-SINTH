function reproducirTodo(){
    reproducirMelodia();
}

function pausarTodo(){
    pausarMelodia()
}

function pararTodo() {
    eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
    pararMelodia();
}

function reproducirPausarTodo() {
  if (!seEstaReproduciendo) {
    reproducirTodo();
  } else {
    // PAUSAR
    pausarTodo();
  }
  eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
}

// EVENTOS RELACIONADOS CON LOS METODO DE REPRODUCCION
delegarEvento("click", "#boton-play-pausa, #boton-play-pausa *", reproducirPausarTodo);

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
