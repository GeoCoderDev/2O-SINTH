/**
 *
 * @param {HTMLElement} HTMLelement
 * @param {Number} duracionSegundos
 * @param {Boolean} horizontalmente
 * @param {Number} opacityOriginal
 * @param {String} easing
 * @param {Boolean} permanent
 * @param {HTMLElement} padreHTML
 * @returns
 */
function desvanecerElemento(
  HTMLelement,
  duracionSegundos,
  horizontalmente = false,
  opacityOriginal = 1,
  easing = "ease-in",
  permanent = true,
  padreHTML = HTMLelement.parentNode
) {
  let displayOriginal = window.getComputedStyle(HTMLelement).display;

  if (horizontalmente) {
    let anchoOriginal = HTMLelement.offsetWidth;
    let anchoOriginalEnPorcentaje = roundToDecimals(
      (anchoOriginal / padreHTML.clientWidth) * 100,
      2
    );

    const FADE_HORIZONTAL = HTMLelement.animate(
      [
        { opacity: opacityOriginal }, //0%
        { opacity: 0, width: `${anchoOriginalEnPorcentaje}%`, margin: 0 }, //25%
        {}, //55%
        {}, //75%
        {
          opacity: 0,
          width: 0,
          margin: `0 -${anchoOriginalEnPorcentaje / 2}%`,
          display: "none",
        }, //100%
      ],
      {
        iterations: 1,
        duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
        easing: easing,
        fill: permanent ? "forwards" : "none",
      }
    );

    return {
      anchoOriginalEnPorcentaje: anchoOriginalEnPorcentaje,
      animacionFinalizada: FADE_HORIZONTAL.finished,
      displayOriginal: displayOriginal,
    };
  } else {
    let altoOriginal = HTMLelement.offsetHeight;
    let altoOriginalEnPorcentaje =
      (altoOriginal / padreHTML.clientHeight) * 100;

    const FADE_VERTICAL = HTMLelement.animate(
      [
        { opacity: opacityOriginal }, //0%
        { opacity: 0, height: `${altoOriginalEnPorcentaje}%`, margin: 0 }, //25%
        {}, //50%
        {}, //75%
        {
          opacity: 0,
          height: 0,
          margin: `-${altoOriginalEnPorcentaje / 2}% 0`,
          display: "none",
        }, //100%
      ],
      {
        iterations: 1,
        duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
        easing: easing,
        fill: permanent ? "forwards" : "none",
      }
    );

    return {
      altoOriginalEnPorcentaje: altoOriginalEnPorcentaje,
      animacionFinalizada: FADE_VERTICAL.finished,
      displayOriginal: displayOriginal,
    };
  }
}

/**
 *
 * @param {HTMLElement} HTMLelement
 * @param {Number} duracionSegundos
 * @param {String} dimensionOriginalCSS
 * @param {String} displayOriginal
 * @param {Boolean} [horizontalmente]
 * @param {String} [margenOriginal]
 * @param {String} [opacityOriginal]
 * @param {Boolean} [permanent]
 * @returns
 */

function aparecerElemento(
  HTMLelement,
  duracionSegundos,
  dimensionOriginalCSS,
  displayOriginal,
  horizontalmente = false,
  margenOriginal = 0,
  opacityOriginal = 1,
  easing = "ease-in",
  permanent = true
) {
  let cantidad = parseFloat(dimensionOriginalCSS);
  const unidad = dimensionOriginalCSS.match(/[a-zA-Z%]+/)[0];

  if (horizontalmente) {
    const APPEAR_HORIZONTAL = HTMLelement.animate(
      [
        {
          opacity: 0,
          width: 0,
          margin: `0 -${cantidad / 2}${unidad}`,
          display: displayOriginal,
        }, //0%
        {}, //25%
        {}, //50%
        {
          opacity: 0,
          width: `${dimensionOriginalCSS}`,
          margin: margenOriginal,
          display: displayOriginal,
        }, //75%
        {
          opacity: opacityOriginal,
          width: `${dimensionOriginalCSS}`,
          margin: margenOriginal,
          display: displayOriginal,
        }, //100%
      ],
      {
        iterations: 1,
        duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
        easing: easing,
        fill: permanent ? "forwards" : "none",
      }
    );

    return { animacionFinalizada: APPEAR_HORIZONTAL.finished };
  } else {
    const APPEAR_VERTICAL = HTMLelement.animate(
      [
        {
          opacity: 0,
          height: 0,
          position: "static",
          visibility: "visible",
          top: "auto",
          left: "auto",
          margin: `-${cantidad / 2}${unidad} 0`,
        }, //0%
        {}, //25%
        {}, //50%
        {
          opacity: 0,
          height: `${dimensionOriginalCSS}`,
          margin: margenOriginal,
          display: displayOriginal,
        }, //75%
        {
          opacity: opacityOriginal,
          height: `${dimensionOriginalCSS}`,
          margin: margenOriginal,
          display: displayOriginal,
        }, //100%
      ],
      {
        iterations: 1,
        duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
        easing: easing,
        fill: permanent ? "forwards" : "none",
      }
    );

    return { animacionFinalizada: APPEAR_VERTICAL.finished };
  }
}

