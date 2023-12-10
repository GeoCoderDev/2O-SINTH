// ELEMENTOS HTML
const SLIDER_TIPO_ONDA_1_HTML = document.getElementById("Cont-tipos-onda-OSC1");
const SLIDER_TIPO_ONDA_2_HTML = document.getElementById("Cont-tipos-onda-OSC2");
const CANTIDAD_VOCES_1_HTML = document.getElementById('Cantidad_voces_osc_1');
const CANTIDAD_VOCES_2_HTML = document.getElementById('Cantidad_voces_osc_2');
const DESAFINACION_1_HTML = document.getElementById('Cantidad_desafinacion_osc_1');
const DESAFINACION_2_HTML = document.getElementById('Cantidad_desafinacion_osc_2');

// VALORES NECESARIOS
const TIPOS_ONDA_DISPONIBLES = ["sine","triangle","square","sawtooth"];


// EVENTO PARA CONTROLAR EL VOLUMEN DE SALIDA DEL SINTETIZADOR
let volumenSliderSintetizador = document.getElementById('Slider-Vol-Sintetizador');

nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)/1.5;

delegarEvento('mousemove',volumenSliderSintetizador,()=>{
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
    TIPOS_ONDA_DISPONIBLES,
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
    TIPOS_ONDA_DISPONIBLES,
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

let datosOscilador1 = [tipoOndaOSC1,CANTIDAD_VOCES_1_HTML,DESAFINACION_1_HTML];
let datosOscilador2 = [tipoOndaOSC2,CANTIDAD_VOCES_2_HTML,DESAFINACION_2_HTML];

let letrasEstanMostradas = false;
let estilosParaLetras;

let mostrarLetras = ()=>{

    if(estilosParaLetras){
        eliminarReglasCSSAdicionales(estilosParaLetras);    
        estilosParaLetras = undefined;
        letrasEstanMostradas = true;
    }

}

let ocultarLetras = ()=>{

    if(!estilosParaLetras){
        
        estilosParaLetras = insertarReglasCSSAdicionales(`
        
        .tecla_blanca,.tecla_negra{
            font-size: 0;
        }
        
        #letras-guia-teclas{
            text-decoration: line-through !important;
            box-shadow: 0 0 0.7vw 0.3vw rgba(0, 0, 0, 0.3) inset;
            transform: scale(0.95);
        }
        
        `)
    }
    
    letrasEstanMostradas = false;

}

ocultarLetras();



delegarEvento('click',"#letras-guia-teclas",()=>{
    
    if(!letrasEstanMostradas){

        mostrarLetras();

    }else{

        ocultarLetras();

    }

})