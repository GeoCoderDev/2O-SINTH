
const FRECUENCIA_MAXIMA = 16745;
const FRECUENCIA_MINIMA = 16.35;

let resolveDePromesasDeTeclado = [];
let notasSintetizadorPorTeclasDelTeclado = []
let frecuenciasPorTecla = [];
let teclaHTMLPorTecla = [];
let teclaRollHTMLPorTecla = [];
let controlLFO = document.getElementById('Control-a-controlar-LFO').value;

let adsrActivado = true;


const FRECUENCIAS_12NOTAS_OCTAVA0 = new Map([
                                            ["C", 16.35],  //C0
                                            ["Csos", 17.32], //C#0
                                            ["D", 18.35],  //D0
                                            ["Dsos", 19.45], //D#0
                                            ["E", 20.60],  //E0
                                            ["F", 21.83],  //F0
                                            ["Fsos", 23.12], //F#0
                                            ["G", 24.50],  //G0
                                            ["Gsos", 25.96], //G#0
                                            ["A", 27.50],  //A0
                                            ["Asos", 29.14], //A#0
                                            ["B", 30.87]   //B0
                                        ])

document.getElementById('Control-a-controlar-LFO').addEventListener('change',()=>{
    controlLFO = document.getElementById('Control-a-controlar-LFO').value;
})

const MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR = 4;

// DESLIZADORES DEL AMPLIFICADOR ADSR
let ataqueSlider = document.getElementById('Amp-Ataque-Slider');
let decaySlider = document.getElementById('Amp-Decay-Slider');
let sustainSlider = document.getElementById('Amp-Sustain-Slider');
let releaseSlider = document.getElementById('Amp-Release-Slider');

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

//===========================================================================================================
// REVERBERACION
//===========================================================================================================

var impulse;


function impulseResponse(duration,decay) {
    var length = ENTORNO_AUDIO.sampleRate * duration;

    impulse = ENTORNO_AUDIO.createBuffer(2,length,ENTORNO_AUDIO.sampleRate);
    var IR = impulse.getChannelData(0);
    for (var i=0;i<length;i++) IR[i] = (2*Math.random()-1)*Math.pow(1-i/length,decay);
    return impulse;
}

class NotaSintetizador{

    constructor(nombreNota,octava,elementoHTML,elementoHTMLPianoRoll,codigoTecla){
        this.octava = octava;
        this.nombreNota = nombreNota;        
        this.frecuencia = FRECUENCIAS_12NOTAS_OCTAVA0.get(this.nombreNota)*(2**this.octava);
        this.codigoTecla = codigoTecla;

        this.elementoHTML = elementoHTML;
        this.teclaPianoRoll = elementoHTMLPianoRoll;
        teclaHTMLPorTecla[codigoTecla] = this.elementoHTML;
        teclaRollHTMLPorTecla[codigoTecla] = this.teclaPianoRoll;

        NotaSintetizador.todasLasNotasSintetizador.push(this);
        
        let ejecutarHacerSonarNotaMetodo = (e)=>{
            
            let promesaParaParar = new Promise((resolve,reject)=>{
                delegarEvento('mouseup',e.target,()=>{
                    resolve();
                })

                delegarEvento('mouseout',e.target,()=>{
                    resolve();
                });

            })

            this.hacerSonarNota(promesaParaParar);
        }

        delegarEvento('mousedown',this.elementoHTML,ejecutarHacerSonarNotaMetodo)
        delegarEvento('mousedown',this.teclaPianoRoll,ejecutarHacerSonarNotaMetodo)
        
        notasSintetizadorPorTeclasDelTeclado[this.codigoTecla] = this;
    }

    subirOctava(){
        this.octava = this.octava + 1;
        this.frecuencia = FRECUENCIAS_12NOTAS_OCTAVA0.get(this.nombreNota)*(2**this.octava);
        frecuenciasPorTecla[this.codigoTecla] = this.frecuencia; 
    }

    static subirOctavaAlSintetizador(){
        // SI LA DIFERENCIA ENTRE LA NOTA CON FRECUENCIA MAS ALTA Y LA FRECUENCIA MAXIMA ES MENOR QUE 1000 NO PODEMOS SUBIR LA OCTAVA.
        if((FRECUENCIA_MAXIMA - NotaSintetizador.todasLasNotasSintetizador[NotaSintetizador.todasLasNotasSintetizador.length-1].frecuencia)<1000) return;

        NotaSintetizador.todasLasNotasSintetizador.forEach((unaNotaSintetizador)=>{
            unaNotaSintetizador.subirOctava();
        })

    }