/**
 *
 * @param {HTMLElement} HTMLelement
 * @param {Number} duracionSegundos
 * @param {Boolean} permanent
 * @returns
 */
function desvanecerElementoConScale(
  HTMLelement,
  duracionSegundos,
  permanent = true
) {
  const displayOriginal = window.getComputedStyle(HTMLelement).display;

  const FADE_SCALE = HTMLelement.animate(
    [
      { scale: 1 }, //0%
      { scale: 0, display: "none" }, //100%
    ],
    {
      iterations: 1,
      duration: duracionSegundos * 1000,
      easing: "ease-in",
      fill: permanent ? "forwards" : "none",
    }
  );

  return { animation: FADE_SCALE, displayOriginal: displayOriginal };
}

/**
 *
 * @param {HTMLElement} HTMLelement
 * @param {Number} duracionSegundos
 * @param {String} displayOriginal
 * @param {Boolean} permanent
 * @returns
 */

/**
 *
 * @param {HTMLElement} HTMLelement
 * @param {Number} duracionSegundos
 * @param {String} displayOriginal
 * @param {String} easing
 * @param {Boolean} permanent
 * @returns {Animation}
 */
function aparecerElementoConScale(
  HTMLelement,
  duracionSegundos,
  displayOriginal,
  easing = "linear",
  permanent = true
) {
  const APPEAR_SCALE = HTMLelement.animate(
    [
      { scale: 0, display: displayOriginal }, //0%
      { scale: 1, display: displayOriginal },
    ],
    {
      iterations: 1,
      duration: duracionSegundos * 1000,
      easing: easing,
      fill: permanent ? "forwards" : "none",
    }
  );

  return APPEAR_SCALE;
}

/**
 *
 * @param {HTMLElement} elementoHTML
 * @param {Number} secondsDuration
 * @param {String} easing
 */
function eliminacionRapidaAlEstiloFLStudio(
  elementoHTML,
  secondsDuration,
  easing = "linear"
) {
  return elementoHTML.animate(
    [
      {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderWidth: "0.2vw",
      },
      {
        backgroundColor: "transparent",
        transform: "scale(1.05)",
        boxShadow: "none",
        borderWidth: "0.2vw",
      },
    ],
    {
      duration: secondsDuration * 1000,
      easing: easing,
      fill: "forwards",
      iterations: 1,
    }
  ).finished;
}


class AnimacionAparicionYDesaparicion {
  #promiseFinishedResolve;

