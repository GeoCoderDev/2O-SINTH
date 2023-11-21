//===================================================================
// SECUENCIADOR DE MELODIAS
//==================================================================

const CONTENEDOR_SECUENCIADOR_DE_MELODIAS = document.getElementById(
  "secuenciador-melodias-marco"
);
const CONTENEDOR_PIANO_ROLL = document.getElementById(
  "Ocultador-Espacio-Blanco"
);
const PIANO_ROLL = document.getElementById("Piano-Roll");
const TEMPO = document.getElementById("Tempo");
const CABECERA_DE_COMPASES = document.getElementById("NUMEROS-COMPASS");
const CANTIDAD_COMPASES_HTML = document.getElementById("Cantidad-Compases");
const TEMPO_AL_CARGAR_LA_PAGINA = TEMPO.value;
const duracionSemicorcheaINICIAL = 60 / (TEMPO_AL_CARGAR_LA_PAGINA * 4);
const CANTIDAD_DE_COMPASES_MINIMA = 2;
const Nombre_Clase_para_las_notas = "Secuenciador-Melodias-NOTA";
const Nombre_Clase_para_las_notas_seleccionadas =
  "nota-secuenciador-melodias-seleccionada";

let CANTIDAD_DE_COMPASES = CANTIDAD_DE_COMPASES_MINIMA;
let duracionSemicorcheas = 60 / (TEMPO.value * 4);

let Todos_los_cuadros_semicorchea = [];

let primeraFilaCuadrosSemicorchea;
let primeraColumnaCuadrosSemicorchea;

let todosLosOffsetLeft;
let todosLosOffsetTop;

let todasLasPosicionesRelativasAlMarco;

// Este evento servira para que cuando estemos usando el rodillo
// en el secuenciador de melodias, no podamos hacer uso de las
// barras de desplazamiento del navegador
CONTENEDOR_SECUENCIADOR_DE_MELODIAS.addEventListener("wheel", (event) => {
  event.preventDefault(); // Evita el scroll predeterminado del navegador
  const scrollStep = 250; // Ajusta la cantidad de desplazamiento por rueda
  CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollTop +=
    event.deltaY > 0 ? scrollStep : -scrollStep;
});

let NOTAS_SECUENCIADOR_DE_MELODIAS = [];
let acumuladorParaNotasIDs = 0;

// SELECCION MULTIPLE

// Variables para crear el cuadro de seleccion
let pulsandoControl = false;
let pulsandoClick = false;
let areaDeSeleccion;
let originX, originY;
let metodoVolverAlCursorOriginal;
// Array  que contendra las notas seleccionadas
let NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS = [];
// Variables que contendran el rango de el cuadro de seleccion
let indiceInicialX, indiceInicialY, indiceFinalX, indiceFinalY;
// Variables para mover todas las notas seleccionadas

let indiceOrigenMovimientoMultipleX, indiceOrigenMovimientoMultipleY;
// Variables adicionales
let notaPulsadaUsandoControlMasClick;
let margenIzquierdo, margenDerecho, margenSuperior, margenInferior;
// Array para guardar los indices de cada Nota que este seleccionada en un instante
let indicesNotasSeleccionadas = [];

let seleccionarNotas = () => {
  NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorDeMelodias) => {
    if (notaSecuenciadorDeMelodias.testearAreaDeSeleccion()) {
      notaSecuenciadorDeMelodias.seleccionarODeseleccionar();
    }
  });
};

window.addEventListener("keydown", (e) => {
  // Tecla Control
  if (e.keyCode == 17) {
    pulsandoControl = true;
    // Tecla Suprimir o Delete
  } else if (e.key === "Delete") {
    if (NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.length == 0) {
      while (NOTAS_SECUENCIADOR_DE_MELODIAS.length > 0) {
        let notaSecuenciadorDeMelodias = NOTAS_SECUENCIADOR_DE_MELODIAS[0];
        notaSecuenciadorDeMelodias.remove();
      }
    } else {
      while (NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.length > 0) {
        let notaSecuenciadorDeMelodiasSeleccionada =
          NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0];
        notaSecuenciadorDeMelodiasSeleccionada.remove();
      }
    }
    // Tecla Espacio
  } else if (e.key === " ") {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  // Si se suelta la tecla control
  if (e.keyCode == 17) {
    pulsandoControl = false;

    return;
  }
});

PIANO_ROLL.addEventListener("mouseup", (eventoMouseUp) => {
  if (eventoMouseUp.button == 0) {
    if (pulsandoClick) {
      if (metodoVolverAlCursorOriginal) metodoVolverAlCursorOriginal();

      PIANO_ROLL.removeEventListener("mousemove", obteniendoDimensiones);

      indiceFinalX =
        NOTAS_SECUENCIADOR_DE_MELODIAS.find(
          (notaSecuenciadorDeMelodias) =>
            notaSecuenciadorDeMelodias.elementoHTML == eventoMouseUp.target
        )?.indiceTablaX ??
        esUnUnoNegativo(
          todosLosOffsetLeft.indexOf(eventoMouseUp.target.offsetLeft),
          undefined
        ) ??
        indiceInicialX ??
        undefined;

      indiceFinalY =
        NOTAS_SECUENCIADOR_DE_MELODIAS.find(
          (notaSecuenciadorDeMelodias) =>
            notaSecuenciadorDeMelodias.elementoHTML == eventoMouseUp.target
        )?.indiceTablaY ??
        esUnUnoNegativo(
          todosLosOffsetTop.indexOf(eventoMouseUp.target.offsetTop),
          undefined
        ) ??
        indiceInicialY ??
        undefined;

      if (areaDeSeleccion) {
        areaDeSeleccion.remove();
        areaDeSeleccion = undefined;
      }

      seleccionarNotas();

      notaPulsadaUsandoControlMasClick = undefined;

      pulsandoClick = false;
    }
  }
});

// Evento de mousedown en PIANO_ROLL, para que cuando se haga click se cree una nueva Nota