    bajarOctava(){        
        this.octava = this.octava - 1;
        this.frecuencia = FRECUENCIAS_12NOTAS_OCTAVA0.get(this.nombreNota)*(2**this.octava);
        frecuenciasPorTecla[this.codigoTecla] = this.frecuencia; 
    }

    static bajarOctavaAlSintetizador(){
        // SI LA DIFERENCIA ENTRE LA NOTA CON FRECUENCIA MAS BAJA Y LA FRECUENCIA MINIMA ES MENOR QUE 10 NO PODEMOS BAJAR LA OCTAVA.
        if((NotaSintetizador.todasLasNotasSintetizador[0].frecuencia-FRECUENCIA_MINIMA)<10) return;

        NotaSintetizador.todasLasNotasSintetizador.forEach((unaNotaSintetizador)=>{
            unaNotaSintetizador.bajarOctava();
        })
    }

    static pausarTodasLasNotasQueEstanSonandoConTecla(){

        for(let [clave,valor] of teclasPulsadas){
            valor();
            teclasPulsadas.delete(clave);
        }
    }

    /**
     * @description Esta funcion inicia la frecuencia de cierta nota durante el tiempo que se le pasa al parametro duracion
     * @param {*} duracionOPromesa Este parametro pide la duracion en segundos que se hara sonar la nota o bien una promesa para parar el sonido
     */
    hacerSonarNota(duracionOPromesa,releaseValido=true){
        
        let nodoADSRNota;

        if(adsrActivado) nodoADSRNota = ENTORNO_AUDIO.createGain();

        let todosLosEventosClick = [];
        let todosLosEventosMouseMove = [];
        let Osciladores1 = [];
        let Osciladores2 = [];
        let desafinacionOscilador1 = datosOscilador1[2].value;
        let desafinacionOscilador2 = datosOscilador2[2].value;
            let OsciladoresLFO1 = []; 
                let LFOgains1 = [];
            let OsciladoresLFO2 = [];           
                let LFOgains2 = [];


        setTimeout(()=>{        
            nodoDeConvolucion.buffer = impulse;
            impulse = impulseResponse(knobsReverb.value[0],1);
        }, 1);


        function* asignadorDeDetunesAOsciladores(cantidadTotalDeOsciladores,desafinacionTotalOsciladores){
                
            let desafinacionParaRepartir = desafinacionTotalOsciladores;

            for(let i=0;i<cantidadTotalDeOsciladores;i++){
                
                if(i==0){
                    yield 0;
                }else{
                    
                    if(i%2!=0){
                        yield desafinacionParaRepartir;
                    }else{
                        yield -desafinacionParaRepartir;
                    }
                    desafinacionParaRepartir = desafinacionParaRepartir/2;                                                
                }    
            }

        }

        let asignadorDeDetuneParaOsciladores1 = asignadorDeDetunesAOsciladores(datosOscilador1[1].value,desafinacionOscilador1);
        let asignadorDeDetuneParaOsciladores2 = asignadorDeDetunesAOsciladores(datosOscilador2[1].value,desafinacionOscilador2);

        for(let i=0; i<datosOscilador1[1].value;i++){
            
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = this.frecuencia;
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();

                let actualizarTipoOndaEnTiempoReal = ()=>{
                    setTimeout(()=>{
                        for(let n=0;n<Osciladores1.length;n++){
                            Osciladores1[n].type = datosOscilador1[0].obtenerValor();
                        }
                    },400);
                }

                todosLosEventosClick.push(delegarEvento('click',`#${tipoOndaOSC1.obtenerIDs[0]}, #${tipoOndaOSC1.obtenerIDs[1]}`,actualizarTipoOndaEnTiempoReal));

            // Para practicar funciones generadoras sobre todo jejej

            if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                //Creando un nodo de ganancia por Oscilador LFO
                LFOgains1[i] = ENTORNO_AUDIO.createGain();

                    LFOgains1[i].gain.value = LFOKnobsValues.value[1]; //Inicializando la Amplitud
                    
                    //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                    todosLosEventosMouseMove.push(delegarEvento("mousemove",`#${LFOKnobsValues.obtenerIDs[1]}`,()=>{
                        for(let k=0;k<LFOgains1.length;k++){     
                            LFOgains1[k].gain.value = LFOKnobsValues.value[1];
                        }    
                    }));
                                          
                OsciladoresLFO1[i] = ENTORNO_AUDIO.createOscillator();

                    OsciladoresLFO1[i].frequency.value = LFOKnobsValues.value[2];

                    // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                    todosLosEventosMouseMove.push(delegarEvento("mousemove",`#${LFOKnobsValues.obtenerIDs[2]}`,()=>{
                        for(let u=0;u<OsciladoresLFO1.length;u++){
                            OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                        }
                    }));

                    OsciladoresLFO1[i].type = tipoOndaLFO.obtenerValor();

                    let actualizarTipoOndaLFOEnTiempoReal = ()=>{
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores1.length;n++){
                                OsciladoresLFO1[n].type = datosOscilador1[0].obtenerValor();
                            }
                        },400);
                    }
    
                    todosLosEventosClick.push(delegarEvento('click',`#${tipoOndaLFO.obtenerIDs[0]}, #${tipoOndaLFO.obtenerIDs[1]}`,actualizarTipoOndaLFOEnTiempoReal));                    

                    OsciladoresLFO1[i].connect(LFOgains1[i]);
                    LFOgains1[i].connect(Osciladores1[i].detune);

                    let retrasoLFO = LFOKnobsValues.value[0];
                    
                    OsciladoresLFO1[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO); 
                    
                
            }

            //Asignando el detune para el oscilador            
            Osciladores1[i].detune.value = asignadorDeDetuneParaOsciladores1.next().value;

            Osciladores1[i].start();

            if(nodoADSRNota){
                Osciladores1[i].connect(nodoADSRNota);
                nodoADSRNota.connect(nodoSalidaSintetizador)
            }else{
                Osciladores1[i].connect((nodoSalidaSintetizador));
            }          

        }

        for(let i=0; i<datosOscilador2[1].value;i++){
                
                Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores2[i].frequency.value = this.frecuencia;
                Osciladores2[i].type = datosOscilador2[0].obtenerValor();

                    let actualizarTipoOndaEnTiempoReal = ()=>{
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores2.length;n++){
                                Osciladores2[n].type = datosOscilador2[0].obtenerValor();
                            }
                        },400);
                    }

                    todosLosEventosClick.push(delegarEvento('click',`#${tipoOndaOSC2.obtenerIDs[0]}, #${tipoOndaOSC2.obtenerIDs[1]}`,actualizarTipoOndaEnTiempoReal));

                if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                    //Creando un nodo de ganancia por Oscilador LFO
                    LFOgains2[i] = ENTORNO_AUDIO.createGain();

                        LFOgains2[i].gain.value = LFOKnobsValues.value[1]; //Inicializando la Amplitud
                        
                        //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                        todosLosEventosMouseMove.push(delegarEvento("mousemove",`#${LFOKnobsValues.obtenerIDs[1]}`,()=>{
                            for(let k=0;k<LFOgains2.length;k++){     
                                LFOgains2[k].gain.value = LFOKnobsValues.value[1];
                            }    
                        }));
                                            
                    OsciladoresLFO2[i] = ENTORNO_AUDIO.createOscillator();

                        OsciladoresLFO2[i].frequency.value = LFOKnobsValues.value[2];

                        // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                        todosLosEventosMouseMove.push(delegarEvento("mousemove",`#${LFOKnobsValues.obtenerIDs[2]}`,()=>{
                            for(let u=0;u<OsciladoresLFO2.length;u++){
                                OsciladoresLFO2[u].frequency.value = LFOKnobsValues.value[2];
                            }
                        }));

                        OsciladoresLFO2[i].type = tipoOndaLFO.obtenerValor();

                        let actualizarTipoOndaLFOEnTiempoReal = ()=>{
                            setTimeout(()=>{
                                for(let n=0;n<Osciladores2.length;n++){
                                    OsciladoresLFO2[n].type = datosOscilador2[0].obtenerValor();
                                }
                            },400);
                        }
        
                        todosLosEventosClick.push(delegarEvento('click',`#${tipoOndaLFO.obtenerIDs[0]}, #${tipoOndaLFO.obtenerIDs[1]}`,actualizarTipoOndaLFOEnTiempoReal));                    
                        
                        OsciladoresLFO2[i].connect(LFOgains2[i]);
                        LFOgains2[i].connect(Osciladores2[i].detune);

                        let retrasoLFO = LFOKnobsValues.value[0];
                        
                        OsciladoresLFO2[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                }

                console.log(asignadorDeDetuneParaOsciladores2.next().value);
                Osciladores2[i].detune.value = asignadorDeDetuneParaOsciladores2.next().value;

                Osciladores2[i].start();

                if(nodoADSRNota){
                    Osciladores2[i].connect(nodoADSRNota);
                    nodoADSRNota.connect(nodoSalidaSintetizador)
                }else{
                    Osciladores2[i].connect((nodoSalidaSintetizador));
                }    

        }

