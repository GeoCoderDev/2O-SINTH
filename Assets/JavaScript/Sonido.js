

let frecuenciasPorTecla = [];
let teclaHTMLPorTecla = [];
let controlLFO = document.getElementById('Control-a-controlar-LFO').value;

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
            console.log("Error 35, sonido.js")
            break;
    }
}

class NotaSintetizador{

    constructor(elementoHTML,elementoHTMLPianoRoll,frecuencia,codigoTecla){
        this.elementoHTML = elementoHTML;
        this.frecuencia = frecuencia;
        this.teclaPianoRoll = elementoHTMLPianoRoll;

        frecuenciasPorTecla[codigoTecla] = this.frecuencia; 
        teclaHTMLPorTecla[codigoTecla] = this.elementoHTML;

        this.elementoHTML.addEventListener('mousedown',()=>{

            let Osciladores1 = [];
            let Osciladores2 = [];
            let desafinacionOscilador1 = datosOscilador1[2].value;
            let desafinacionOscilador2 = datosOscilador2[2].value;
                let OsciladoresLFO1 = []; 
                let OsciladoresLFO2 = [];                      
                let requestAnimationFrameLFOIDs1 = [];
                let requestAnimationFrameLFOIDs2 = [];

            for(let i=0; i<datosOscilador1[1].value;i++){
                
                Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores1[i].frequency.value = this.frecuencia;
                Osciladores1[i].type = datosOscilador1[0].obtenerValor();

                    function actualizarTipoOndaEnTiempoReal(){
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores1.length;n++){
                                Osciladores1[n].type = datosOscilador1[0].obtenerValor();
                            }
                        },400);
                    }

                    document.getElementById(tipoOndaOSC1.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                    document.getElementById(tipoOndaOSC1.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);


                let funcionesActualizacionValoresDetune = [];
                let LFOgains = [];
                let AnalizadoresLFO = [];
                let arraysValoresOsciladorLFO = [];  

                if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                    //Creando un nodo de ganancia por Oscilador LFO
                    LFOgains[i] = ENTORNO_AUDIO.createGain();

                        LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                        
                        //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                            for(let k=0;k<LFOgains.length;k++){     
                                LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                            }     
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                        
                    AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                        AnalizadoresLFO[i].fftSize = 2048;
                        arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                    OsciladoresLFO1[i] = ENTORNO_AUDIO.createOscillator();

                        OsciladoresLFO1[i].frequency.value = LFOKnobsValues.value[2];

                        // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                            for(let u=0;u<OsciladoresLFO1.length;u++){
                                OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                            }
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);

                        OsciladoresLFO1[i].type = tipoOndaLFO.obtenerValor();

                        function actualizarTipoOndaLFOEnTiempoReal(){
                            setTimeout(()=>{
                                for(let n=0;n<Osciladores1.length;n++){
                                    OsciladoresLFO1[n].type = datosOscilador1[0].obtenerValor();
                                }
                            },400);
                        }
        
                        document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                        document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);

                        OsciladoresLFO1[i].connect(LFOgains[i]);
                        LFOgains[i].connect(AnalizadoresLFO[i]);

                        let retrasoLFO = LFOKnobsValues.value[0];
                        
                        OsciladoresLFO1[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                        funcionesActualizacionValoresDetune[i] = function(){

                            requestAnimationFrameLFOIDs1[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                            
                            //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                            AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);

                            let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);

                            if(!i==0){         
                                if(i%2==0){
                                    valorInicial -= desafinacionOscilador1;
                                }else{
                                    valorInicial += desafinacionOscilador1;
                                }             
                                
                                desafinacionOscilador1 = desafinacionOscilador1/2;                                
                                
                            }

                            if(valorInicial<-255){
                                valorInicial = -255;
                            }else if(valorInicial>255){
                                valorInicial = 255;
                            }

                            Osciladores1[i].detune.value = valorInicial;
                        }

                        funcionesActualizacionValoresDetune[i]();

                }else{  //SI EL LFO NO CONTROLARA EL TONO

                    if(i==0){
                        Osciladores1[i].detune.value = 0;
                    }else{
                        
                        
                        if(i%2!=0){
                            Osciladores1[i].detune.value = desafinacionOscilador1;
                        }else{
                            Osciladores1[i].detune.value = -desafinacionOscilador1;
                        }
                        desafinacionOscilador1 = desafinacionOscilador1/2;
                        
                        
                    }    
                    
                }

                Osciladores1[i].start();
                Osciladores1[i].connect(nodoSalidaSintetizador);
                
            }
    
            for(let i=0; i<datosOscilador2[1].value;i++){
                    
                    Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                    Osciladores2[i].frequency.value = this.frecuencia;
                    Osciladores2[i].type = datosOscilador2[0].obtenerValor();
    
                        function actualizarTipoOndaEnTiempoReal(){
                            setTimeout(()=>{
                                for(let n=0;n<Osciladores2.length;n++){
                                    Osciladores2[n].type = datosOscilador2[0].obtenerValor();
                                }
                            },400);
                        }
    
                        document.getElementById(tipoOndaOSC2.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                        document.getElementById(tipoOndaOSC2.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
    
    
                    let funcionesActualizacionValoresDetune = [];
                    let LFOgains = [];
                    let AnalizadoresLFO = [];
                    let arraysValoresOsciladorLFO = [];  
    
                    if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO
    
                        //Creando un nodo de ganancia por Oscilador LFO
                        LFOgains[i] = ENTORNO_AUDIO.createGain();
    
                            LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                            
                            //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                            agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                                for(let k=0;k<LFOgains.length;k++){     
                                    LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                                }     
                            },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                            
                        AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                            AnalizadoresLFO[i].fftSize = 2048;
                            arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                        OsciladoresLFO2[i] = ENTORNO_AUDIO.createOscillator();
    
                            OsciladoresLFO2[i].frequency.value = LFOKnobsValues.value[2];
    
                            // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                            agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                                for(let u=0;u<OsciladoresLFO1.length;u++){
                                    OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                                }
                            },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
    
                            OsciladoresLFO2[i].type = tipoOndaLFO.obtenerValor();
    
                            function actualizarTipoOndaLFOEnTiempoReal(){
                                setTimeout(()=>{
                                    for(let n=0;n<Osciladores1.length;n++){
                                        OsciladoresLFO2[n].type = datosOscilador2[0].obtenerValor();
                                    }
                                },400);
                            }
            
                            document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                            document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
    
                            OsciladoresLFO2[i].connect(LFOgains[i]);
                            LFOgains[i].connect(AnalizadoresLFO[i]);
    
                            let retrasoLFO = LFOKnobsValues.value[0];
                            
                            OsciladoresLFO2[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);
    
                            funcionesActualizacionValoresDetune[i] = function(){
    
                                requestAnimationFrameLFOIDs2[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                                
                                //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                                AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);
    
                                let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);
    
                                if(!i==0){         
                                    if(i%2==0){
                                        valorInicial -= desafinacionOscilador2;
                                    }else{
                                        valorInicial += desafinacionOscilador2;
                                    }             
                                    
                                    desafinacionOscilador2 = desafinacionOscilador2/2;                                
                                    
                                }
    
                                if(valorInicial<-255){
                                    valorInicial = -255;
                                }else if(valorInicial>255){
                                    valorInicial = 255;
                                }
    
                                Osciladores2[i].detune.value = valorInicial;
                            }
    
                            funcionesActualizacionValoresDetune[i]();
    
                    }else{  //SI EL LFO NO CONTROLARA EL TONO
    
                        if(i==0){
                            Osciladores2[i].detune.value = 0;
                        }else{
                            
                            
                            if(i%2!=0){
                                Osciladores2[i].detune.value = desafinacionOscilador2;
                            }else{
                                Osciladores2[i].detune.value = -desafinacionOscilador2;
                            }
                            desafinacionOscilador2 = desafinacionOscilador2/2;
                            
                            
                        }    
                        
                    }
    
                    Osciladores2[i].start();
                    Osciladores2[i].connect(nodoSalidaSintetizador);
            }

  
            //INICIANDO AMPLIFICADOR ADSR

            nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
            let horaInicioPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
            let duracionAtaque = (getADSRvalues("A")/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
            let finalAtaque = horaInicioPresionDeUnaNota + duracionAtaque;
            let duracionDecay = (getADSRvalues("D")/100)*MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
            //Ataque
            nodoADSR.gain.setValueAtTime(0,horaInicioPresionDeUnaNota);
            nodoADSR.gain.linearRampToValueAtTime(0.5,finalAtaque);
            //Decay + Sustain
            nodoADSR.gain.setTargetAtTime((getADSRvalues("S"))/100,finalAtaque,duracionDecay);

            let yaSeSoltoLaTecla = false;

            this.elementoHTML.addEventListener('mouseup',()=>{

                if(yaSeSoltoLaTecla) return false;

                yaSeSoltoLaTecla = false;

                let volumenAntesDeSoltar = nodoADSR.gain.value;

                nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
                let horaFinalPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
                let duracionRelease = ((getADSRvalues("R"))/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
                let finalRelease = horaFinalPresionDeUnaNota + duracionRelease;
                nodoADSR.gain.setValueAtTime(volumenAntesDeSoltar,horaFinalPresionDeUnaNota);
                nodoADSR.gain.linearRampToValueAtTime(0,finalRelease);
    
                    setTimeout(function(){

                        for(let i=0; i<Osciladores1.length;i++){
                            Osciladores1[i].stop();
                            if(OsciladoresLFO1[i]) OsciladoresLFO1[i].stop();                         
                            if(requestAnimationFrameLFOIDs1[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs1[i]);  

                        }
                
                        for(let i=0; i<Osciladores2.length;i++){
                            Osciladores2[i].stop();
                            if(OsciladoresLFO2[i]) OsciladoresLFO2[i].stop();                              
                            if(requestAnimationFrameLFOIDs2[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs2[i]);  
                        }

                    },duracionRelease*1000);
                
            })

            this.elementoHTML.addEventListener('mouseout',()=>{

                if(yaSeSoltoLaTecla) return false;

                yaSeSoltoLaTecla = false;

                let volumenAntesDeSoltar = nodoADSR.gain.value;

                nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
                let horaFinalPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
                let duracionRelease = ((getADSRvalues("R"))/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
                let finalRelease = horaFinalPresionDeUnaNota + duracionRelease;
                nodoADSR.gain.setValueAtTime(volumenAntesDeSoltar,horaFinalPresionDeUnaNota);
                nodoADSR.gain.linearRampToValueAtTime(0,finalRelease);
    
                    setTimeout(function(){

                        for(let i=0; i<Osciladores1.length;i++){
                            Osciladores1[i].stop();
                            if(OsciladoresLFO1[i]) OsciladoresLFO1[i].stop();                         
                            if(requestAnimationFrameLFOIDs1[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs1[i]);  

                        }
                
                        for(let i=0; i<Osciladores2.length;i++){
                            Osciladores2[i].stop();
                            if(OsciladoresLFO2[i]) OsciladoresLFO2[i].stop();                              
                            if(requestAnimationFrameLFOIDs2[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs2[i]);  
                        }

                    },duracionRelease*1000);

            })

        })

    }

    hacerSonarNota(duracion){
        
        let Osciladores1 = [];
        let Osciladores2 = [];
        let desafinacionOscilador1 = datosOscilador1[2].value;
        let desafinacionOscilador2 = datosOscilador2[2].value;
            let OsciladoresLFO1 = []; 
            let OsciladoresLFO2 = [];                      
            let requestAnimationFrameLFOIDs1 = [];
            let requestAnimationFrameLFOIDs2 = [];

        for(let i=0; i<datosOscilador1[1].value;i++){
            
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = this.frecuencia;
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();

                function actualizarTipoOndaEnTiempoReal(){
                    setTimeout(()=>{
                        for(let n=0;n<Osciladores1.length;n++){
                            Osciladores1[n].type = datosOscilador1[0].obtenerValor();
                        }
                    },400);
                }

                document.getElementById(tipoOndaOSC1.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                document.getElementById(tipoOndaOSC1.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);


            let funcionesActualizacionValoresDetune = [];
            let LFOgains = [];
            let AnalizadoresLFO = [];
            let arraysValoresOsciladorLFO = [];  

            if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                //Creando un nodo de ganancia por Oscilador LFO
                LFOgains[i] = ENTORNO_AUDIO.createGain();

                    LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                    
                    //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                    agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                        for(let k=0;k<LFOgains.length;k++){     
                            LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                        }     
                    },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                    
                AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                    AnalizadoresLFO[i].fftSize = 2048;
                    arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                OsciladoresLFO1[i] = ENTORNO_AUDIO.createOscillator();

                    OsciladoresLFO1[i].frequency.value = LFOKnobsValues.value[2];

                    // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                    agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                        for(let u=0;u<OsciladoresLFO1.length;u++){
                            OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                        }
                    },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);

                    OsciladoresLFO1[i].type = tipoOndaLFO.obtenerValor();

                    function actualizarTipoOndaLFOEnTiempoReal(){
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores1.length;n++){
                                OsciladoresLFO1[n].type = datosOscilador1[0].obtenerValor();
                            }
                        },400);
                    }
    
                    document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                    document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);

                    OsciladoresLFO1[i].connect(LFOgains[i]);
                    LFOgains[i].connect(AnalizadoresLFO[i]);

                    let retrasoLFO = LFOKnobsValues.value[0];
                    
                    OsciladoresLFO1[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                    funcionesActualizacionValoresDetune[i] = function(){

                        requestAnimationFrameLFOIDs1[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                        
                        //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                        AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);

                        let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);

                        if(!i==0){         
                            if(i%2==0){
                                valorInicial -= desafinacionOscilador1;
                            }else{
                                valorInicial += desafinacionOscilador1;
                            }             
                            
                            desafinacionOscilador1 = desafinacionOscilador1/2;                                
                            
                        }

                        if(valorInicial<-255){
                            valorInicial = -255;
                        }else if(valorInicial>255){
                            valorInicial = 255;
                        }

                        Osciladores1[i].detune.value = valorInicial;
                    }

                    funcionesActualizacionValoresDetune[i]();

            }else{  //SI EL LFO NO CONTROLARA EL TONO

                if(i==0){
                    Osciladores1[i].detune.value = 0;
                }else{
                    
                    
                    if(i%2!=0){
                        Osciladores1[i].detune.value = desafinacionOscilador1;
                    }else{
                        Osciladores1[i].detune.value = -desafinacionOscilador1;
                    }
                    desafinacionOscilador1 = desafinacionOscilador1/2;
                    
                    
                }    
                
            }

            Osciladores1[i].start();
            Osciladores1[i].connect(nodoSalidaSintetizador);
            
        }

        for(let i=0; i<datosOscilador2[1].value;i++){
                
                Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores2[i].frequency.value = this.frecuencia;
                Osciladores2[i].type = datosOscilador2[0].obtenerValor();

                    function actualizarTipoOndaEnTiempoReal(){
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores2.length;n++){
                                Osciladores2[n].type = datosOscilador2[0].obtenerValor();
                            }
                        },400);
                    }

                    document.getElementById(tipoOndaOSC2.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                    document.getElementById(tipoOndaOSC2.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);


                let funcionesActualizacionValoresDetune = [];
                let LFOgains = [];
                let AnalizadoresLFO = [];
                let arraysValoresOsciladorLFO = [];  

                if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                    //Creando un nodo de ganancia por Oscilador LFO
                    LFOgains[i] = ENTORNO_AUDIO.createGain();

                        LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                        
                        //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                            for(let k=0;k<LFOgains.length;k++){     
                                LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                            }     
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                        
                    AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                        AnalizadoresLFO[i].fftSize = 2048;
                        arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                    OsciladoresLFO2[i] = ENTORNO_AUDIO.createOscillator();

                        OsciladoresLFO2[i].frequency.value = LFOKnobsValues.value[2];

                        // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                            for(let u=0;u<OsciladoresLFO1.length;u++){
                                OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                            }
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);

                        OsciladoresLFO2[i].type = tipoOndaLFO.obtenerValor();

                        function actualizarTipoOndaLFOEnTiempoReal(){
                            setTimeout(()=>{
                                for(let n=0;n<Osciladores1.length;n++){
                                    OsciladoresLFO2[n].type = datosOscilador2[0].obtenerValor();
                                }
                            },400);
                        }
        
                        document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                        document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);

                        OsciladoresLFO2[i].connect(LFOgains[i]);
                        LFOgains[i].connect(AnalizadoresLFO[i]);

                        let retrasoLFO = LFOKnobsValues.value[0];
                        
                        OsciladoresLFO2[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                        funcionesActualizacionValoresDetune[i] = function(){

                            requestAnimationFrameLFOIDs2[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                            
                            //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                            AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);

                            let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);

                            if(!i==0){         
                                if(i%2==0){
                                    valorInicial -= desafinacionOscilador2;
                                }else{
                                    valorInicial += desafinacionOscilador2;
                                }             
                                
                                desafinacionOscilador2 = desafinacionOscilador2/2;                                
                                
                            }

                            if(valorInicial<-255){
                                valorInicial = -255;
                            }else if(valorInicial>255){
                                valorInicial = 255;
                            }

                            Osciladores2[i].detune.value = valorInicial;
                        }

                        funcionesActualizacionValoresDetune[i]();

                }else{  //SI EL LFO NO CONTROLARA EL TONO

                    if(i==0){
                        Osciladores2[i].detune.value = 0;
                    }else{
                        
                        
                        if(i%2!=0){
                            Osciladores2[i].detune.value = desafinacionOscilador2;
                        }else{
                            Osciladores2[i].detune.value = -desafinacionOscilador2;
                        }
                        desafinacionOscilador2 = desafinacionOscilador2/2;
                        
                        
                    }    
                    
                }

                Osciladores2[i].start();
                Osciladores2[i].connect(nodoSalidaSintetizador);
        }

        nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
        let horaInicioPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
        let duracionAtaque = (getADSRvalues("A")/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
        let finalAtaque = horaInicioPresionDeUnaNota + duracionAtaque;
        let duracionDecay = (getADSRvalues("D")/100)*MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
        //Ataque
        nodoADSR.gain.setValueAtTime(0,horaInicioPresionDeUnaNota);
        nodoADSR.gain.linearRampToValueAtTime(0.5,finalAtaque);
        //Decay + Sustain
        nodoADSR.gain.setTargetAtTime((getADSRvalues("S"))/100,finalAtaque,duracionDecay);

        this.elementoHTML.classList.add('tecla_blanca_pulsada');

        let duracionRelease = ((getADSRvalues("R"))/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;

        setTimeout(()=>{

            let volumenAntesDeSoltar = nodoADSR.gain.value;

            nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
            let horaFinalPresionDeUnaNota = ENTORNO_AUDIO.currentTime;            
            let finalRelease = horaFinalPresionDeUnaNota + duracionRelease;
            nodoADSR.gain.setValueAtTime(volumenAntesDeSoltar,horaFinalPresionDeUnaNota);
            nodoADSR.gain.linearRampToValueAtTime(0,finalRelease);

            this.elementoHTML.classList.remove('tecla_blanca_pulsada');

        },duracion*990)

        setTimeout(()=>{

            for(let i=0;i<Osciladores1.length;i++){
                Osciladores1[i].stop();
                if(OsciladoresLFO1[i]) OsciladoresLFO1[i].stop();                         
                if(requestAnimationFrameLFOIDs1[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs1[i]);  
            }

            for(let i=0;i<Osciladores2.length;i++){
                Osciladores2[i].stop();
                if(OsciladoresLFO2[i]) OsciladoresLFO2[i].stop();                         
                if(requestAnimationFrameLFOIDs2[i]) cancelAnimationFrame(requestAnimationFrameLFOIDs2[i]);  
            }

        },(duracion*990)+(duracionRelease*1000))
        
    }

}


//EVENTO DE TECLADO PARA SINTETIZADOR DE VARIAS TECLAS CON UN OBJETO MAP

var seRealizoUnRecorridoYa = false;        //Bandera para ejecutar una sola vez el evento de keydown
                                            //Esto lo hacemos porque cuando se mantiene una tecla presionada
                                            //Por mas de aprox. 1 segundo el evento se empieza a disparar varias
                                            //Veces por segundo.

let teclasPulsadas = new Map();


window.addEventListener('keydown',(e)=>{

    //Comprobando si la tecla pulsada se encuentra en nuestra lista de teclas pulsadas
    //para agregarla
    if(!(!teclasPulsadas.has(e.keyCode) && frecuenciasPorTecla[e.keyCode])){
        return false;
    }

    if(seccion_en_vista==1||seccion_en_vista==2){

        let Osciladores1 = [];
        let Osciladores2 = [];
        let desafinacionOscilador1 = datosOscilador1[2].value;
        let desafinacionOscilador2 = datosOscilador2[2].value;
        let OsciladoresLFO1 = []; 
        let OsciladoresLFO2 = [];                      
        let requestAnimationFrameLFOIDs1 = [];
        let requestAnimationFrameLFOIDs2 = [];

        for(let i=0; i<datosOscilador1[1].value;i++){
            
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = frecuenciasPorTecla[e.keyCode];
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();

                function actualizarTipoOndaEnTiempoReal(){
                    setTimeout(()=>{
                        for(let n=0;n<Osciladores1.length;n++){
                            Osciladores1[n].type = datosOscilador1[0].obtenerValor();
                        }
                    },400);
                }

                document.getElementById(tipoOndaOSC1.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                document.getElementById(tipoOndaOSC1.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);


            let funcionesActualizacionValoresDetune = [];
            let LFOgains = [];
            let AnalizadoresLFO = [];
            let arraysValoresOsciladorLFO = [];  

            if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                //Creando un nodo de ganancia por Oscilador LFO
                LFOgains[i] = ENTORNO_AUDIO.createGain();

                    LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                    
                    //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                    agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                        for(let k=0;k<LFOgains.length;k++){     
                            LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                        }     
                    },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                    
                AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                    AnalizadoresLFO[i].fftSize = 2048;
                    arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                OsciladoresLFO1[i] = ENTORNO_AUDIO.createOscillator();

                    OsciladoresLFO1[i].frequency.value = LFOKnobsValues.value[2];

                    // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                    agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                        for(let u=0;u<OsciladoresLFO1.length;u++){
                            OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                        }
                    },true,[waitEvent(window,"keyup")]);

                    OsciladoresLFO1[i].type = tipoOndaLFO.obtenerValor();

                    function actualizarTipoOndaLFOEnTiempoReal(){
                        setTimeout(()=>{
                            for(let n=0;n<OsciladoresLFO1.length;n++){
                                OsciladoresLFO1[n].type = datosOscilador1[0].obtenerValor();
                            }
                        },400);
                    }
    
                    document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                    document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);

                    OsciladoresLFO1[i].connect(LFOgains[i]);
                    LFOgains[i].connect(AnalizadoresLFO[i]);

                    let retrasoLFO = LFOKnobsValues.value[0];
                    
                    OsciladoresLFO1[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                    funcionesActualizacionValoresDetune[i] = function(){

                        requestAnimationFrameLFOIDs1[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                        
                        //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                        AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);

                        let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);

                        if(!i==0){         
                            if(i%2==0){
                                valorInicial -= desafinacionOscilador1;
                            }else{
                                valorInicial += desafinacionOscilador1;
                            }             
                            
                            desafinacionOscilador1 = desafinacionOscilador1/2;                                
                            
                        }

                        if(valorInicial<-255){
                            valorInicial = -255;
                        }else if(valorInicial>255){
                            valorInicial = 255;
                        }

                        Osciladores1[i].detune.value = valorInicial;
                    }

                    funcionesActualizacionValoresDetune[i]();

            }else{  //SI EL LFO NO CONTROLARA EL TONO

                if(i==0){
                    Osciladores1[i].detune.value = 0;
                }else{
                    
                    
                    if(i%2!=0){
                        Osciladores1[i].detune.value = desafinacionOscilador1;
                    }else{
                        Osciladores1[i].detune.value = -desafinacionOscilador1;
                    }
                    desafinacionOscilador1 = desafinacionOscilador1/2;
                    
                    
                }    
                
            }

            Osciladores1[i].start();
            Osciladores1[i].connect(nodoSalidaSintetizador);
            
        }

        for(let i=0; i<datosOscilador2[1].value;i++){
                
                Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores2[i].frequency.value = frecuenciasPorTecla[e.keyCode];
                Osciladores2[i].type = datosOscilador2[0].obtenerValor();

                    function actualizarTipoOndaEnTiempoReal(){
                        setTimeout(()=>{
                            for(let n=0;n<Osciladores2.length;n++){
                                Osciladores2[n].type = datosOscilador2[0].obtenerValor();
                            }
                        },400);
                    }

                    document.getElementById(tipoOndaOSC2.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaEnTiempoReal);
                    document.getElementById(tipoOndaOSC2.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaEnTiempoReal);


                let funcionesActualizacionValoresDetune = [];
                let LFOgains = [];
                let AnalizadoresLFO = [];
                let arraysValoresOsciladorLFO = [];  

                if(controlLFO=="tono"){ //SI EL LFO CONTROLARA EL TONO

                    //Creando un nodo de ganancia por Oscilador LFO
                    LFOgains[i] = ENTORNO_AUDIO.createGain();

                        LFOgains[i].gain.value = LFOKnobsValues.value[1]/100; //Inicializando la Amplitud
                        
                        //Colocando a todos los LFOs sus nuevos valores de ganancias                              
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                            for(let k=0;k<LFOgains.length;k++){     
                                LFOgains[k].gain.value = LFOKnobsValues.value[1]/100;
                            }     
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);
                        
                    AnalizadoresLFO[i] = ENTORNO_AUDIO.createAnalyser();
                        AnalizadoresLFO[i].fftSize = 2048;
                        arraysValoresOsciladorLFO[i] = new Uint8Array(2048);                        
                    OsciladoresLFO2[i] = ENTORNO_AUDIO.createOscillator();

                        OsciladoresLFO2[i].frequency.value = LFOKnobsValues.value[2];

                        // EVENTO DE PARA ACTUALIZAR LA VELOCIDAD LFO EN VIVO
                        agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                            for(let u=0;u<OsciladoresLFO1.length;u++){
                                OsciladoresLFO1[u].frequency.value = LFOKnobsValues.value[2];
                            }
                        },true,[waitEvent(this.elementoHTML,"mouseup"),waitEvent(this.elementoHTML,"mouseout")]);

                        OsciladoresLFO2[i].type = tipoOndaLFO.obtenerValor();

                        function actualizarTipoOndaLFOEnTiempoReal(){
                            setTimeout(()=>{
                                for(let n=0;n<OsciladoresLFO2.length;n++){
                                    OsciladoresLFO2[n].type = datosOscilador2[0].obtenerValor();
                                }
                            },400);
                        }
        
                        document.getElementById(tipoOndaLFO.obtenerIDs[0]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);
                        document.getElementById(tipoOndaLFO.obtenerIDs[1]).addEventListener('click',actualizarTipoOndaLFOEnTiempoReal);

                        OsciladoresLFO2[i].connect(LFOgains[i]);
                        LFOgains[i].connect(AnalizadoresLFO[i]);

                        let retrasoLFO = LFOKnobsValues.value[0];
                        
                        OsciladoresLFO2[i].start(ENTORNO_AUDIO.currentTime + retrasoLFO);

                        funcionesActualizacionValoresDetune[i] = function(){

                            requestAnimationFrameLFOIDs2[i] = requestAnimationFrame(funcionesActualizacionValoresDetune[i]);
                            
                            //OBTENIENDO VALORES DEL ANALIZADOR EN NUESTRO ARRAY
                            AnalizadoresLFO[i].getByteTimeDomainData(arraysValoresOsciladorLFO[i]);

                            let valorInicial = (((arraysValoresOsciladorLFO[i][0]-128)*200)/256);

                            if(!i==0){         
                                if(i%2==0){
                                    valorInicial -= desafinacionOscilador2;
                                }else{
                                    valorInicial += desafinacionOscilador2;
                                }             
                                
                                desafinacionOscilador2 = desafinacionOscilador2/2;                                
                                
                            }

                            if(valorInicial<-255){
                                valorInicial = -255;
                            }else if(valorInicial>255){
                                valorInicial = 255;
                            }

                            Osciladores2[i].detune.value = valorInicial;
                        }

                        funcionesActualizacionValoresDetune[i]();

                }else{  //SI EL LFO NO CONTROLARA EL TONO

                    if(i==0){
                        Osciladores2[i].detune.value = 0;
                    }else{
                        
                        
                        if(i%2!=0){
                            Osciladores2[i].detune.value = desafinacionOscilador2;
                        }else{
                            Osciladores2[i].detune.value = -desafinacionOscilador2;
                        }
                        desafinacionOscilador2 = desafinacionOscilador2/2;
                        
                        
                    }    
                    
                }

                Osciladores2[i].start();
                Osciladores2[i].connect(nodoSalidaSintetizador);
        }
        //INICIANDO AMPLIFICADOR ADSR

        nodoADSR.gain.cancelScheduledValues(ENTORNO_AUDIO.currentTime);
        let horaInicioPresionDeUnaNota = ENTORNO_AUDIO.currentTime;
        let duracionAtaque = (getADSRvalues("A")/100)* MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
        let finalAtaque = horaInicioPresionDeUnaNota + duracionAtaque;
        let duracionDecay = (getADSRvalues("D")/100)*MAXIMO_TIEMPO_DURACION_PARAMETROS_ADSR;
        //Ataque
        nodoADSR.gain.setValueAtTime(0,horaInicioPresionDeUnaNota);
        nodoADSR.gain.linearRampToValueAtTime(0.5,finalAtaque);
        //Decay + Sustain
        nodoADSR.gain.setTargetAtTime((getADSRvalues("S"))/100,finalAtaque,duracionDecay);

        teclaHTMLPorTecla[e.keyCode].classList.add('tecla_blanca_pulsada');  
    
        teclasPulsadas.set(e.keyCode,[[Osciladores1,Osciladores2,OsciladoresLFO1,OsciladoresLFO2],[requestAnimationFrameLFOIDs1,requestAnimationFrameLFOIDs2]]);

    }        

})