PIANO_ROLL.addEventListener("mousedown", (eventoMouseDown) => {
  if (eventoMouseDown.button == 0) {
    if (!pulsandoControl) {
      // Deseleccionando notas seleccionadas si se pulsa en algun
      // lugar que no sea una nota seleccionada
      if (
        !eventoMouseDown.target.classList.contains(
          Nombre_Clase_para_las_notas_seleccionadas
        )
      ) {
        if (NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.length > 0) {
          while (NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.length > 0) {
            let notaSecuenciadorDeMelodiasSeleccionada =
              NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0];
            notaSecuenciadorDeMelodiasSeleccionada.seleccionarODeseleccionar();
          }
        }
      }

      let nuevaNotaSecuenciadorMelodias = new NotaSecuenciadorDeMelodias(
        eventoMouseDown
      );
    } else {
      // EN CASO SE ESTEA PULSANDO CONTROL

      metodoVolverAlCursorOriginal =
        cambiarCursorParaTodaLaPagina("crosshair").volverAlCursorOriginal;

      areaDeSeleccion = document.createElement("div");
      areaDeSeleccion.style.position = "absolute";
      originX =
        eventoMouseDown.clientX - PIANO_ROLL.getBoundingClientRect().left;
      areaDeSeleccion.style.left = originX + "px";
      originY =
        eventoMouseDown.clientY - PIANO_ROLL.getBoundingClientRect().top;
      areaDeSeleccion.style.top = originY + "px";
      areaDeSeleccion.style.backgroundColor = "rgba(255, 165, 0,0.35)";
      areaDeSeleccion.style.border = "0.4vh solid orange";
      areaDeSeleccion.style.borderRadius = "0.5vw";
      PIANO_ROLL.appendChild(areaDeSeleccion);
      PIANO_ROLL.addEventListener("mousemove", obteniendoDimensiones);

      pulsandoClick = true;

      indiceInicialX =
        NOTAS_SECUENCIADOR_DE_MELODIAS.find(
          (notaSecuenciadorDeMelodias) =>
            notaSecuenciadorDeMelodias.elementoHTML == eventoMouseDown.target
        )?.indiceTablaX ??
        todosLosOffsetLeft.indexOf(eventoMouseDown.target.offsetLeft);

      indiceInicialY =
        NOTAS_SECUENCIADOR_DE_MELODIAS.find(
          (notaSecuenciadorDeMelodias) =>
            notaSecuenciadorDeMelodias.elementoHTML == eventoMouseDown.target
        )?.indiceTablaY ??
        todosLosOffsetTop.indexOf(eventoMouseDown.target.offsetTop);
    }
  }
});

let obteniendoDimensiones = (eventoMouseMove) => {
  const coordX =
    eventoMouseMove.clientX - PIANO_ROLL.getBoundingClientRect().left;
  const coordY =
    eventoMouseMove.clientY - PIANO_ROLL.getBoundingClientRect().top;

  // CUARTO CUADRANTE DONDE(X+ , Y+)
  if (coordX - originX >= 0 && coordY - originY >= 0) {
    if (!areaDeSeleccion) return;
    areaDeSeleccion.style.width = Math.abs(coordX - originX) + "px";
    areaDeSeleccion.style.height = Math.abs(coordY - originY) + "px";

    // TERCER CUADRANTE DONDE(X- , Y+)
  } else if (coordX - originX < 0 && coordY - originY >= 0) {
    if (!areaDeSeleccion) return;
    areaDeSeleccion.style.width = Math.abs(coordX - originX) + "px";
    areaDeSeleccion.style.height = Math.abs(coordY - originY) + "px";
    areaDeSeleccion.style.left = originX - Math.abs(coordX - originX) + "px";
    // PRIMER CUADRANTE DONDE(X+ , Y-)
  } else if (coordX - originX >= 0 && coordY - originY <= 0) {
    if (!areaDeSeleccion) return;
    areaDeSeleccion.style.width = Math.abs(coordX - originX) + "px";
    areaDeSeleccion.style.height = Math.abs(coordY - originY) + "px";
    areaDeSeleccion.style.top = originY - Math.abs(coordY - originY) + "px";
    // SEGUNDO CUADRANTE DONDE(X- , Y-)
  } else if (coordX - originX < 0 && coordY - originY < 0) {
    if (!areaDeSeleccion) return;
    areaDeSeleccion.style.width = Math.abs(coordX - originX) + "px";
    areaDeSeleccion.style.height = Math.abs(coordY - originY) + "px";
    areaDeSeleccion.style.left = originX - Math.abs(coordX - originX) + "px";
    areaDeSeleccion.style.top = originY - Math.abs(coordY - originY) + "px";
  } else {
    console.log("Error 147, Secuenciador Melodias");
  }
};

// Variables que seran de uso compartido entre instancias de la clase NotaSecuenciadorDeMelodias
var Cantidad_Semicorcheas_Foco = 1; //Cantidad de semicorcheas en la que nos quedamos
let isDraggingNote = false;
let offsetX, offsetY;
let currentDraggingNote;
let ultimoCuadroSemicorchea;
let isResizing = false;
let lastX;
let originalWidth = 0;

const PIXELES_DE_SENSIBILIDAD = 5;

// Configurando estilos del area para redimensionar
insertarReglasCSSAdicionales(`

    .${Nombre_Clase_para_las_notas}{
        cursor: grab;
    }

    .${Nombre_Clase_para_las_notas}::after {
        content: "";
        position: absolute;
        top: 0;
        right: -${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD, "vw")}vw;
        bottom: 0;
        width: ${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD, "vw")}vw; 
        cursor: ew-resize;
    }
`);