//==================================================================================

        let iniciarADSR = ()=>{
            nodoADSRNota.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
            let horaInicioPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
            let duracionAtaque = (getADSRvalues("A")/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
            let finalAtaque = horaInicioPresionDeUnaNota + duracionAtaque;
            let duracionDecay = (getADSRvalues("D")/100)*MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
            //Ataque
            nodoADSRNota.gain.setValueAtTime(0,horaInicioPresionDeUnaNota);
            nodoADSRNota.gain.linearRampToValueAtTime(0.5,finalAtaque);
            //Decay + Sustain
            nodoADSRNota.gain.setTargetAtTime((getADSRvalues("S"))/100,finalAtaque,duracionDecay);
        }


        if(nodoADSRNota){            
            iniciarADSR();
        }


        if (this.elementoHTML.id.match(/sos/g)){
            if(seccion_en_vista==1){
                this.elementoHTML.classList.add('tecla_negra_pulsada');
            }else if(seccion_en_vista==3){
                this.teclaPianoRoll.classList.add('Tecla-Negra-Piano-Roll-pulsada');
            }
        }else{
            if(seccion_en_vista==1){
                this.elementoHTML.classList.add('tecla_blanca_pulsada');
            }else if(seccion_en_vista==3){
                this.teclaPianoRoll.classList.add('Tecla-Blanca-Piano-Roll-pulsada');
            }
        }


        let duracionRelease = ((getADSRvalues("R"))/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;


        let parandoSonido = ()=>{
            for(let i=0;i<Osciladores1.length;i++){
                // Osciladores oara sonar
                Osciladores1[i].stop();
                Osciladores1[i].disconnect();
                if(OsciladoresLFO1[i]){
                    // Osciladores LFO
                    OsciladoresLFO1[i].stop();
                    OsciladoresLFO1[i].disconnect();

                    // LFO GAINS para controlar la amplitud de los LFO
                    LFOgains1[i].disconnect();
                    LFOgains1[i] = null;
                }                         

            }
            
            for(let i=0;i<Osciladores2.length;i++){
                Osciladores2[i].stop();
                Osciladores2[i].disconnect();
                // Osciladores2[i] = null;
                if(OsciladoresLFO2[i]){
                    // Osciladores LFO
                    OsciladoresLFO2[i].stop();
                    OsciladoresLFO2[i].disconnect();
                    // LFO GAINS para controlar la amplitud de los LFO
                    LFOgains2[i].disconnect();
                    LFOgains2[i] = null;
                
                } 
                
            }
            
            //Eliminando el nodo ADSR
            if(nodoADSRNota){
                nodoADSRNota.disconnect();
                nodoADSRNota = null;
            }

            todosLosEventosClick.forEach((IDEventoClick)=>{
                eliminarEventoDelegado('click',IDEventoClick);
            })

            todosLosEventosClick = [];
            todosLosEventosClick = null; 

            todosLosEventosMouseMove.forEach((IDEventoMouseMove)=>{
                eliminarEventoDelegado('mousemove',IDEventoMouseMove);
            })

            todosLosEventosMouseMove = [];
            todosLosEventosMouseMove = null;

            Osciladores1 = [];
            Osciladores1 = null;
            Osciladores2 = [];
            Osciladores2 = null;

            OsciladoresLFO1 = []
            OsciladoresLFO1 = null;
            LFOgains1 = [];
            LFOgains1 = null;

            OsciladoresLFO2 = [];
            OsciladoresLFO2 = null;
            LFOgains2 = [];
            LFOgains2 = null;

        }

        let pasarADSRaRelease = ()=>{

            let volumenAntesDeSoltar = nodoADSRNota.gain.value;
                    
            nodoADSRNota.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
            let horaFinalPresionDeUnaNota = ENTORNO_AUDIO.currentTime;            
            let finalRelease = horaFinalPresionDeUnaNota + duracionRelease;
            nodoADSRNota.gain.setValueAtTime(volumenAntesDeSoltar,horaFinalPresionDeUnaNota);
            nodoADSRNota.gain.linearRampToValueAtTime(0,finalRelease);

        }

        let quitarClasesDePulsacion = ()=>{
            if (this.elementoHTML.id.match(/sos/g)){
                if(seccion_en_vista==1){
                    this.elementoHTML.classList.remove('tecla_negra_pulsada');
                }else if(seccion_en_vista==3){
                    this.teclaPianoRoll.classList.remove('Tecla-Negra-Piano-Roll-pulsada');
                }
            }else{
                if(seccion_en_vista==1){
                    this.elementoHTML.classList.remove('tecla_blanca_pulsada');
                }else if(seccion_en_vista==3){
                    this.teclaPianoRoll.classList.remove('Tecla-Blanca-Piano-Roll-pulsada');
                }
            }
        }

        //Comprobando si el parametro es una promesa
        if((duracionOPromesa instanceof Promise)){

            duracionOPromesa.then((valor)=>{

                if(nodoADSRNota){
                    pasarADSRaRelease();                    
                }
                    
                quitarClasesDePulsacion();

                setTimeout(parandoSonido,(((nodoADSRNota)&&releaseValido)?duracionRelease:0)*1000)
            })

        }else{

            setTimeout(()=>{
                
                if(nodoADSRNota){
                    pasarADSRaRelease();                    
                }
                
                quitarClasesDePulsacion();
            
            },duracionOPromesa*990)
        
            setTimeout(parandoSonido,(duracionOPromesa*990)+(((releaseValido)?duracionRelease:0)*1000))
        }
        
    }


}

