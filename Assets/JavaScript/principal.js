const ENTORNO_AUDIO = new AudioContext();

let nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
let nodoCompresorSintetizador = ENTORNO_AUDIO.createDynamicsCompressor();


let nodoADSR = ENTORNO_AUDIO.createGain();

let LFOgain = ENTORNO_AUDIO.createGain();
    let retrasoLFO;
    let velocidadLFO;

let nodoMaster = ENTORNO_AUDIO.createGain();
let nodoPaneo = ENTORNO_AUDIO.createStereoPanner();