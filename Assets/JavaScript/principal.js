const BODY = document.querySelector("body");
const CONTENEDOR_TODO = document.getElementById("contenido-todo");

//=============================================================================
//                 ELEMENTOS NECESARIOS PARA EL SINTETIZADOR                  |
// ============================================================================

var ENTORNO_AUDIO_SINTH = new AudioContext();

var nodoSalidaSintetizador = ENTORNO_AUDIO_SINTH.createGain();
var nodoCompresorSintetizador = ENTORNO_AUDIO_SINTH.createDynamicsCompressor();

var nodoDeFiltro = ENTORNO_AUDIO_SINTH.createBiquadFilter();
const FRECUENCIA_MAXIMA_FILTRO = 15000;

var nodoDistorsion = ENTORNO_AUDIO_SINTH.createWaveShaper();
const CANTIDAD_BARRAS_DISTORSION = 25;
var datosCurvaDistorsion = new Float32Array(CANTIDAD_BARRAS_DISTORSION);

var nodoDeConvolucion = ENTORNO_AUDIO_SINTH.createConvolver();
var duracionReverb;
var nodoDeEco = ENTORNO_AUDIO_SINTH.createDelay();
var nodoFeedbackEco = ENTORNO_AUDIO_SINTH.createGain();

var nodoMaster = ENTORNO_AUDIO_SINTH.createGain();
var nodoPaneo = ENTORNO_AUDIO_SINTH.createStereoPanner();

var nodoAnalizador = ENTORNO_AUDIO_SINTH.createAnalyser();
nodoAnalizador.fftSize = 2048;
var bufferLength = nodoAnalizador.frequencyBinCount;
var datosAnalizador = new Uint8Array(bufferLength);

// FUNCION PARA DETECTAR SI HAY UN TECLADO CONECTADO
function isKeyboardConnected() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (
      gamepad !== null &&
      gamepad.mapping === "standard" &&
      gamepad.id.toLowerCase().includes("keyboard")
    ) {
      return true;
    }
  }
  return false;
}

// SERIA MEJOR CAMBIAR TODO CON PROMESAS EN CASO SE CONECTE UN TECLADO EN USO EN VIVO
const TECLADO_CONECTADO = isKeyboardConnected();
const MOUSE_ACTIVO = window.matchMedia("(pointer:fine)").matches;
// ESTE SI ESTA BIEN
const PANTALLA_TACTIL =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

//=============================================================================
//                            CARGANDO DRUMS...                               |
// ============================================================================

let DRUMS_DATA_DISPONIBLE = false;

const ENTORNO_AUDIO_DRUMS = new AudioContext();

const DRUMS_RUTAS = {
  kick: "Assets/Wav/Kick.wav",
  snare: "Assets/Wav/Snare.wav",
  snare2: "Assets/Wav/Snare 2.wav",
  closedHat: "Assets/Wav/Closed Hit Hat.wav",
  openHat: "Assets/Wav/Open Hit Hat.wav",
  clap: "Assets/Wav/Clap.wav",
  shakers: "Assets/Wav/Shaker.wav",
  crash: "Assets/Wav/Crash.wav",
};

const AUDIO_BUFFER_DRUMS = {};

// Object.entries() => [KEY, VALUE]

(async function getAudioBuffers() {
  for (const [drumName, ruta] of Object.entries(DRUMS_RUTAS)) {
    try {
      const response = await fetch(ruta);
      const data = await response.arrayBuffer();
      const audioBuffer = await ENTORNO_AUDIO_DRUMS.decodeAudioData(data);
      AUDIO_BUFFER_DRUMS[drumName] = audioBuffer;
    } catch (err) {
      console.error(err);
    }
  }
})().then(() => {
    DRUMS_DATA_DISPONIBLE = true;
});

//=============================================================================
//                    VARIABLES GLOBALES DE REPRODUCCION                      |
// ============================================================================

let seEstaReproduciendo = false;
let estaPausado = true;