NotaSintetizador.todasLasNotasSintetizador = [];

//EVENTO DE TECLADO PARA SINTETIZADOR DE VARIAS TECLAS CON UN OBJETO MAP

let teclasPulsadas = new Map();

window.addEventListener('keydown',(e)=>{

    //Comprobando si la tecla pulsada se encuentra en nuestra lista de teclas pulsadas
    //para agregarla
    if(teclasPulsadas.has(e.keyCode)||(!notasSintetizadorPorTeclasDelTeclado[e.keyCode])) return false;


    if(seccion_en_vista!=4){

        let codigoDeTecla = e.keyCode;

        notasSintetizadorPorTeclasDelTeclado[codigoDeTecla].hacerSonarNota(new Promise((resolve,reject)=>{
            teclasPulsadas.set(codigoDeTecla,resolve);
        }));
        
    }       

})


window.addEventListener('keyup',(e)=>{

    if(!teclasPulsadas.has(e.keyCode)){
        if(e.keyCode==107){
            NotaSintetizador.subirOctavaAlSintetizador();
        }else if(e.keyCode==109){
            NotaSintetizador.bajarOctavaAlSintetizador();
        }
        return false;
    } 

    let resolveRecibido = teclasPulsadas.get(e.keyCode);
    resolveRecibido();

    teclasPulsadas.delete(e.keyCode);    
})




