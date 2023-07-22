// EVENTO PARA CONTROLAR EL VOLUMEN DE SALIDA DEL SINTETIZADOR
let volumenSliderSintetizador = document.getElementById('Slider-Vol-Sintetizador');

nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)/1.5;

volumenSliderSintetizador.addEventListener('mousemove',()=>{
    nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)/1.5;
})
volumenSliderSintetizador.addEventListener('keyup',()=>{
    nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)/1.5;
})

// CONFIGURANDO EL COMPRESSOR
nodoCompresorSintetizador.attack.value = 0;
nodoCompresorSintetizador.knee.value = 20;
nodoCompresorSintetizador.ratio.value = 12;
nodoCompresorSintetizador.threshold.value = -21;


//CREANDO DESLIZADOR DE IMAGENES PARA EL OSCILADOR 1
var tipoOndaOSC1 = insertaDeslizadorDeImagenesEn
(
    document.getElementById('Cont-tipos-onda-OSC1'),
    ["sine","triangle","square","sawtooth"],
    ["Senoidal","Triangular","Cuadrada","Diente de Sierra"],
    "./Assets/Imagenes",
    ["Onda\\ Senoidal\\ icon.png",
    "Onda\\ Triangular\\ Icon.png",
    "Onda\\ Cuadrada\\ Icon.png",
    "Onda\\ diente\\ de\\ sierra\\ icon.png"],
    "Tipo de Onda:",
    "1vw",
    ["LeftButtonOsc1","RightButtonOsc1"],
    "fila",
    "1.5vw",
    "0.2vw"
);


//CREANDO DESLIZADOR DE IMAGENES PARA EL OSCILADOR 2
var tipoOndaOSC2 = insertaDeslizadorDeImagenesEn
(
    document.getElementById('Cont-tipos-onda-OSC2'),
    ["sine","triangle","square","sawtooth"],
    ["Senoidal","Triangular","Cuadrada","Diente de Sierra"],
    "./Assets/Imagenes",
    ["Onda\\ Senoidal\\ icon.png",
    "Onda\\ Triangular\\ Icon.png",
    "Onda\\ Cuadrada\\ Icon.png",
    "Onda\\ diente\\ de\\ sierra\\ icon.png"],
    "Tipo de Onda:",
    "1vw",
    ["LeftButtonOsc2","RightButtonOsc2"],
    "fila",
    "1.5vw",
    "0.2vw"
);

var datosOscilador1 = [tipoOndaOSC1,document.getElementById('Cantidad_voces_osc_1'),document.getElementById('Cantidad_desafinacion_osc_1')];
var datosOscilador2 = [tipoOndaOSC2,document.getElementById('Cantidad_voces_osc_2'),document.getElementById('Cantidad_desafinacion_osc_2')];

