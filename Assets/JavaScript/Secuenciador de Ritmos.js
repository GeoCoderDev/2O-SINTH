const SECUENCIADOR_DE_RITMOS_HTML = document.getElementById(
  "Secuenciador-Ritmos"
);

/**
 * Reproduce el sonido de un tambor.
 * @param {keyof typeof DRUMS_RUTAS} drumName - El nombre del Drum a reproducir.
 */
function reproducirDrum(drumName) {
  if (!DRUMS_DATA_DISPONIBLE) return console.error(`Los audios aun no cargan`);
  if (AUDIO_BUFFER_DRUMS.hasOwnProperty(drumName)) {
    const audioBufferSourceNode = ENTORNO_AUDIO_DRUMS.createBufferSource();
    audioBufferSourceNode.buffer = AUDIO_BUFFER_DRUMS[drumName];
    audioBufferSourceNode.connect(ENTORNO_AUDIO_DRUMS.destination);
    audioBufferSourceNode.start();

    document.querySelectorAll(".Percusion-Ritmo").forEach((percusionRitmo) => {
      if (percusionRitmo.dataset.drumname !== drumName) return;
      percusionRitmo.animate(
        [
          {
            boxShadow: "0 0 0.7vw 1vw inset rgba(0, 0, 0, 0.6)",
            fontSize: "1.4vh",
          },
          {
            boxShadow: "0 0 0.7vw 0.5vw inset rgba(0, 0, 0, 0.6)",
            fontSize: "1.65vh",
          },
        ],
        { iterations: 1, duration: 200, easing: "ease" }
      );
    });

    audioBufferSourceNode.addEventListener("ended", (e) => {
      audioBufferSourceNode.disconnect();
      audioBufferSourceNode.stop();
    });
  } else {
    console.error(`Nombre de tambor no válido: ${drumName}`);
  }
}

const CLASE_PERCUSION_CONTEXT_MENU = "Percusion-Context-Menu";
const CLASE_OPCION_PERCUSION_CONTEXT_MENU = "Percusion-Context-Menu-Option";
insertarReglasCSSAdicionales(`


  .${CLASE_OPCION_PERCUSION_CONTEXT_MENU}:hover{
    color: #ccc;
  }

`);

class PercusionContextMenu {
  /**
   *
   * @param {MouseEvent} e
   * @param {string} ancho
   * @param {string} alto
   * @param {string[]} opcionesContextuales
   * @param {Function[]} callback
   */
  constructor(e, ancho, alto, opcionesContextuales, callbacks) {
    let menuContextual = document.createElement("div");
    menuContextual.style.position = "absolute";
    menuContextual.style.width = ancho;
    // menuContextual.style.height = alto;
    menuContextual.style.opacity = 0.8;
    menuContextual.style.backgroundColor = `black`;
    menuContextual.style.left =
      pixelsToVWVH(getComputedStyle(e.target).width, "vw")[0] + "vw";
    menuContextual.style.top = 0;
    menuContextual.style.display = "flex";
    menuContextual.style.flexDirection = "column";
    menuContextual.style.alignItems = "streth";
    menuContextual.style.justifyContent = "space-evenly";
    menuContextual.style.paddingLeft = "0.5vw";
    menuContextual.style.zIndex = 50;
    menuContextual.style.borderRadius = "1vw";
    menuContextual.classList.add(CLASE_PERCUSION_CONTEXT_MENU);

    opcionesContextuales.forEach((opcionContextual, index) => {
      let opcionContextualHTML = document.createElement("div");
      opcionContextualHTML.innerText = opcionContextual;
      opcionContextualHTML.style.fontFamily = "arial";
      opcionContextualHTML.style.fontSize = "0.6vw";
      opcionContextualHTML.style.display = "flex";
      opcionContextualHTML.style.alignItems = "center";
      opcionContextualHTML.style.justifyContent = "start"
      opcionContextualHTML.style.height = parseFloat(alto)/opcionesContextuales.length + "vw";
      opcionContextualHTML.style.cursor = "pointer";
      
      opcionContextualHTML.classList.add(CLASE_OPCION_PERCUSION_CONTEXT_MENU);

      delegarEvento("click", opcionContextualHTML, () => {
        callbacks[index]();
        menuContextual.remove();
      });

      menuContextual.appendChild(opcionContextualHTML);

    });        

    e.target.appendChild(menuContextual);

    /**
     *
     * @param {MouseEvent} e
     * @returns
     */
    function funcionDeEliminacionDePercusionContextMenu(e) {
      if (
        e.target.matches(
          `.${CLASE_PERCUSION_CONTEXT_MENU}, .${CLASE_PERCUSION_CONTEXT_MENU} *`
        )
      )
        return;
      menuContextual.remove();
      document.removeEventListener(
        "mousedown",
        funcionDeEliminacionDePercusionContextMenu
      );
    }

    document.addEventListener(
      "mousedown",
      funcionDeEliminacionDePercusionContextMenu
    );


  }
}

