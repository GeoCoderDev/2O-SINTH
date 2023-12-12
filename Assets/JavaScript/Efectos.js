// MAXIMO TIEMPO DURACION POR PARAMETRO EN SEGUNDOS
const MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR = 4;

// DESLIZADORES DEL AMPLIFICADOR ADSR
let ataqueSlider = document.getElementById('Amp-Ataque-Slider');
let decaySlider = document.getElementById('Amp-Decay-Slider');
let sustainSlider = document.getElementById('Amp-Sustain-Slider');
let releaseSlider = document.getElementById('Amp-Release-Slider');

/**
 * 
 * @param {'A'|'D'|'S'|'R'} elementoADSR 
 * @returns
 */
function getADSRvalues(elementoADSR){
    switch (elementoADSR) {
        case "A":
            return parseFloat(ataqueSlider.value);
    
        case "D":
            return parseFloat(decaySlider.value);

        case "S":
            return parseFloat(sustainSlider.value);

        case "R":
            return parseFloat(releaseSlider.value)/2;

        default:
            console.log("Error 34, sonido.js")
            break;
    }
}

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
    "min(2.1vh,1vw)",
    ["LeftButtonTipoOndaLFO","RightButtonTipoOndaLFO"],
    "fila",
    "min(3.2vh,1.5vw)",
    "max(0.2vw,0.3vh)",
    "rgb(106, 146, 106)"
);

let CONTROL_A_CONTROLAR_LFO = document.getElementById('Control-a-controlar-LFO');

//CREANDO KNOBS PARA EL LFO 
var LFOKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-lfo'),
    "min(5.9vh,3vw)",
    "min(2.1vh,1vw)",
    3,
    3,
    ["RETRASO","AMPLITUD","VELOCIDAD"],
    ["Knob-Retraso-LFO","Knob-Amplitud-LFO","Knob-Velocidad-LFO"],
    [0,0,0],
    [0.5,100,20],
    [0,0,0],
    "rgb(106, 146, 106)"
);

//CREANDO DESLIZADOR DE IMAGENES PARA EL FILTRO
var tipoDeFiltro = insertaDeslizadorDeImagenesEn
(
    document.getElementById('cont-slider-tipos-de-filtros'),
    ["allpass","lowpass","highpass","bandpass","notch","lowshelf","highshelf","peaking"],
    ["Filtro Paso Total","Filtro Paso Bajo","Filtro Paso Alto","Filtro Paso Banda", "Filtro Banda Rechazo", 
    "Filtro de Escalon Bajo","Filtro de Escalon Alto","Filtro Peaking"],
    './Assets/Imagenes',
    ['Filtro\\ allpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ lowpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ highpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ bandpass\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ notch\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ lowshelf\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ highshelf\\ icon\\ Morado\\ Oscuro.png',
    'Filtro\\ peaking\\ icon\\ Morado\\ Oscuro.png'],
    "TIPO DE FILTRO",
    "min(2.55vh,1.4vw)",
    ["LeftButtonTipoFiltro","RightButtonTipoFiltro"],
    "columna",
    "min(6.2vh,3vw)",
    "max(0.22vw,0.30vh)",
    "rgb(146, 106, 139)"
);

//CREANDO KNOBS PARA EL FILTRO
var FiltroKnobsValues = insertaKnobsEn
(
    document.getElementById('cont-knobs-filtro'),
    "min(6.4vh,3vw)",
    "min(2.15vh,1vw)",
    3,
    3,
    ["FACTOR Q","FRECUENCIA","GANANCIA"],
    ['Filtro-Factor-Q','Filtro-Frecuencia','Filtro-Ganancia'],
    [0,20,0],
    [100,FRECUENCIA_MAXIMA_FILTRO,100],
    [0,20,0],
    "rgb(146, 106, 139)"
);


//BARRAS DE CURVA DE DISTORSION

var barrasDistorsion = insertarGraficoDeBarrasInteractiva
(
    document.getElementById('cont-barras'),
    CANTIDAD_BARRAS_DISTORSION,
    -1,
    1,
    "rgb(184, 133, 112)",
    "rgb(154, 103, 82)",
    "BarraDistorsion"
);

//CREANDO KNOBS PARA EL EFECTO DE REBERB
var knobsReverb = insertaKnobsEn(
    document.getElementById('cont-knobs-reverb'),
    "min(9.5vh,7vw)",
    "min(3vh,1.4vw)",
    1,
    1,
    ["DURACION"],
    ["knob-duracion-reverb"],
    [0.01],
    [3],
    [0.01],
    "rgb(106, 141, 146)"
);

var knobsEco = insertaKnobsEn(
    document.getElementById('controles-eco'),
    "min(5.8vh,4vw)",
    "min(2.1vh,1.2vw)",
    2,
    1,
    ["TIEMPO ENTRE REPETICIONES","FEEDBACK"],
    ["KNOB-TER-ECO","KNOB-FEEDBACK-ECO"],
    [0,0],
    [0.5,99],
    [0,0],
    "rgb(104, 86, 130)"
)

var panSintetizador = insertaKnobsEn(
    document.getElementById('cont-pan'),
    "min(5.9vh,3vw)",
    "min(2.5vh,1.4vw)",
    1,
    1,
    ["PAN"],
    "panSintetizador",
    [-1],
    [1],
    [0],
    "rgb(174, 172, 121)",

    // CONFIGURANDO EL PANEO
    [
        function(){
            if (!panSintetizador){
                
                let esperandoPromesa = new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        if (panSintetizador) resolve(panSintetizador.value[0]);
                    },1000)
                })
                esperandoPromesa
                    .then((resolve)=>{nodoPaneo.pan.value = resolve});

            }else{
                nodoPaneo.pan.value = panSintetizador.value[0];
            }  
            
        }        
    ]
)




// CONFIGURANDO EL VOLUMEN DEL MASTER
let VOLUMEN_SLIDER_MASTER = document.getElementById('volumenMaster');

nodoMaster.gain.value = (VOLUMEN_SLIDER_MASTER.value/100)/0.8;

delegarEvento('mousemove',VOLUMEN_SLIDER_MASTER,()=>{
    nodoMaster.gain.value = (VOLUMEN_SLIDER_MASTER.value/100)/0.8;
})

VOLUMEN_SLIDER_MASTER.addEventListener('keyup',()=>{
    nodoMaster.gain.value = (VOLUMEN_SLIDER_MASTER.value/100)/0.8;
})