//===================================================================================================================
// REALIZANDO CONEXIONES ENTRE NODOS

nodoSalidaSintetizador.connect(nodoCompresorSintetizador);
nodoCompresorSintetizador.connect(nodoDeFiltro);
nodoDeFiltro.connect(nodoDistorsion);

nodoDistorsion.connect(nodoMaster);
nodoDistorsion.connect(nodoDeConvolucion);
nodoDeConvolucion.connect(nodoMaster);

nodoMaster.connect(nodoDeEco);
nodoDeEco.connect(nodoFeedbackEco);
nodoFeedbackEco.connect(nodoDeEco);
nodoDeEco.connect(nodoPaneo);

nodoMaster.connect(nodoPaneo);
nodoPaneo.connect(nodoAnalizador);
nodoPaneo.connect(ENTORNO_AUDIO.destination);
//===================================================================================================================



/*===================================================================================================================
ASIGNANDO TECLAS a NOTAS DEL SINTETIZADOR
=====================================================================================================================*/    
let C4 = new NotaSintetizador("C",4,document.getElementById('C4'),document.getElementById('C4Roll'),81);
let Csos4 = new NotaSintetizador("Csos",4,document.getElementById('Csos4'),document.getElementById('Csos4Roll'),50);
let D4 = new NotaSintetizador("D",4,document.getElementById('D4'),document.getElementById('D4Roll'),87);
let Dsos4 = new NotaSintetizador("Dsos",4,document.getElementById('Dsos4'),document.getElementById('Dsos4Roll'),51);
let E4 = new NotaSintetizador("E",4,document.getElementById('E4'),document.getElementById('E4Roll'),69);
let F4 = new NotaSintetizador("F",4,document.getElementById('F4'),document.getElementById('F4Roll'),82);
let Fsos4 = new NotaSintetizador("Fsos",4,document.getElementById('Fsos4'),document.getElementById('Fsos4Roll'),53);
let G4 = new NotaSintetizador("G",4,document.getElementById('G4'),document.getElementById('G4Roll'),84);
let Gsos4 = new NotaSintetizador("Gsos",4,document.getElementById('Gsos4'),document.getElementById('Gsos4Roll'),54);
let A4 = new NotaSintetizador("A",4,document.getElementById('A4'),document.getElementById('A4Roll'),89);
let Asos4 = new NotaSintetizador("Asos",4,document.getElementById('Asos4'),document.getElementById('Asos4Roll'),55);
let B4 = new NotaSintetizador("B",4,document.getElementById('B4'),document.getElementById('B4Roll'),85);
let C5 = new NotaSintetizador("C",5,document.getElementById('C5'),document.getElementById('C5Roll'),73);
let Csos5 = new NotaSintetizador("Csos",5,document.getElementById('Csos5'),document.getElementById('Csos5Roll'),57);
let D5 = new NotaSintetizador("D",5,document.getElementById('D5'),document.getElementById('D5Roll'),79);
let Dsos5 = new NotaSintetizador("Dsos",5,document.getElementById('Dsos5'),document.getElementById('Dsos5Roll'),48);
let E5 = new NotaSintetizador("E",5,document.getElementById('E5'),document.getElementById('E5Roll'),80);
let F5 = new NotaSintetizador("F",5,document.getElementById('F5'),document.getElementById('F5Roll'),186);
let Fsos5 = new NotaSintetizador("Fsos",5,document.getElementById('Fsos5'),document.getElementById('Fsos5Roll'),65);
let G5 = new NotaSintetizador("G",5,document.getElementById('G5'),document.getElementById('G5Roll'),187);
let Gsos5 = new NotaSintetizador("Gsos",5,document.getElementById('Gsos5'),document.getElementById('Gsos5Roll'),83);
let A5 = new NotaSintetizador("A",5,document.getElementById('A5'),document.getElementById('A5Roll'),90);
let Asos5 = new NotaSintetizador("Asos",5,document.getElementById('Asos5'),document.getElementById('Asos5Roll'),68);
let B5 = new NotaSintetizador("B",5,document.getElementById('B5'),document.getElementById('B5Roll'),88);
let C6 = new NotaSintetizador("C",6,document.getElementById('C6'),document.getElementById('C6Roll'),67);
let Csos6 = new NotaSintetizador("Csos",6,document.getElementById('Csos6'),document.getElementById('Csos6Roll'),71);
let D6 = new NotaSintetizador("D",6,document.getElementById('D6'),document.getElementById('D6Roll'),86);
let Dsos6 = new NotaSintetizador("Dsos",6,document.getElementById('Dsos6'),document.getElementById('Dsos6Roll'),72);
let E6 = new NotaSintetizador("E",6,document.getElementById('E6'),document.getElementById('E6Roll'),66);
let F6 = new NotaSintetizador("F",6,document.getElementById('F6'),document.getElementById('F6Roll'),78);
let Fsos6 = new NotaSintetizador("Fsos",6,document.getElementById('Fsos6'),document.getElementById('Fsos6Roll'),75);
let G6 = new NotaSintetizador("G",6,document.getElementById('G6'),document.getElementById('G6Roll'),77);
let Gsos6 = new NotaSintetizador("Gsos",6,document.getElementById('Gsos6'),document.getElementById('Gsos6Roll'),76);
let A6 = new NotaSintetizador("A",6,document.getElementById('A6'),document.getElementById('A6Roll'),188);
let Asos6 = new NotaSintetizador("Asos",6,document.getElementById('Asos6'),document.getElementById('Asos6Roll'),192);
let B6 = new NotaSintetizador("B",6,document.getElementById('B6'),document.getElementById('B6Roll'),190);
let C7 = new NotaSintetizador("C",7,document.getElementById('C7'),document.getElementById('C7Roll'),189);

