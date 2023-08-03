const BODY = document.querySelector('body');
const CONTENEDOR_TODO = document.getElementById('contenido-todo');
var ENTORNO_AUDIO = new AudioContext();

var nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
var nodoCompresorSintetizador = ENTORNO_AUDIO.createDynamicsCompressor();

var nodoDeFiltro = ENTORNO_AUDIO.createBiquadFilter();
    const FRECUENCIA_MAXIMA_FILTRO = 15000;

var nodoDistorsion = ENTORNO_AUDIO.createWaveShaper();
    const CANTIDAD_BARRAS_DISTORSION = 25;
    var datosCurvaDistorsion = new Float32Array(CANTIDAD_BARRAS_DISTORSION);

var nodoDeConvolucion = ENTORNO_AUDIO.createConvolver();
    var duracionReverb;
var nodoDeEco = ENTORNO_AUDIO.createDelay();
    var nodoFeedbackEco = ENTORNO_AUDIO.createGain();

var nodoMaster = ENTORNO_AUDIO.createGain();
var nodoPaneo = ENTORNO_AUDIO.createStereoPanner();

var nodoAnalizador = ENTORNO_AUDIO.createAnalyser();
    nodoAnalizador.fftSize = 2048;
    var bufferLength = nodoAnalizador.frequencyBinCount;
    var datosAnalizador = new Uint8Array(bufferLength);


// FUNCION PARA DETECTAR SI HAY UN TECLADO CONECTADO
function isKeyboardConnected() {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
        if (gamepad !== null && gamepad.mapping === "standard" && gamepad.id.toLowerCase().includes("keyboard")) {
        return true;
        }
    }
    return false;
}
      
// SERIA MEJOR CAMBIAR TODO CON PROMESAS EN CASO SE CONECTE UN TECLADO EN USO EN VIVO
const TECLADO_CONECTADO = isKeyboardConnected(); 
const MOUSE_ACTIVO = window.matchMedia('(pointer:fine)').matches;
// ESTE SI ESTA BIEN 
const PANTALLA_TACTIL = 'ontouchstart' in window || (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);