class NotaSecuenciadorDeMelodias {
  /**
   *
   * @param {MouseEvent} evento en caso la Nota se cree con un Evento de Click
   * @param {{indiceTablaX, indiceTablaY, longitudSemicorcheas}} dataNote especifica este segundo parametro en caso quieras crear una nota apartir de sus datos
   * @returns
   */
  constructor(evento, dataNote) {
    // Evitar crear nuevo div si se hace clic en uno existente o si no esta haciendo clic en un elemento de la cuadricula
    if (
      !evento?.target?.classList?.contains("Cuadro-Semicorchea") ||
      evento?.target?.classList?.contains(Nombre_Clase_para_las_notas)
    ) {
      if (!dataNote) return;
    }

    this.elementoHTML = document.createElement("div");
    this.longitudSemicorcheas = Cantidad_Semicorcheas_Foco;
    this.elementoHTML.classList.add(Nombre_Clase_para_las_notas);
    this.elementoHTML.style.width = `${1.99 * this.longitudSemicorcheas}vw`;
    this.elementoHTML.style.height = "3.2vh";
    this.elementoHTML.style.backgroundColor = "rgb(205, 104, 255)";
    this.elementoHTML.style.position = "absolute";
    this.elementoHTML.style.cursor = "grab";
    this.elementoHTML.style.borderRadius = "0.3vw";
    this.elementoHTML.style.boxShadow =
      "0px 0px 0.9vw 0.4vw rgba(0, 0, 0, .5) inset";
    this.elementoHTML.style.border = "0.1vw solid rgb(185, 84, 235)";
    this.elementoHTML.style.opacity = "0.9";

    // Se estan usando arrowFunctions para poder usar la palabra clave this dentro de funciones que estan
    // dentro de metodos de una clase como en este caso la funcion onMouseDown que se encuentra dentro del metodo
    // constructor

    /**
     *
     * @param {Event} e
     * @param {boolean} forzado
     */
    let onMouseDown = (e, forzado = false) => {
      if (e.button == 0) {
        if (!pulsandoControl) {
          // Solo se podra arrastrar si esta fuera del area sensible a redimensionamiento o si
          // el evento esta siendo forzado
          currentDraggingNote = this.elementoHTML;
          if (
            !(
              e.offsetX >=
              this.elementoHTML.offsetWidth - PIXELES_DE_SENSIBILIDAD
            ) ||
            forzado
          ) {
            if (
              !this.elementoHTML.classList.contains(
                Nombre_Clase_para_las_notas_seleccionadas
              )
            ) {
              // Solo en el borde derecho
              isDraggingNote = true;
              offsetX = e.offsetX;
              offsetY = e.offsetY;
              this.elementoHTML.style.cursor = "grabbing";
              PIANO_ROLL.style.cursor = "grabbing";
              moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(
                e,
                this.elementoHTML,
                this
              );
            } else {
              // Se estan moviendo todas las notas seleccionadas

              // Capturando indices
              indiceOrigenMovimientoMultipleX = this.indiceTablaX;
              indiceOrigenMovimientoMultipleY = this.indiceTablaY;

              let grupoNotasIndiceMinX =
                NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.reduce(
                  (acumulador, currenValue) => {
                    return Math.min(acumulador, currenValue.indiceTablaX);
                  },
                  NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0].indiceTablaX
                );

              let grupoNotasIndiceMinY =
                NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.reduce(
                  (acumulador, currenValue) => {
                    return Math.min(acumulador, currenValue.indiceTablaY);
                  },
                  NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0].indiceTablaY
                );

              let grupoNotasIndiceMaxX =
                NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.reduce(
                  (acumulador, currenValue) => {
                    return Math.max(acumulador, currenValue.indiceFinalTablaX);
                  },
                  NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0]
                    .indiceFinalTablaX
                );

              let grupoNotasIndiceMaxY =
                NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.reduce(
                  (acumulador, currenValue) => {
                    return Math.max(acumulador, currenValue.indiceTablaY);
                  },
                  NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS[0].indiceTablaY
                );

              margenSuperior =
                indiceOrigenMovimientoMultipleY - grupoNotasIndiceMinY;

              margenDerecho =
                grupoNotasIndiceMaxX - indiceOrigenMovimientoMultipleX;

              margenInferior =
                grupoNotasIndiceMaxY - indiceOrigenMovimientoMultipleY;

              margenIzquierdo =
                indiceOrigenMovimientoMultipleX - grupoNotasIndiceMinX;

              indicesNotasSeleccionadas =
                NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.map(
                  ({ indiceTablaX, indiceTablaY }) => {
                    return { indiceTablaX, indiceTablaY };
                  }
                );
            }
          } else {
            isResizing = true;
            lastX = e.clientX;
            originalWidth = this.elementoHTML.offsetWidth;
          }

          document.addEventListener("mousemove", onMouseMove);
        } else {
          notaPulsadaUsandoControlMasClick = this;
          this.seleccionarODeseleccionar();
        }
      } else {
        // Evento de boton derecho de teclado
        this.remove();
      }
    };

    let onMouseUp = () => {
      isDraggingNote = false;
      PIANO_ROLL.style.cursor = "default";
      this.elementoHTML.style.cursor = "grab";
      if (this.elementoHTML == currentDraggingNote) {
        currentDraggingNote = null;
      }
      isResizing = false;
      document.removeEventListener("mousemove", onMouseMove);

      //Asignando la nota segun el indiceY de la tabla en el que se encuentra ahora la nota en base al array de todas las notas
      //del sintetizador, que estan en un orden invertido, por eso hacemos una copia con slice y luego lo revertimos
      this.notaSintetizador = NotaSintetizador.todasLasNotasSintetizador
        .slice()
        .reverse()[this.indiceTablaY];

      if (indicesNotasSeleccionadas) indicesNotasSeleccionadas = undefined;
    };

    let onMouseMove = (e) => {
      if (
        !isDraggingNote &&
        !isResizing &&
        !this.elementoHTML.classList.contains(
          Nombre_Clase_para_las_notas_seleccionadas
        )
      )
        return;
      moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(
        e,
        this.elementoHTML,
        this,
        this.elementoHTML.classList.contains(
          Nombre_Clase_para_las_notas_seleccionadas
        ) //Si esta seleccionada delvolvera True
      );
      //Asignando la nota segun el indiceY de la tabla en el que se encuentra ahora la nota en base al array de todas las notas
      //del sintetizador, que estan en un orden invertido, por eso hacemos una copia con slice y luego lo revertimos
      this.notaSintetizador = NotaSintetizador.todasLasNotasSintetizador
        .slice()
        .reverse()[this.indiceTablaY];
    };

    this.elementoHTML.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    PIANO_ROLL.appendChild(this.elementoHTML);

    // Iniciar arrastre automáticamente
    if (evento) {
      onMouseDown(evento, true);
    } else {
      //   En caso se quiera crear una nota apartir del objeto dataNote
      let { indiceTablaX, indiceTablaY, longitudSemicorcheas } = dataNote;
      this.indiceTablaX = indiceTablaX;
      this.indiceTablaY = indiceTablaY;
      this.longitudSemicorcheas = longitudSemicorcheas;
      this.indiceFinalTablaX = indiceTablaX + longitudSemicorcheas;

      this.elementoHTML.style.left =
        todosLosOffsetLeft[this.indiceTablaX] + "px";
      this.elementoHTML.style.top = todosLosOffsetTop[this.indiceTablaY] + "px";
      this.elementoHTML.style.width = `${1.99 * this.longitudSemicorcheas}vw`;
      onMouseUp();
    }

    NOTAS_SECUENCIADOR_DE_MELODIAS.push(this);
  }

  actualizarIndices() {
    // OBTENIENDO LOS NUEVOS INDICES Y EL CUADRO SEMICORCHEA POR DEBAJO
    this.indiceTablaX = todosLosOffsetLeft.indexOf(
      this.elementoHTML.offsetLeft
    );
    this.indiceTablaY = todosLosOffsetTop.indexOf(
      distanciaRelativaEntreElementos(PIANO_ROLL, this.elementoHTML)
        .distanciaVerticalPX
    );

    this.indiceFinalTablaX = this.indiceTablaX + this.longitudSemicorcheas - 1;
  }

  testearAreaDeSeleccion() {
    // Si esta nota fue sobre la que se hizo click con control
    // entonces no se deseleccionara o seleccionara
    if (notaPulsadaUsandoControlMasClick == this) return false;
    let minAreaX = Math.min(indiceInicialX, indiceFinalX);
    let maxAreaX = Math.max(indiceInicialX, indiceFinalX);

    let maxAreaY = Math.max(indiceInicialY, indiceFinalY);
    let minAreaY = Math.min(indiceInicialY, indiceFinalY);

    let dentroX =
      (this.indiceTablaX >= minAreaX && this.indiceTablaX <= maxAreaX) ||
      (this.indiceFinalTablaX >= minAreaX &&
        this.indiceFinalTablaX <= maxAreaX) ||
      (this.indiceTablaX < minAreaX && this.indiceFinalTablaX > maxAreaX);
    let dentroY =
      this.indiceTablaY >= minAreaY && this.indiceTablaY <= maxAreaY;

    return dentroX && dentroY;
  }

  ajustarNotaAGrilla() {
    this.CuadroSemicorcheaDebajo =
      Todos_los_cuadros_semicorchea[
        16 * CANTIDAD_DE_COMPASES * this.indiceTablaY + this.indiceTablaX
      ];
    this.elementoHTML.style.left =
      pixelsToVWVH(
        distanciaRelativaEntreElementos(
          PIANO_ROLL,
          this.CuadroSemicorcheaDebajo
        ).distanciaHorizontalPX,
        "vw"
      ) + "vw";
    this.elementoHTML.style.top =
      pixelsToVWVH(
        distanciaRelativaEntreElementos(
          PIANO_ROLL,
          this.CuadroSemicorcheaDebajo
        ).distanciaVerticalPX,
        "vw"
      ) + "vw";
  }

  /**
   *
   * @param {Number} indiceTablaX
   * @param {Number} indiceTablaY
   */
  moveTo(indiceTablaX, indiceTablaY) {
    this.indiceTablaX = indiceTablaX;
    this.indiceTablaY = indiceTablaY;
    this.indiceFinalTablaX = this.indiceTablaX + this.longitudSemicorcheas - 1;

    this.elementoHTML.style.left = todosLosOffsetLeft[this.indiceTablaX] + "px";
    this.elementoHTML.style.top = todosLosOffsetTop[this.indiceTablaY] + "px";
  }

  remove() {
    NOTAS_SECUENCIADOR_DE_MELODIAS.remove(this);
    this.elementoHTML.remove();
    NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.remove(this);
  }

  seleccionarODeseleccionar() {
    if (NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.indexOf(this) == -1) {
      NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.push(this);
    } else {
      NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.remove(this);
    }
    return this.elementoHTML.classList.toggle(
      Nombre_Clase_para_las_notas_seleccionadas
    );
  }

  static acomodarTodasLasNotas() {
    NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorMelodias) => {
      notaSecuenciadorMelodias.ajustarNotaAGrilla();
    });
  }
}