let Todos_los_cuadros_semicorchea_ritmos =
  document.querySelectorAll(".Semicorchea-Ritmo");

/**
 *
 * @param {MouseEvent} e
 * @param {number} step
 */
let marcarPorStepEnFilaDeUnDrum = (e, step) => {
  let numeroColumna = Object.keys(DRUMS_RUTAS).indexOf(
    e.target.dataset.drumname
  );

  Array.from(Todos_los_cuadros_semicorchea_ritmos).forEach(
    (cuadroSemicorcheaRitmo, index) => {
      if (
        index >= numeroColumna * CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS * 16 &&
        index <
          (numeroColumna + 1) * CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS * 16
      )
        return cuadroSemicorcheaRitmo.classList.remove(
          "Semicorchea-Ritmo-Activa"
        );
    }
  );

  if(step==0) return;

  for (
    let i = 0;
    i < Math.floor((CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS * 16) / step);
    i++
  ) {
    Todos_los_cuadros_semicorchea_ritmos[
      numeroColumna * CANTIDAD_COMPASSES_SECUENCIADOR_RITMOS * 16 + step * i
    ].classList.add("Semicorchea-Ritmo-Activa");
  }
};

delegarEvento("mousedown", ".Percusion-Ritmo", (e) => {
  if (e.button == 0) {
    e.target.animate(
      [
        {
          boxShadow: "0 0 0.7vw 1vw inset rgba(0, 0, 0, 0.6)",
          fontSize: "1.4vh",
        },
        {
          boxShadow: "0 0 0.7vw 0.5vw inset rgba(0, 0, 0, 0.6)",
          fontSize: "1.65vh",
        },
      ],
      { iterations: 1, duration: 200, easing: "ease" }
    );

    reproducirDrum(e.target.dataset.drumname);
  } else if (e.button == 2) {
    new PercusionContextMenu(
      e,
      "6.8vw",
      "7.5vw",
      ["Marcar de 2 en 2", "Marcar de 4 en 4", "Marcar de 8 en 8", "Borrar"],
      [
        () => marcarPorStepEnFilaDeUnDrum(e, 2),
        () => marcarPorStepEnFilaDeUnDrum(e, 4),
        () => marcarPorStepEnFilaDeUnDrum(e, 8),
        ()=>{marcarPorStepEnFilaDeUnDrum(e, 0)}
      ]
    );
  }
});

delegarEvento("mousedown", ".Semicorchea-Ritmo", (e) => {
  if (e.button === 0) {
    e.target.classList.add("Semicorchea-Ritmo-Activa");
  } else {
    // El botón derecho del ratón tiene el valor 2
    e.target.classList.remove("Semicorchea-Ritmo-Activa");
  }
});

/**
 *
 * @param {MouseEvent} e
 */
const eventoMouseMoveAñadir = (e) => {
  if (e.target.classList.contains("Semicorchea-Ritmo")) {
    e.target.classList.add("Semicorchea-Ritmo-Activa");
  }
};

/**
 *
 * @param {MouseEvent} e
 */
const eventoMouseMoveEliminacion = (e) => {
  if (e.target.classList.contains("Semicorchea-Ritmo")) {
    e.target.classList.remove("Semicorchea-Ritmo-Activa");
  }
};

let eventoDelegadoAñadirID;
let eventoDelegadoEliminacionID;

SECUENCIADOR_DE_RITMOS_HTML.addEventListener("mousedown", (e) => {
  if (e.button == 0) {
    SECUENCIADOR_DE_RITMOS_HTML.addEventListener(
      "mousemove",
      eventoMouseMoveAñadir
    );

    function eventoMouseUp() {
      SECUENCIADOR_DE_RITMOS_HTML.removeEventListener(
        "mousemove",
        eventoMouseMoveAñadir
      );
      document.removeEventListener("mouseup", eventoMouseUp);
    }
    document.addEventListener("mouseup", eventoMouseUp);
  } else if (e.button == 2) {
    SECUENCIADOR_DE_RITMOS_HTML.addEventListener(
      "mousemove",
      eventoMouseMoveEliminacion
    );

    function eventoMouseUp() {
      SECUENCIADOR_DE_RITMOS_HTML.removeEventListener(
        "mousemove",
        eventoMouseMoveEliminacion
      );
      document.removeEventListener("mouseup", eventoMouseUp);
    }

    document.addEventListener("mouseup", eventoMouseUp);
  }
});
