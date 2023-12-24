const BODY = document.querySelector("body");
const CONTENEDOR_TODO = document.getElementById("contenido-todo");

//=============================================================================
//               BOTON INICIO DE SESION O NOMBRE DE USUARIO                   |
// ============================================================================

let Se_Inicio_Sesion = false;

const authenticatedUserData = localStorage.getItem("authenticatedUserData");
const token = localStorage.getItem("userSessionToken");
const loginButton = document.getElementById("boton-iniciar-sesion");
const userAuthenticatedSection = document.getElementById("authentizated-user-section");
const nombreUsuarioHTML = document.getElementById("Username-Authenticated");
const closeSessionButton = document.getElementById("boton-cerrar-sesion");

if (token && authenticatedUserData) {
  loginButton.style.display = "none";
  nombreUsuarioHTML.innerText = JSON.parse(authenticatedUserData).Name;

  userAuthenticatedSection.style.display = "flex";

  Se_Inicio_Sesion = true;

  delegarEvento("click", closeSessionButton, () => {
    localStorage.removeItem("authenticatedUserData");
    localStorage.removeItem("userSessionToken");    
    window.location.reload();
  });

}

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

const PRELOADER_BACKGROUND = document.getElementById("preloader-background");

let DRUMS_DATA_DISPONIBLE = false;

const ENTORNO_AUDIO_DRUMS = new AudioContext();

const DRUMS_RUTAS = {
  kick: "Assets/Wav/Kick.wav",
  snare: "Assets/Wav/Snare.wav",
  snare2: "Assets/Wav/Snare 2.wav",
  closedHitHat: "Assets/Wav/Closed Hit Hat.wav",
  openHitHat: "Assets/Wav/Open Hit Hat.wav",
  clap: "Assets/Wav/Clap.wav",
  shaker: "Assets/Wav/Shaker.wav",
  crash: "Assets/Wav/Crash.wav",
};

const AUDIO_BUFFER_DRUMS = {};

// Object.entries() => [KEY, VALUE]

(async function () {
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
  setTimeout(()=>{
    desvanecerElemento(PRELOADER_BACKGROUND,0.8,true, 1);
  },500)

});

//============================================================
//            VARIABLES GLOBALES DE REPRODUCCION             |
// ===========================================================

let seEstaReproduciendo = false;
let estaPausado = true;
let seEstaGrabando = false;
let ultimoIndiceX;
let indiceCuadroSemicorcheaEnReproduccion = 0;
const TEMPO = document.getElementById("Tempo");
let duracionSemicorcheas = 60 / (TEMPO.value * 4);
const PORCION_SEMICORCHEA_POR_GRABACION = 8;
