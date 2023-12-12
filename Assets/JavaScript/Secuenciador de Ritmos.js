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

    document.querySelectorAll(".Percusion-Ritmo").forEach((percusionRitmo)=>{
      if(percusionRitmo.dataset.drumname!==drumName) return;
      percusionRitmo.animate([
        {boxShadow: "0 0 0.7vw 1vw inset rgba(0, 0, 0, 0.6)", fontSize: "1.4vh"},
        {boxShadow: "0 0 0.7vw 0.5vw inset rgba(0, 0, 0, 0.6)", fontSize: "1.65vh"}
      ],{iterations:1, duration: 200, easing:"ease"})
    })

    audioBufferSourceNode.addEventListener("ended", (e) => {
      audioBufferSourceNode.disconnect();
      audioBufferSourceNode.stop();
    });
  } else {
    console.error(`Nombre de tambor no válido: ${drumName}`);
  }
}

let Todos_los_cuadros_semicorchea_ritmos =
  document.querySelectorAll(".Semicorchea-Ritmo");

delegarEvento("click", ".Percusion-Ritmo", (e) => {
  
  e.target.animate([
    {boxShadow: "0 0 0.7vw 1vw inset rgba(0, 0, 0, 0.6)", fontSize: "1.4vh"},
    {boxShadow: "0 0 0.7vw 0.5vw inset rgba(0, 0, 0, 0.6)", fontSize: "1.65vh"}
  ],{iterations:1, duration: 200, easing: "ease"});

  reproducirDrum(e.target.dataset.drumname);
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
  if(e.target.classList.contains("Semicorchea-Ritmo")){
    e.target.classList.add("Semicorchea-Ritmo-Activa");
  }
};

/**
 *
 * @param {MouseEvent} e
 */
const eventoMouseMoveEliminacion = (e) => {
  if(e.target.classList.contains("Semicorchea-Ritmo")){
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
      document.removeEventListener("mouseup",eventoMouseUp);
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
      document.removeEventListener("mouseup",eventoMouseUp);
    }

    document.addEventListener("mouseup", eventoMouseUp);
  }
});
