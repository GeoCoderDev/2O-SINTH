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
    "fila",
    "1.5vw",
    "0.2vw"
);

//CREANDO DESLIZADOR DE IMAGENES PARA EL LFO 
var tipoOndaLFO = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-ondas-lfo'),
    ["sine","triangle","square","sawtooth"],
    ["Senoidal","Triangular","Cuadrada","Diente de Sierra"],
    "./Assets/Imagenes",
    ["Onda\\ Senoidal\\ icon\\ Verde\\ Oscuro.png",
    "Onda\\ Triangular\\ Icon\\ Verde\\ Oscuro.png",
    "Onda\\ Cuadrada\\ Icon\\ Verde\\ Oscuro.png",
    "Onda\\ diente\\ de\\ sierra\\ icon\\ Verde\\ Oscuro.png"],
    "Tipo de Onda:",
    "1vw",
    "fila",
    "1.5vw",
    "0.2vw",
    "rgb(106, 146, 106)"
);

//CREANDO KNOBS PARA EL LFO 
var LFOKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-lfo'),
    "2.8vw",
    "1vw",
    3,
    3,
    ["RETRASO","AMPLITUD","VELOCIDAD"],
    ["Knob-Retraso-LFO","Knob-Amplitud-LFO","Knob-Velocidad-LFO"],
    [0,0,0],
    [100,100,100],
    "rgb(106, 146, 106)"
);

//CREANDO DESLIZADOR DE IMAGENES PARA EL FILTRO
var tipoDeFiltro = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-tipos-de-filtros'),
    ["lowpass","highpass","bandpass","notch","lowshelf","highshelf","peaking","allpass"],
    ["Filtro Paso Bajo","Filtro Paso Alto","Filtro Paso Banda", "Filtro Banda Rechazo", 
    "Filtro de Escalon Bajo","Filtro de Escalon Alto","Filtro Peaking","Filtro Paso Total"],
    './Assets/Imagenes',
    ['Filtro\\ lowpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ highpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ bandpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ notch\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ lowshelf\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ highshelf\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ peaking\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ allpass\\ icon\\ Morado\\ Oscuro.png'],
    "TIPO DE FILTRO:",
    "1.2vw",
    "columna",
    "3vw",
    "0.22vw",
    "rgb(146, 106, 139)"
);

//CREANDO KNOBS PARA EL FILTRO
var FiltroKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-filtro'),
    "3vw",
    "1vw",
    3,
    3,
    ["FACTOR Q","FRECUENCIA","GANANCIA"],
    ['Filtro-Factor-Q','Filtro-Frecuencia','Filtro-Ganancia'],
    [0,20,0],
    [100,18000,100],
    "rgb(146, 106, 139)"
);


//BARRAS DE CURVA DE DISTORSION

var barrasDistorsion = insertarGraficoDeBarrasInteractiva
(
    document.getElementById('cont-barras'),
    15,
    0,
    1,
    "rgb(184, 133, 112)",
    "rgb(154, 103, 82)"
)

setTimeout(()=>{
    console.log(barrasDistorsion)
},5000);