// ------------------------------------------------
// |  FUNCION DE POSICIONAMIENTO PARA LA CLASE    |
// ------------------------------------------------
// Funcion para mousemove y mousedown de las Notas
/**
 *
 * @param {MouseEvent} e
 * @param {HTMLElement} divArrastrado
 * @param {NotaSecuenciadorDeMelodias} notaAsociada
 * @param {Boolean} movimientoMultiple
 * @returns
 */
function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(
  e,
  divArrastrado,
  notaAsociada,
  movimientoMultiple = false
) {
  if (pulsandoControl) return;
  if (isResizing) {
    divArrastrado.style.cursor = "ew-resize";
    PIANO_ROLL.style.cursor = "ew-resize";

    const deltaX = e.clientX - lastX;
    const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
    divArrastrado.style.width = `${pixelsToVWVH(
      Math.max(newWidth, 0),
      "vw"
    )}vw`;

    let coordernadaDraggingNoteX = divArrastrado.getBoundingClientRect().right;
    let coordernadaDraggingNoteY = divArrastrado.getBoundingClientRect().top;
    // Obteniendo el elemento 'Cuadro-Semicorchea' que se encuentra debajo del elemento arrastrado
    let elementsUnderCursor = document.elementsFromPoint(
      coordernadaDraggingNoteX,
      coordernadaDraggingNoteY
    );
    let elementUnderCursorGrilla = elementsUnderCursor.filter(
      (element) => element.className == "Cuadro-Semicorchea"
    )[0];

    if (elementUnderCursorGrilla) {
      let anchoObedienteAGrilla =
        elementUnderCursorGrilla.getBoundingClientRect().right -
        divArrastrado.getBoundingClientRect().left;
      divArrastrado.style.width = `${pixelsToVWVH(
        anchoObedienteAGrilla,
        "vw"
      )}vw`;
      ultimoCuadroSemicorchea = elementUnderCursorGrilla;
    } else {
      let anchoObedienteAGrilla =
        ultimoCuadroSemicorchea.getBoundingClientRect().right -
        divArrastrado.getBoundingClientRect().left;
      divArrastrado.style.width = `${pixelsToVWVH(
        anchoObedienteAGrilla,
        "vw"
      )}vw`;
    }

    //OBTENIENDO LA NUEVA LONGITUD A CAUSA DEL RESIZE

    let lefClient = notaAsociada.elementoHTML.getBoundingClientRect().left;
    // Para obtener las coordenadas derechas quitaremos 5 pixeles para asegurar que tomaremos
    // el elemento Cuadro-Semicorchea correcto y no el siguiente adyacente
    let rightClient =
      notaAsociada.elementoHTML.getBoundingClientRect().right - 5;
    let topClient = notaAsociada.elementoHTML.getBoundingClientRect().top;

    let elementosDebajoDelLadoIzquierdo = document.elementsFromPoint(
      lefClient,
      topClient
    );
    let elementosDebajoDelLadoDerecho = document.elementsFromPoint(
      rightClient,
      topClient
    );
    let semicorcheaDebajoDelLadoIzquierdo =
      elementosDebajoDelLadoIzquierdo.filter((elemento) =>
        elemento.classList.contains("Cuadro-Semicorchea")
      )[0];
    let semicorcheaDebajoDelLadoIDerecho = elementosDebajoDelLadoDerecho.filter(
      (elemento) => elemento.classList.contains("Cuadro-Semicorchea")
    )[0];
    let ancho_de_una_semicorchea_actual =
      semicorcheaDebajoDelLadoIDerecho.offsetWidth;
    if (semicorcheaDebajoDelLadoIzquierdo && semicorcheaDebajoDelLadoIDerecho) {
      let longitud =
        (semicorcheaDebajoDelLadoIDerecho.getBoundingClientRect().right -
          semicorcheaDebajoDelLadoIzquierdo.getBoundingClientRect().left) /
        ancho_de_una_semicorchea_actual;

      notaAsociada.longitudSemicorcheas = Math.round(longitud);
      //Seteando la ultima longitud para las nuevas notas
      Cantidad_Semicorcheas_Foco = notaAsociada.longitudSemicorcheas;
    }

    notaAsociada.actualizarIndices();
  } else {
    let x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
    let y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;

    // Verificar que el nuevo div no se salga del contenedor
    let maxX = PIANO_ROLL.clientWidth - divArrastrado.clientWidth;
    let maxY = PIANO_ROLL.clientHeight - divArrastrado.clientHeight;
    divArrastrado.style.left = `${
      pixelsToVWVH(Math.max(0, Math.min(x, maxX)), "vw")[0]
    }vw`;
    divArrastrado.style.top = `${
      pixelsToVWVH(Math.max(0, Math.min(y, maxY)), "vh")[0]
    }vh`;

    let coordernadaDraggingNoteX = divArrastrado.getBoundingClientRect().left;
    let coordernadaDraggingNoteY = divArrastrado.getBoundingClientRect().top;
    // Obteniendo el elemento 'Cuadro-Semicorchea' que se encuentra debajo del elemento arrastrado
    let elementsUnderCursor = document.elementsFromPoint(
      coordernadaDraggingNoteX,
      coordernadaDraggingNoteY
    );

    let elementUnderCursorGrilla = elementsUnderCursor.filter(
      (element) => element.className == "Cuadro-Semicorchea"
    )[0];

    // En caso que se trate de un movimiento multiple interceptaremos
    // elementUnderCursorGrilla para que no se pueda mover en caso
    // no se cumpla la condicion de los margenes o se opte
    // por reemplazarla por otro cuadro semicorchea cercano que si cumpla
    if (movimientoMultiple && elementUnderCursorGrilla) {
      let indiceXElementUnderCursor = todosLosOffsetLeft.indexOf(
        elementUnderCursorGrilla.offsetLeft
      );
      let indiceYElementUnderCursor = todosLosOffsetTop.indexOf(
        elementUnderCursorGrilla.offsetTop
      );

      let optionalElementsUnderCursor;
      if (
        indiceXElementUnderCursor + margenDerecho >
          primeraFilaCuadrosSemicorchea.length - 1 ||
        indiceXElementUnderCursor - margenIzquierdo < 0 ||
        indiceYElementUnderCursor - margenSuperior < 0 ||
        indiceYElementUnderCursor + margenInferior >
          primeraColumnaCuadrosSemicorchea.length - 1
      ) {
        let indiceXOptionalElementsUnderCursor = !(
          indiceXElementUnderCursor + margenDerecho >
            primeraFilaCuadrosSemicorchea.length - 1 ||
          indiceXElementUnderCursor - margenIzquierdo < 0
        )
          ? indiceXElementUnderCursor
          : notaAsociada.indiceTablaX;

        let indiceYOptionalElementsUnderCursor = !(
          indiceYElementUnderCursor - margenSuperior < 0 ||
          indiceYElementUnderCursor + margenInferior >
            primeraColumnaCuadrosSemicorchea.length - 1
        )
          ? indiceYElementUnderCursor
          : notaAsociada.indiceTablaY;

        optionalElementsUnderCursor =
          Todos_los_cuadros_semicorchea[
            indiceYOptionalElementsUnderCursor *
              primeraFilaCuadrosSemicorchea.length +
              indiceXOptionalElementsUnderCursor
          ];
        elementUnderCursorGrilla = optionalElementsUnderCursor;
      }
    }

    //Obligando a obedecer la grilla formada por los elementos 'Cuadro-Semicorchea'
    if (elementUnderCursorGrilla) {
      divArrastrado.style.left =
        pixelsToVWVH(
          distanciaRelativaEntreElementos(PIANO_ROLL, elementUnderCursorGrilla)
            .distanciaHorizontalPX,
          "vw"
        )[0] + "vw";
      divArrastrado.style.top =
        pixelsToVWVH(
          distanciaRelativaEntreElementos(PIANO_ROLL, elementUnderCursorGrilla)
            .distanciaVerticalPX,
          "vw"
        )[0] + "vw";
      ultimoCuadroSemicorchea = elementUnderCursorGrilla;
    } else {
      // En caso no este definido elementUnderCursorGrilla
      divArrastrado.style.left =
        pixelsToVWVH(
          distanciaRelativaEntreElementos(PIANO_ROLL, ultimoCuadroSemicorchea)
            .distanciaHorizontalPX,
          "vw"
        )[0] + "vw";
      divArrastrado.style.top =
        pixelsToVWVH(
          distanciaRelativaEntreElementos(PIANO_ROLL, ultimoCuadroSemicorchea)
            .distanciaVerticalPX,
          "vw"
        )[0] + "vw";
    }

    // Obteniendo los indices
    notaAsociada.actualizarIndices();

    if (movimientoMultiple) {
      let diferenciaX =
        notaAsociada.indiceTablaX - indiceOrigenMovimientoMultipleX;
      let diferenciaY =
        notaAsociada.indiceTablaY - indiceOrigenMovimientoMultipleY;

      NOTAS_SECUENCIADOR_DE_MELODIAS_SELECCIONADAS.forEach(
        (notaSecuenciadorDeMelodiasSeleccionada, index) => {
          if (notaSecuenciadorDeMelodiasSeleccionada === notaAsociada) return;
          notaSecuenciadorDeMelodiasSeleccionada.moveTo(
            indicesNotasSeleccionadas[index].indiceTablaX + diferenciaX,
            indicesNotasSeleccionadas[index].indiceTablaY + diferenciaY
          );
        }
      );
    }
  }
}