let teclasApagandose = new Map();

window.addEventListener('keyup',(e)=>{

    if(!teclasPulsadas.has(e.keyCode)) return false;

    let osciladores = teclasPulsadas.get(e.keyCode)[0];
    let requestAnimationFramesIDs = teclasPulsadas.get(e.keyCode)[1]

    for(let u=0;u<4;u++){
        for(let i=0; i<osciladores[u].length;i++){
            osciladores[u][i].stop();
        }        
    };

    for(let v=0;v<requestAnimationFramesIDs.length;v++){
        for(let w=0;w<requestAnimationFramesIDs[v].length;w++){
            cancelAnimationFrame(requestAnimationFramesIDs[v][w]);
        }
    }


    teclaHTMLPorTecla[e.keyCode].classList.remove('tecla_blanca_pulsada');

    teclasPulsadas.delete(e.keyCode);    
})

// REALIZANDO CONEXIONES ENTRE NODOS PARTE 1
nodoSalidaSintetizador.connect(nodoCompresorSintetizador);
nodoCompresorSintetizador.connect(nodoADSR);
nodoADSR.connect(nodoMaster);
// LFO.connect(LFOgain);
// LFOgain.connect(nodoMaster)

// LOW FRECUENCY OSCILLATOR



// REALIZANDO CONEXIONES ENTRE NODOS PARTE 2

