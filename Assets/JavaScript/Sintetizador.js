

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


var datosOscilador1 = [tipoOndaOSC1,document.getElementById('Cantidad_voces_osc_1'),document.getElementById('Cantidad_desafinacion_osc_1')];
var datosOscilador2 = [tipoOndaOSC2,document.getElementById('Cantidad_voces_osc_2'),document.getElementById('Cantidad_desafinacion_osc_2')];
