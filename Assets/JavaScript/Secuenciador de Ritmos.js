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
  } else {
    console.error(`Nombre de tambor no válido: ${drumName}`);
  }
}

function reproducirRitmo(){

}

function pausarRitmo(){

}

function pararRitmo(){

}