nodoMaster.connect(nodoPaneo);
nodoPaneo.connect(ENTORNO_AUDIO.destination);


window.onload = function(){

    /*===================================================================================================================
    ASIGNANDO TECLAS a NOTAS DEL SINTETIZADOR
    =====================================================================================================================*/    
    let C4 = new NotaSintetizador(document.getElementById('C4'),document.getElementById('C4Roll'),261.626,81);
    let Csos4 = new NotaSintetizador(document.getElementById('Csos4'),document.getElementById('Csos4Roll'),277.183,50);
    let D4 = new NotaSintetizador(document.getElementById('D4'),document.getElementById('D4Roll'),293.665,87);
    let Dsos4 = new NotaSintetizador(document.getElementById('Dsos4'),document.getElementById('Dsos4Roll'),311.127,51);
    let E4 = new NotaSintetizador(document.getElementById('E4'),document.getElementById('E4Roll'),329.628,69);
    let F4 = new NotaSintetizador(document.getElementById('F4'),document.getElementById('F4Roll'),349.228,82);
    let Fsos4 = new NotaSintetizador(document.getElementById('Fsos4'),document.getElementById('Fsos4Roll'),369.994,53);
    let G4 = new NotaSintetizador(document.getElementById('G4'),document.getElementById('G4Roll'),391.995,84);
    let Gsos4 = new NotaSintetizador(document.getElementById('Gsos4'),document.getElementById('Gsos4Roll'),415.305,54);
    let A4 = new NotaSintetizador(document.getElementById('A4'),document.getElementById('A4Roll'),440,89);
    let Asos4 = new NotaSintetizador(document.getElementById('Asos4'),document.getElementById('Asos4Roll'),466.164,55);
    let B4 = new NotaSintetizador(document.getElementById('B4'),document.getElementById('B4Roll'),493.883,85);
    let C5 = new NotaSintetizador(document.getElementById('C5'),document.getElementById('C5Roll'),523.251,73);
    let Csos5 = new NotaSintetizador(document.getElementById('Csos5'),document.getElementById('Csos5Roll'),554.365,57);
    let D5 = new NotaSintetizador(document.getElementById('D5'),document.getElementById('D5Roll'),587.330,79);
    let Dsos5 = new NotaSintetizador(document.getElementById('Dsos5'),document.getElementById('Dsos5Roll'),622.254,48);
    let E5 = new NotaSintetizador(document.getElementById('E5'),document.getElementById('E5Roll'),659.255,80);
    let F5 = new NotaSintetizador(document.getElementById('F5'),document.getElementById('F5Roll'),698.456,186);
    let Fsos5 = new NotaSintetizador(document.getElementById('Fsos5'),document.getElementById('Fsos5Roll'),739.989,221);
    let G5 = new NotaSintetizador(document.getElementById('G5'),document.getElementById('G5Roll'),783.991,90);
    let Gsos5 = new NotaSintetizador(document.getElementById('Gsos5'),document.getElementById('Gsos5Roll'),830.609,83);
    let A5 = new NotaSintetizador(document.getElementById('A5'),document.getElementById('A5Roll'),880,88);
    let Asos5 = new NotaSintetizador(document.getElementById('Asos5'),document.getElementById('Asos5Roll'),932.328,68);
    let B5 = new NotaSintetizador(document.getElementById('B5'),document.getElementById('B5Roll'),987.767,67);
    let C6 = new NotaSintetizador(document.getElementById('C6'),document.getElementById('C6Roll'),1046.5,86);
    let Csos6 = new NotaSintetizador(document.getElementById('Csos6'),document.getElementById('Csos6Roll'),1108.73,71);
    let D6 = new NotaSintetizador(document.getElementById('D6'),document.getElementById('D6Roll'),1174.66,66);
    let Dsos6 = new NotaSintetizador(document.getElementById('Dsos6'),document.getElementById('Dsos6Roll'),1244.51,72);
    let E6 = new NotaSintetizador(document.getElementById('E6'),document.getElementById('E6Roll'),1318.51,78);
    let F6 = new NotaSintetizador(document.getElementById('F6'),document.getElementById('F6Roll'),1396.91,77);
    let Fsos6 = new NotaSintetizador(document.getElementById('Fsos6'),document.getElementById('Fsos6Roll'),1479.98,75);
    let G6 = new NotaSintetizador(document.getElementById('G6'),document.getElementById('G6Roll'),1567.98,188);
    let Gsos6 = new NotaSintetizador(document.getElementById('Gsos6'),document.getElementById('Gsos6Roll'),1661.22,76);
    let A6 = new NotaSintetizador(document.getElementById('A6'),document.getElementById('A6Roll'),1760,190);
    let Asos6 = new NotaSintetizador(document.getElementById('Asos6'),document.getElementById('Asos6Roll'),1864.66,192);
    let B6 = new NotaSintetizador(document.getElementById('B6'),document.getElementById('B6Roll'),1975.53,189);
    let C7 = new NotaSintetizador(document.getElementById('C7'),document.getElementById('C7Roll'),2093,16);

    /*===================================================================================================================
    ANALIZADOR
    =====================================================================================================================*/

    nodoMaster.connect(nodoAnalizador);

    var analizadorHTML = document.getElementById('analizador');
    var contextoAnalizador = analizadorHTML.getContext('2d');
    contextoAnalizador.clearRect(0,0,analizadorHTML.width,analizadorHTML.height);

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
        contextoAnalizador.stroke();
    };

    dibujarSonido();

    //===========================================================================================================
    // CONTROL A CONTROLAR CON LFO
    //===========================================================================================================
    const comboBoxLFO = document.getElementById('Control-a-controlar-LFO');

    let requestAnimationKNOBS;

    comboBoxLFO.addEventListener('change',(e)=>{
        controlLFO = e.target.value;

        if(requestAnimationKNOBS) cancelAnimationFrame(requestAnimationKNOBS);

        if (controlLFO=="pan"){

            let LFOpan = ENTORNO_AUDIO.createOscillator();
                LFOpan.frequency.value = LFOKnobsValues.value[2];

                agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[2],"mousemove",()=>{
                    LFOpan.frequency.value = LFOKnobsValues.value[2];
                },true);
                
                let LFOpanGain = ENTORNO_AUDIO.createGain();
                LFOpanGain.gain.value = LFOKnobsValues.value[1];
                agregarEventoLuegoQueSeCreeUnElementoHTML(LFOKnobsValues.obtenerIDs[1],"mousemove",()=>{
                    LFOpanGain.gain.value = LFOKnobsValues.value[1];
                },true);

                let LFOAnalizador = ENTORNO_AUDIO.createAnalyser();
                LFOAnalizador.fftSize = 2048;
                let dataLFO = new Uint8Array(2048);
                
            LFOpan.connect(LFOpanGain);
            LFOpanGain.connect(LFOAnalizador);
            
            let retrasoLFO = LFOKnobsValues.value[0];
            
            waitVariablePropertyValueDifferentTo(this,`datosAnalizador[${parseInt(Math.random()*2048-2)}]`,128)
                .then(()=>{
                    LFOpan.start(ENTORNO_AUDIO.currentTime + retrasoLFO);
                })

            eventoDeVariableEsDiferenteDe(this,`datosAnalizador[${parseInt(Math.random()*2048-2)}]`,128,true,
            function(){        

                LFOAnalizador.getByteTimeDomainData(dataLFO);
                let valorPAN = ((dataLFO[0]-128))/128;
                panSintetizador.setValues([valorPAN]);
                nodoPaneo.pan.value = valorPAN;
            },
            function(){
                LFOpan.stop();
                nodoPaneo.pan.value += 0; 
            })


        }

    })





    // setTimeout(()=>{
    //     C4.hacerSonarNota(2)
    //     E4.hacerSonarNota(2)
    //     G4.hacerSonarNota(2)
    // },2000)

    // setTimeout(()=>{
    //     D4.hacerSonarNota(2)
    //     Fsos4.hacerSonarNota(2)
    //     A4.hacerSonarNota(2)
    // },4000)

    // setTimeout(()=>{
    //     E4.hacerSonarNota(2)
    //     G4.hacerSonarNota(2)
    //     B4.hacerSonarNota(2)
    // },6000)

    // setTimeout(()=>{
    //     G4.hacerSonarNota(2)
    //     B4.hacerSonarNota(2)
    //     D5.hacerSonarNota(2)
    // },8000)

}