/*===================================================================================================================
ANALIZADOR
=====================================================================================================================*/

var analizadorHTML = document.getElementById('analizador');
var contextoAnalizador = analizadorHTML.getContext('2d');
contextoAnalizador.clearRect(0,0,analizadorHTML.width,analizadorHTML.height);

/**
 * Esta funcion dibuja el sonido en el elemento canva
 * con id 'analizador'
 */
function dibujarSonido(){
    requestAnimationFrame(dibujarSonido);
    
    nodoAnalizador.getByteTimeDomainData(datosAnalizador);
    contextoAnalizador.fillStyle = 'rgb(226,225,223)';
    contextoAnalizador.fillRect(0,0,analizadorHTML.width,analizadorHTML.height);
    contextoAnalizador.lineWidth = 2;
    contextoAnalizador.strokeStyle = 'rgb(165, 161, 161)';
    contextoAnalizador.beginPath();
    var sliceWidth = analizadorHTML.width * 1.0 /bufferLength;
    var x = 0;

    for(var i =0; i < bufferLength; i++){
        var v = datosAnalizador[i]/128.0;
        var y = v * analizadorHTML.height/2;

        if(i===0){
            contextoAnalizador.moveTo(x,y);
        }else{
            contextoAnalizador.lineTo(x,y);
        }
        x += sliceWidth;
    }
    contextoAnalizador.lineTo(analizadorHTML.width,analizadorHTML.height/2);
    if(seccion_en_vista!=1) return; //Talvez deberias sacarlo
    contextoAnalizador.stroke();
};