  /**
   *
   * @param {HTMLElement} elementoHTML
   * @param {number} durationSegundos
   * @param {string} dimensionOriginal
   * @param {string[]} clasesARespetar
   * @param {boolean} horizontalmente
   * @param {Promise | undefined} promesaParaDesaparecer
   */
  constructor(
    elementoHTML,
    durationSegundos,
    dimensionOriginal,
    clasesARespetar = [],
    horizontalmente = true,
    promesaParaDesaparecer
  ) {
    this.elementoHTML = elementoHTML;

    let clasesAEliminar = [];

    this.elementoHTML.classList.forEach((clase) => {
      if (clasesARespetar.indexOf(clase) === -1) clasesAEliminar.push(clase);
    });

    clasesAEliminar.forEach((clase) =>
      this.elementoHTML.classList.remove(clase)
    );

    this.elementoHTML.style[`${horizontalmente ? "width" : "height"}`] =
      dimensionOriginal;
    this.dimensionOriginal = dimensionOriginal;
    this.Nombre_Clase_Animacion =
      this.elementoHTML.tagName[0] + "-" + generarIdUnico(3);
    this.estilosCssAdicionales;

    let hijosContenedor = [...this.elementoHTML.parentElement.children];

    let anchoTotalDeLosOtrosElementos = hijosContenedor.reduce(
      (acumulator, currentChildren) => {
        if (currentChildren === this.elementoHTML) return acumulator;
        return (
          acumulator +
          parseFloat(
            getComputedStyle(currentChildren)[
              `${horizontalmente ? "width" : "height"}`
            ]
          )
        );
      },
      0
    );

    let espacioEntreElementos =
      (parseFloat(
        getComputedStyle(this.elementoHTML.parentElement)[
          `${horizontalmente ? "width" : "height"}`
        ]
      ) -
        anchoTotalDeLosOtrosElementos) /
      this.elementoHTML.parentElement.children.length;

    let espacioEntreElementosConElementoAdicional =
      (parseFloat(
        getComputedStyle(this.elementoHTML.parentElement)[
          `${horizontalmente ? "width" : "height"}`
        ]
      ) -
        anchoTotalDeLosOtrosElementos) /
      (this.elementoHTML.parentElement.children.length + 1);

    this.estilosCssAdicionales = insertarReglasCSSAdicionales(`
          
        @keyframes A-${this.Nombre_Clase_Animacion}{
            0%{
                position: relative;
  
                  ${
                    horizontalmente
                      ? `                     
                        margin: 0 -${
                          (espacioEntreElementos -
                            espacioEntreElementosConElementoAdicional) *
                          ((hijosContenedor.length + 1) / 2)
                        }px;
                        width: 0;                     
                      `
                      : `                        
                      margin: -${
                        (espacioEntreElementos -
                          espacioEntreElementosConElementoAdicional) *
                        ((hijosContenedor.length + 1) / 2)
                      }px 0;
                        height: 0;                           
                    `
                  }
  
              }
              75% {          
                position: relative;
                opacity: 0;
                top: 0;
                margin: 0 0;
                ${horizontalmente ? "width" : "height"}: ${dimensionOriginal};
              }
              95% {
                position: relative;
                opacity: 1;
                top: 0;                    
                margin: 0 0;
                ${horizontalmente ? "width" : "height"}: ${dimensionOriginal};
              }  
              100%{                
                position: relative;
                opacity: 1;
                top: 0;                    
                margin: 0 0;
                ${
                  horizontalmente ? "width" : "height"
                }: ${dimensionOriginal};                    
              }
        }
  
        .${this.Nombre_Clase_Animacion}{
            position: absolute;
            top: -100%;
            animation: A-${
              this.Nombre_Clase_Animacion
            } ${durationSegundos}s linear;
            animation-iteration-count: 2;
            animation-direction: alternate;
            opacity: 0;
            display:block;
        }  
      `);

    this.finished = new Promise((resolve, reject) => {
      this.#promiseFinishedResolve = resolve;
    });

    this.elementoHTML.addEventListener("animationiteration", () => {
      this.pausar();
    });

    this.elementoHTML.addEventListener(
      "animationend",
      this.finalizar.bind(this)
    );

    if (promesaParaDesaparecer) {
      promesaParaDesaparecer.then(() => {
        this.iniciar();
      });
    }
  }

  iniciar() {
    if (!this.elementoHTML.classList.contains(this.Nombre_Clase_Animacion)) {
      this.elementoHTML.classList.add(this.Nombre_Clase_Animacion);
      return false;
    }

    this.elementoHTML.style.animationPlayState = "running";
  }

  pausar() {
    this.elementoHTML.style.animationPlayState = "paused";
  }

  finalizar(Resolver = true) {
    if (!this.elementoHTML.classList.contains(this.Nombre_Clase_Animacion))
      return false;

    this.elementoHTML.classList.remove(this.Nombre_Clase_Animacion);
    if (this.estilosCssAdicionales)
      eliminarReglasCSSAdicionales(this.estilosCssAdicionales);
    this.estilosCssAdicionales = undefined;

    if (Resolver) this.#promiseFinishedResolve();
  }
}