function actualizarCuadrosSemicorcheaYacomodarNotas() {
  //Transformando la lista de nodos en un Array para poder usar todos los
  // metodos del prototipo array como slice
  Todos_los_cuadros_semicorchea = [
    ...document.querySelectorAll(".Cuadro-Semicorchea"),
  ];
  //Obteniendo la primera fila y la primera columna de la tabla PIANO_ROLL
  primeraFilaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.slice(
    0,
    16 * CANTIDAD_DE_COMPASES
  );
  primeraColumnaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.filter(
    (elemento, indice) => indice % (16 * CANTIDAD_DE_COMPASES) == 0
  );

  todosLosOffsetLeft = primeraFilaCuadrosSemicorchea.map(
    (cuadroSemicorchea) => cuadroSemicorchea.offsetLeft
  );
  todosLosOffsetTop = primeraColumnaCuadrosSemicorchea.map(
    (cuadroSemicorchea) => cuadroSemicorchea.offsetTop
  );
  todasLasPosicionesRelativasAlMarco = primeraFilaCuadrosSemicorchea.map(
    (cuadroSemicorchea) => {
      return (
        cuadroSemicorchea.getBoundingClientRect().left -
        CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect().left +
        CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft
      );
    }
  );
  todasLasPosicionesRelativasAlMarco.push(
    primeraFilaCuadrosSemicorchea[
      primeraFilaCuadrosSemicorchea.length - 1
    ].getBoundingClientRect().right -
      CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect().left +
      CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft
  );
  todasLasPosicionesRelativasAlMarco.push(Infinity);
  NotaSecuenciadorDeMelodias.acomodarTodasLasNotas();
}

