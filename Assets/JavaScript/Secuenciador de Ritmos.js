
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

    audioBufferSourceNode.addEventListener("ended", (e) => {
      audioBufferSourceNode.disconnect();
      audioBufferSourceNode.stop();
    });
  } else {
    console.error(`Nombre de tambor no válido: ${drumName}`);
  }
}

function reproducirRitmo() {}

function pausarRitmo() {}

function pararRitmo() {}

let Todos_los_cuadros_semicorchea_ritmos =
  document.querySelectorAll(".Semicorchea-Ritmo");


delegarEvento("click", ".Percusion-Ritmo", (e) => {
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


