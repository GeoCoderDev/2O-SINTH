
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
    "rgb(106, 146, 106)",
    "0.2vw"
)

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
    [100,100,100]
);

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
    [100,18000,100]
);

var tipoDeFiltro = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-tipos-de-filtros'),
    ["lowpass","highpass","bandpass","notch","lowshelf","highshelf","peaking","allpass"],
    ["Filtro Paso Bajo","Filtro Paso Alto","Filtro Paso Banda", "Filtro Banda Rechazo", "Filtro de Escalon Bajo","Filtro de Escalon Alto","Filtro Peaking","Filtro Paso Total"],
    './Assets/Imagenes',
    ['Onda\\ Senoidal\\ icon\\ Verde\\ Oscuro.png',
    'Onda\\ Cuadrada\\ Icon\\ Verde\\ Oscuro.png',
    'Onda\\ diente\\ de\\ sierra\\ icon\\ Verde\\ Oscuro.png'],
    "TIPO DE FILTRO:",
    "1.2vw",
    "columna",
    "3vw",
    "rgb(146, 106, 139);",
    "0.22vw"
);