// INICIALIZANDO LOS ARRAYS
actualizarCuadrosSemicorcheaYacomodarNotas();

window.addEventListener("resize", actualizarCuadrosSemicorcheaYacomodarNotas);

let obtenerElMayorIndiceXFinal = () => {
  if (NOTAS_SECUENCIADOR_DE_MELODIAS.length == 0) {
    return 32;
  }

  let notaConMayorIndiceXFinal = NOTAS_SECUENCIADOR_DE_MELODIAS.reduce(
    (maxNota, nextNota) => {
      if (
        nextNota.indiceTablaX + nextNota.longitudSemicorcheas >=
        maxNota.indiceTablaX + maxNota.longitudSemicorcheas
      ) {
        return nextNota;
      } else {
        return maxNota;
      }
    }
  );

  return (
    notaConMayorIndiceXFinal.indiceTablaX +
    notaConMayorIndiceXFinal.longitudSemicorcheas
  );
};

let devolverCompassEnElQueSeEncuentraElMaximoIndiceXFinal = () => {
  if (NOTAS_SECUENCIADOR_DE_MELODIAS.length == 0) {
    return 32;
  }

  let mayorIndiceXFinalDeLaMelodiaActual = obtenerElMayorIndiceXFinal();

  return mayorIndiceXFinalDeLaMelodiaActual / 16 >
    Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16)
    ? Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16) + 1
    : mayorIndiceXFinalDeLaMelodiaActual / 16;
};

let devolverCantidadDeCompassesMinimaActual = () => {
  if (NOTAS_SECUENCIADOR_DE_MELODIAS.length == 0) return 2;

  let mayorIndiceXFinalDeLaMelodiaActual = obtenerElMayorIndiceXFinal();

  let minimaCantidadDeCompasses =
    mayorIndiceXFinalDeLaMelodiaActual / 16 >
    Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16)
      ? Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16) % 2 == 0
        ? Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16) + 2
        : Math.floor(mayorIndiceXFinalDeLaMelodiaActual / 16) + 1
      : mayorIndiceXFinalDeLaMelodiaActual / 16;
  return minimaCantidadDeCompasses;
};

let establecerElMinimoCompases = () => {
  CANTIDAD_COMPASES_HTML.min = devolverCantidadDeCompassesMinimaActual();
};

let establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas = () => {
  establecerElMinimoCompases();

  if (CANTIDAD_COMPASES_HTML.value == CANTIDAD_DE_COMPASES) return;

  let todasLasFilasDeNotas = document.querySelectorAll(
    ".fila-nota-secuenciador-de-melodias"
  );

  // OBTENIENDO LA CANTIDAD DE SEMICORCHEAS DE UNA DE LAS FILAS
  let longitudActualDeCadaFilaSemicorcheas =
    todasLasFilasDeNotas[0].childElementCount;
  let longitudNuevaEnSemicorcheasDeCadaFila = CANTIDAD_COMPASES_HTML.value * 16;
  CANTIDAD_DE_COMPASES = CANTIDAD_COMPASES_HTML.value;

  CABECERA_DE_COMPASES.style.width = `${32 * CANTIDAD_DE_COMPASES}vw`;
  PIANO_ROLL.style.minWidth = `${32 * CANTIDAD_DE_COMPASES}vw`;
  CONTENEDOR_PIANO_ROLL.style.minWidth = `${32 * CANTIDAD_DE_COMPASES + 6}vw`;

  // AGREGANDO LAS CABECERAS
  if (
    longitudActualDeCadaFilaSemicorcheas < longitudNuevaEnSemicorcheasDeCadaFila
  ) {
    for (
      let i = longitudActualDeCadaFilaSemicorcheas;
      i <= longitudNuevaEnSemicorcheasDeCadaFila;
      i++
    ) {
      if ((i - 1) % 16 == 0) {
        let nuevaCabeceraCompas = document.createElement("td");
        nuevaCabeceraCompas.classList.add("numeros_compas_cabecera");
        nuevaCabeceraCompas.innerText = (i - 1) / 16 + 1;
        CABECERA_DE_COMPASES.appendChild(nuevaCabeceraCompas);
      }
    }
  } else if (
    longitudActualDeCadaFilaSemicorcheas > longitudNuevaEnSemicorcheasDeCadaFila
  ) {
    for (
      let i = longitudActualDeCadaFilaSemicorcheas;
      i >= longitudNuevaEnSemicorcheasDeCadaFila;
      i--
    ) {
      if ((i + 1) % 16 == 0) {
        let ultimaCabeceraCompas = CABECERA_DE_COMPASES.lastChild;
        CABECERA_DE_COMPASES.removeChild(ultimaCabeceraCompas);
      }
    }
  }

  // AGREGANDO LOS CUADROS SEMICORCHEA PARA CADA FILA
  todasLasFilasDeNotas.forEach((filaNotaSecuenciador) => {
    if (
      longitudActualDeCadaFilaSemicorcheas <
      longitudNuevaEnSemicorcheasDeCadaFila
    ) {
      for (
        let i = longitudActualDeCadaFilaSemicorcheas;
        i < longitudNuevaEnSemicorcheasDeCadaFila;
        i++
      ) {
        let nuevoTD = document.createElement("td");
        nuevoTD.classList.add("Cuadro-Semicorchea");
        filaNotaSecuenciador.appendChild(nuevoTD);
      }
    } else if (
      longitudActualDeCadaFilaSemicorcheas >
      longitudNuevaEnSemicorcheasDeCadaFila
    ) {
      for (
        let i = longitudActualDeCadaFilaSemicorcheas;
        i > longitudNuevaEnSemicorcheasDeCadaFila;
        i--
      ) {
        let ultimoTD = filaNotaSecuenciador.lastChild;
        filaNotaSecuenciador.removeChild(ultimoTD);
      }
    }
  });

  actualizarCuadrosSemicorcheaYacomodarNotas();
};

CANTIDAD_COMPASES_HTML.addEventListener(
  "change",
  establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas
);
CANTIDAD_COMPASES_HTML.addEventListener(
  "mouseover",
  establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas
);
CANTIDAD_COMPASES_HTML.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY > 0) {
    CANTIDAD_COMPASES_HTML.stepDown();
  } else {
    CANTIDAD_COMPASES_HTML.stepUp();
  }
  establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas();
});

CANTIDAD_COMPASES_HTML.addEventListener("mousedown", (e) => {
  if (e.button == 1) {
    CANTIDAD_COMPASES_HTML.value = CANTIDAD_COMPASES_HTML.min;
    establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas();
  }
});

// ---------------------------------------------------------------
// |                 REPRODUCCIÓN DE MELODIAS                    |
// ---------------------------------------------------------------

const BTN_PLAY_PAUSA = document.getElementById("boton-play-pausa");
const TRIANGULO_PLAY = document.getElementById("triangulo-play");
const RECTANGULOS_PAUSA = document.querySelectorAll(".rectangulo-pausa");
const BTN_STOP = document.getElementById("boton-stop");
const TRANSPORT_BAR = document.getElementById("Transport-Bar");
let estiloParaEliminarBordeDelTransportBar;

let ultimoIndiceX;
let animacionActual;
let lastAnimationTime = 0;
let ultimoRequestAnimate;
let seEstaReproduciendo = false;
let estaPausado = true;
let ultimaPosicionXRelativaTransportBar = 0;
let tempoDeLaAnimacion;
let TimeOutParaEmpezarAReproducirMelodiaDeNuevo;

