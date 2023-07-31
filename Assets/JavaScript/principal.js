const BODY = document.querySelector('body');
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

// // ALTO / ANCHO
// const ESCALA_MINIMA = 1/2;