dibujarSonido();

//===========================================================================================================
// CONTROL A CONTROLAR CON LFO APARTE DE TONO
//===========================================================================================================
const comboBoxLFO = document.getElementById('Control-a-controlar-LFO');

let requestAnimationFrameLFO;
let LFO;

let LFOgain = ENTORNO_AUDIO.createGain();
LFOgain.gain.value = LFOKnobsValues.value[1]/100;

delegarEvento('mousemove',`#${LFOKnobsValues.obtenerIDs[1]}`,()=>{
    LFOgain.gain.value = LFOKnobsValues.value[1]/100;
})

let LFOAnalizador = ENTORNO_AUDIO.createAnalyser();
LFOAnalizador.fftSize = 2048;
let dataLFO = new Uint8Array(2048);


//SE EJECUTARA UNA SOLA VEZ UNA VES QUE SE DISPARE EL EVENTO
eventoDeVariableEsDiferenteDe(this,
    `((this.datosAnalizador[${parseInt(Math.random()*100)}]+this.datosAnalizador[${parseInt(Math.random()*100)}]+this.datosAnalizador[${parseInt(Math.random()*100)}])/3)`,
    128,false,
function(){

    if(requestAnimationFrameLFO!==undefined) cancelAnimationFrame(requestAnimationFrameLFO);
    if(LFO){
        LFO.stop();
        LFO.disconnect();
        // LFO = null;
    } 

    if(comboBoxLFO.value!="tono"&&comboBoxLFO.value!="none"){

        LFO = ENTORNO_AUDIO.createOscillator();
        LFO.type = tipoOndaLFO.obtenerValor();
        delegarEvento('click',`#${tipoOndaLFO.obtenerIDs[0]},#${tipoOndaLFO.obtenerIDs[1]}`,()=>{
            setTimeout(()=>{
                LFO.type = tipoOndaLFO.obtenerValor();
            },400)
        })

        let retrasoLFO = LFOKnobsValues.value[0];

        LFO.frequency.value = LFOKnobsValues.value[2];

        delegarEvento('mousemove',`#${LFOKnobsValues.obtenerIDs[2]}`,()=>{
            LFO.frequency.value = LFOKnobsValues.value[2];
        });

        LFO.connect(LFOgain);
        LFOgain.connect(LFOAnalizador);
        LFO.start(ENTORNO_AUDIO.currentTime + retrasoLFO);

        

        function actualizandoKnobsConstantemente(){                
            LFOAnalizador.getByteTimeDomainData(dataLFO);                

            if(comboBoxLFO.value=="pan"){
                let valorPAN = ((dataLFO[0]-128))/128;
                panSintetizador.setValues([valorPAN]);
                nodoPaneo.pan.value = valorPAN;

            }else if(comboBoxLFO.value=="filtro-factor-q"){
                let valorFiltroFactorQ = (Math.abs(dataLFO[0]-128)/128)*(100);
                FiltroKnobsValues.setValues([valorFiltroFactorQ,undefined,undefined]);
                nodoDeFiltro.Q.value = valorFiltroFactorQ;

            }else if(comboBoxLFO.value=="filtro-frecuencia"){
                let valorFiltroFrecuencia = (Math.abs(dataLFO[0]-128)/128)*(FRECUENCIA_MAXIMA_FILTRO);
                FiltroKnobsValues.setValues([undefined,valorFiltroFrecuencia,undefined]);
                nodoDeFiltro.frequency.value = valorFiltroFrecuencia;
            }
            
            requestAnimationFrameLFO = requestAnimationFrame(actualizandoKnobsConstantemente);
        }

        actualizandoKnobsConstantemente();

    }
},
function(){
    setTimeout(()=>{
        if((datosAnalizador[parseInt(Math.random()*100)]+this.datosAnalizador[parseInt(Math.random()*100)]+this.datosAnalizador[parseInt(Math.random()*100)])/3==128){
            if(LFO){
                LFO.stop();        
                LFO.disconnect();        
                LFOgain.disconnect();
            }
            if(requestAnimationFrameLFO!==undefined) cancelAnimationFrame(requestAnimationFrameLFO);
        }      
    },100)

});

//===========================================================================================================
// FILTRO
//===========================================================================================================