function reproducirNotas() {
  const contenedorRect =
    CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect();
  const transportBarRect = TRANSPORT_BAR.getBoundingClientRect();

  // Calcula la posición X relativa al contenedor incluyendo el scroll realizado
  const posicionXRelativa =
    transportBarRect.left -
    contenedorRect.left +
    CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft;
  ultimaPosicionXRelativaTransportBar = posicionXRelativa;
  let indiceCuadroSemicorchea;
  for (let i = 0; i < todasLasPosicionesRelativasAlMarco.length - 2; i++) {
    if (
      posicionXRelativa > todasLasPosicionesRelativasAlMarco[i] &&
      posicionXRelativa <= todasLasPosicionesRelativasAlMarco[i + 1]
    ) {
      indiceCuadroSemicorchea = i;
      break;
    }
  }

  if (!estiloParaEliminarBordeDelTransportBar) {
    if (
      posicionXRelativa >=
      todasLasPosicionesRelativasAlMarco[
        devolverCantidadDeCompassesMinimaActual() * 16 - 1
      ]
    ) {
      if (!TimeOutParaEmpezarAReproducirMelodiaDeNuevo) {
        TimeOutParaEmpezarAReproducirMelodiaDeNuevo = setTimeout(() => {
          ultimoIndiceX = 0;
          if (estaPausado) return;
          // Si esta pausado no tiene porque reproducirse la melodia
          animacionActual = reproducirMelodiaAnimacion();
          actualizarDurationSemicorcheas();
          TimeOutParaEmpezarAReproducirMelodiaDeNuevo = undefined;
        }, duracionSemicorcheas * 1000);
      }

      if (
        posicionXRelativa >=
        todasLasPosicionesRelativasAlMarco[
          todasLasPosicionesRelativasAlMarco.length - 2
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
    if (ultimoIndiceX == 0) {
      eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
    }
  }

  if (ultimoIndiceX != indiceCuadroSemicorchea) {
    NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorDeMelodias) => {
      if (notaSecuenciadorDeMelodias.indiceTablaX == indiceCuadroSemicorchea) {
        // AQUI ESTA LA CLAVE PARA HACER QUE SE REPRODUZCAN LAS NOTAS CON LONGITUD VARIABLE EN TIEMPO REAL
        notaSecuenciadorDeMelodias.notaSintetizador.hacerSonarNota(
          notaSecuenciadorDeMelodias.longitudSemicorcheas * duracionSemicorcheas
        );
      }
    });
    ultimoIndiceX = indiceCuadroSemicorchea;
  }

  ultimoRequestAnimate = requestAnimationFrame(reproducirNotas);
}

//Esta funcion es para evitar que siga sonando la melodia al momento de pausar o parar la animacion
let desconectarYcrearNuevaSalidaDeAudio = () => {
  nodoSalidaSintetizador.disconnect();
  nodoSalidaSintetizador = undefined;
  nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
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

let cambiarBotonAPlayOPausa = () => {
  TRIANGULO_PLAY.classList.toggle("no-desplegado");
  RECTANGULOS_PAUSA.forEach((rectanguloPausa) => {
    rectanguloPausa.classList.toggle("no-desplegado");
  });
  BTN_PLAY_PAUSA.classList.toggle("boton-reproduccion-pulsado");
};

function reproducirMelodiaAnimacion() {
  let indiceInicialDeLaAnimacion =
    ultimoIndiceX && ultimoIndiceX != 0 ? ultimoIndiceX + 1 : 0;

  let posicionDeInicio =
    todasLasPosicionesRelativasAlMarco[indiceInicialDeLaAnimacion] -
    todasLasPosicionesRelativasAlMarco[0];

  return TRANSPORT_BAR.animate(
    [
      { transform: `translateX(${pixelsToVWVH(posicionDeInicio, "vw")}vw)` },
      {
        transform: `translateX(${
          pixelsToVWVH(PIANO_ROLL.clientWidth, "vw") - 0.1
        }vw)`,
      },
    ],
    {
      iterations: 1,
      easing: "linear",
      fill: "forwards",
      duration:
        duracionSemicorcheaINICIAL *
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

function pausarMelodia(moviendoTransportBar = false) {
  if (seEstaReproduciendo) {
    if (animacionActual) {
      animacionActual.pause();
      desconectarYcrearNuevaSalidaDeAudio();
    }

    if (ultimoRequestAnimate) {
      cancelAnimationFrame(ultimoRequestAnimate);
    }

    if (!moviendoTransportBar) {
      cambiarBotonAPlayOPausa();
    }

    seEstaReproduciendo = false;
    estaPausado = true;
    NotaSintetizador.quitarTodasLasPulsaciones();
    NotaSintetizador.pausarTodasLasNotasQueEstanSonandoConTecla();
  }
}

/**
 *
 * @returns devuelve true si cuando se paro no estaba pausado, y false si esta pausado.
 */
function pararMelodia() {
  if (seEstaReproduciendo || estaPausado) {
    if (ultimoRequestAnimate) {
      cancelAnimationFrame(ultimoRequestAnimate);
    }

    if (animacionActual) {
      animacionActual.cancel();
      animacionActual = undefined;
    }

    ultimoIndiceX = 0;
    volverTransportBarAPosicion(0);
    desconectarYcrearNuevaSalidaDeAudio();

    seEstaReproduciendo = false;
    NotaSintetizador.quitarTodasLasPulsaciones();

    if (!estaPausado) {
      cambiarBotonAPlayOPausa();
      return true;
    } else {
      return false;
    }
  }
}

function reproducirMelodia() {
  seEstaReproduciendo = true;
  animacionActual = reproducirMelodiaAnimacion();
  reproducirNotas();
  actualizarDurationSemicorcheas();
  estaPausado = false;
  cambiarBotonAPlayOPausa();
}

delegarEvento("click", "#boton-play-pausa, #boton-play-pausa *", () => {
  if (!seEstaReproduciendo) {
    reproducirMelodia();
  } else {
    // PAUSAR
    pausarMelodia();
  }
  eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
});

delegarEvento("click", "#boton-stop, #boton-stop *", () => {
  eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
  pararMelodia();
});

function arrastrarTransportBar(eventoMouseDown) {
  if (eventoMouseDown.target == TRANSPORT_BAR) {
    if (!(eventoMouseDown.offsetY <= VWVHTopixels("vh", 3.3)[0])) {
      return false;
    }
  }

  let cambioDeCursor = cambiarCursorParaTodaLaPagina("grabbing");

  let stopExitosamente;

  let empezarArrastrarTransportBar = (e) => {
    if (!stopExitosamente) stopExitosamente = pararMelodia();

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
    if (stopExitosamente) reproducirMelodia();
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

// EVENTO DE CURSOR GRAB SOLO EN TRIANGULO DEL TRANSPORT BAR
delegarEvento("mousemove", TRANSPORT_BAR, (e) => {
  if (e.offsetY <= VWVHTopixels("vh", 3.3)[0]) {
    TRANSPORT_BAR.style.cursor = "grab";
  } else {
    TRANSPORT_BAR.style.cursor = "initial";
  }
});

function actualizarDurationSemicorcheas() {
  // if(seEstaReproduciendo)
  if (animacionActual) {
    animacionActual.playbackRate = TEMPO.value / TEMPO_AL_CARGAR_LA_PAGINA;
  }

  duracionSemicorcheas = 60 / (TEMPO.value * 4);
}

delegarEvento("mousemove", TEMPO, actualizarDurationSemicorcheas);
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

let i = new NotaSecuenciadorDeMelodias(undefined, {
  indiceTablaX: 5,
  indiceTablaY: 1,
  longitudSemicorcheas: 7,
});

setTimeout(() => {
  i.remove();
}, 3000);
