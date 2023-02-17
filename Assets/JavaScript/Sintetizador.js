var tipoDeFiltro = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-tipos-de-filtros'),
    './Assets/Imagenes',
    ['Onda\\ Senoidal\\ icon\\ Verde\\ Oscuro.png','Onda\\ Cuadrada\\ Icon\\ Verde\\ Oscuro.png','Onda\\ diente\\ de\\ sierra\\ icon\\ Verde\\ Oscuro.png'],
    "TIPO DE FILTRO:",
    "1.2vw",
    "columna",
    "3vw",
    "rgb(160, 160, 160)",
    "0.22vw"
);

var LFOKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-lfo'),
    "2.8vw",
    "1vw",
    3,
    3,
    ["Retraso","Amplitud","Velocidad"],
    ["Knob-Retraso-LFO","Knob-Amplitud-LFO","Knob-Velocidad-LFO"],
    [0,0,0],
    [100,100,100]
);

var FiltroKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-filtro'),
    "3.2vw",
    "1vw",
    2,
    2,
    ["FACTOR Q","FRECUENCIA"],
    ['Knob-Factor-Q','Knob-Frecuencia'],
    [0,20],
    [100,18000]
);

var tipoDeFiltro = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-tipos-de-filtros'),
    './Assets/Imagenes',
    ['Onda\\ Senoidal\\ icon\\ Verde\\ Oscuro.png',
    'Onda\\ Cuadrada\\ Icon\\ Verde\\ Oscuro.png',
    'Onda\\ diente\\ de\\ sierra\\ icon\\ Verde\\ Oscuro.png'],
    "TIPO DE FILTRO:",
    "1.2vw",
    "columna",
    "3vw",
    "rgb(160, 160, 160)",
    "0.22vw"
);