nodoDeFiltro.type = tipoDeFiltro.obtenerValor();
delegarEvento('click',`#${tipoDeFiltro.obtenerIDs[0]},#${tipoDeFiltro.obtenerIDs[1]}`,()=>{
    setTimeout(()=>{
        nodoDeFiltro.type = tipoDeFiltro.obtenerValor();
    },400)        
})

nodoDeFiltro.Q.value = FiltroKnobsValues.value[0]/100;
delegarEvento('mousemove',`#${FiltroKnobsValues.obtenerIDs[0]}`,()=>{
    nodoDeFiltro.Q.value = FiltroKnobsValues.value[0]/100;
})

nodoDeFiltro.frequency.value = FiltroKnobsValues.value[1];
delegarEvento('mousemove',`#${FiltroKnobsValues.obtenerIDs[1]}`,()=>{
    nodoDeFiltro.frequency.value = FiltroKnobsValues.value[1];
})

nodoDeFiltro.gain.value = FiltroKnobsValues.value[2]/100;
delegarEvento('mousemove',`#${FiltroKnobsValues.obtenerIDs[2]}`,()=>{
    nodoDeFiltro.gain.value = FiltroKnobsValues.value[2]/100;
})

//===========================================================================================================
// DISTORSION
//===========================================================================================================

// barrasDistorsion.setValues([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])

for(let i = 0;i<datosCurvaDistorsion.length;i++){
    datosCurvaDistorsion[i] = barrasDistorsion.value[i];
}
nodoDistorsion.curve = datosCurvaDistorsion;

delegarEvento('mousemove',`.${barrasDistorsion.claseBarras}`,()=>{
    
    for(let i = 0;i<datosCurvaDistorsion.length;i++){
        datosCurvaDistorsion[i] = barrasDistorsion.value[i];
    }
    nodoDistorsion.curve = datosCurvaDistorsion;
})


//===========================================================================================================
// ECO
//===========================================================================================================
nodoDeEco.delayTime.value = knobsEco.value[0];

delegarEvento('mousemove',`#${knobsEco.obtenerIDs[0]}`,()=>{
    nodoDeEco.delayTime.value = knobsEco.value[0];
})

nodoFeedbackEco.gain.value = knobsEco.value[1]/100;

delegarEvento('mousemove',`#${knobsEco.obtenerIDs[1]}`,()=>{
    nodoFeedbackEco.gain.value = knobsEco.value[1]/100;
})    



//----------------------------------------------------------
// REINICIANDO EL ENTORNO DE AUDIO Y TODOS SUS COMPONENTES |
//----------------------------------------------------------

document.getElementById('boton-iniciar-sesion').addEventListener('click',()=>{    
    apagarNodosDeAudio();
})

function apagarNodosDeAudio(){
    ENTORNO_AUDIO = null;
    nodoSalidaSintetizador.disconnect();
    nodoSalidaSintetizador = null;
    nodoCompresorSintetizador.disconnect();
    nodoCompresorSintetizador = null;
    nodoADSR.disconnect();
    nodoADSR = null;
    nodoDeFiltro.disconnect();
    nodoDeFiltro = null;
    nodoDistorsion.disconnect();
    nodoDistorsion = null;
    nodoDeConvolucion.disconnect();
    nodoDeConvolucion = null;
    nodoDeEco.disconnect();
    nodoDeEco = null;
    nodoFeedbackEco.disconnect();
    nodoFeedbackEco = null;
    nodoMaster.disconnect;
    nodoMaster = null;
    nodoPaneo.disconnect();
    nodoPaneo = null;
    nodoAnalizador.disconnect();
    nodoAnalizador = null;

    ENTORNO_AUDIO = new AudioContext();
}

function prendiendoNodosDeAudio(){
    var nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
    var nodoCompresorSintetizador = ENTORNO_AUDIO.createDynamicsCompressor();
    var nodoADSR = ENTORNO_AUDIO.createGain();
    var nodoDeFiltro = ENTORNO_AUDIO.createBiquadFilter();
    var nodoDistorsion = ENTORNO_AUDIO.createWaveShaper();
    var nodoDeConvolucion = ENTORNO_AUDIO.createConvolver();
    var nodoDeEco = ENTORNO_AUDIO.createDelay();
    var nodoFeedbackEco = ENTORNO_AUDIO.createGain();
    var nodoMaster = ENTORNO_AUDIO.createGain();
    var nodoPaneo = ENTORNO_AUDIO.createStereoPanner();
    var nodoAnalizador = ENTORNO_AUDIO.createAnalyser();
    nodoAnalizador.fftSize = 2048;
    var bufferLength = nodoAnalizador.frequencyBinCount;
    var datosAnalizador = new Uint8Array(bufferLength);
}





