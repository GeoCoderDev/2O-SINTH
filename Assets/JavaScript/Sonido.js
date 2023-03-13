


let nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
let nodoCompresorSintetizador = ENTORNO_AUDIO.createDynamicsCompressor();
// .
// .
// .

let nodoMaster = ENTORNO_AUDIO.createGain();
let nodoPaneo = ENTORNO_AUDIO.createStereoPanner();

let frecuenciasPorTecla = [];
let teclaHTMLPorTecla = []

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
    
            for(let i=0; i<datosOscilador1[1].value;i++){
                Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores1[i].frequency.value = this.frecuencia;
                Osciladores1[i].type = datosOscilador1[0].obtenerValor();

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

                Osciladores1[i].start();
                Osciladores1[i].connect(nodoSalidaSintetizador);
                
            }
    
            for(let i=0; i<datosOscilador2[1].value;i++){
                Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores2[i].frequency.value = this.frecuencia;
                Osciladores2[i].type = datosOscilador2[0];

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
    
                Osciladores2[i].start();
                Osciladores2[i].connect(nodoSalidaSintetizador);
            }

            this.elementoHTML.addEventListener('mouseup',()=>{
                for(let i=0; i<Osciladores1.length;i++){
                    Osciladores1[i].stop();
                }
        
                for(let i=0; i<Osciladores2.length;i++){
                    Osciladores2[i].stop();
                }
            })

            this.elementoHTML.addEventListener('mouseout',()=>{
                for(let i=0; i<Osciladores1.length;i++){
                    Osciladores1[i].stop();
                }
        
                for(let i=0; i<Osciladores2.length;i++){
                    Osciladores2[i].stop();
                }
            })

        })

    }

    hacerSonarNota(duracion){
        let Osciladores1 = [];
        let Osciladores2 = [];
        let desafinacionOscilador1 = datosOscilador1[2].value;
        let desafinacionOscilador2 = datosOscilador2[2].value;

        for(let i=0; i<datosOscilador1[1].value;i++){
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = this.frecuencia;
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();


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

            Osciladores1[i].start();
            Osciladores1[i].stop(ENTORNO_AUDIO.currentTime + duracion);
            Osciladores1[i].connect(nodoSalidaSintetizador);

        }

        for(let i=0; i<datosOscilador2[1].value;i++){
            Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores2[i].frequency.value = this.frecuencia;
            Osciladores2[i].type = datosOscilador2[0];

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

            Osciladores2[i].start();
            Osciladores2[i].stop(ENTORNO_AUDIO.currentTime + duracion);
            Osciladores2[i].connect(nodoSalidaSintetizador);
        }

        this.elementoHTML.classList.add('tecla_blanca_pulsada');
        setTimeout(()=>{
            this.elementoHTML.classList.remove('tecla_blanca_pulsada');
        },duracion*990)
        
    }

}


//EVENTO DE TECLADO PARA SINTETIZADOR DE VARIAS TECLAS CON UN OBJETO MAP

var seRealizoUnRecorridoYa = false;        //Bandera para ejecutar una sola vez el evento de keydown
                                            //Esto lo hacemos porque cuando se mantiene una tecla presionada
                                            //Por mas de aprox. 1 segundo el evento se empieza a disparar varias
                                            //Veces por segundo.

let teclasPulsadas = new Map;


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

        for(let i=0; i<datosOscilador1[1].value;i++){
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = frecuenciasPorTecla[e.keyCode];
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();

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

            Osciladores1[i].start();
            Osciladores1[i].connect(nodoSalidaSintetizador);
            
        }

        for(let i=0; i<datosOscilador2[1].value;i++){
            Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores2[i].frequency.value = frecuenciasPorTecla[e.keyCode];
            Osciladores2[i].type = datosOscilador2[0];

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

            Osciladores2[i].start();
            Osciladores2[i].connect(nodoSalidaSintetizador);
        }


        teclaHTMLPorTecla[e.keyCode].classList.add('tecla_blanca_pulsada');  
    
        teclasPulsadas.set(e.keyCode,[Osciladores1,Osciladores2]);
    }        

})

window.addEventListener('keyup',(e)=>{

    if(!teclasPulsadas.has(e.keyCode)) return false;

    let osciladores = teclasPulsadas.get(e.keyCode);

    for(let u=0;u<osciladores.length;u++){
        for(let i=0; i<osciladores[u].length;i++){
            osciladores[u][i].stop();
        }        
    }
    
    teclaHTMLPorTecla[e.keyCode].classList.remove('tecla_blanca_pulsada');

    teclasPulsadas.delete(e.keyCode);
    
})


// EVENTO PARA CONTROLAR EL VOLUMEN DE SALIDA DEL SINTETIZADOR
let volumenSliderSintetizador = document.getElementById('Slider-Vol-Sintetizador');

volumenSliderSintetizador.addEventListener('mousemove',()=>{
    nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)*2;
})
volumenSliderSintetizador.addEventListener('keyup',()=>{
    nodoSalidaSintetizador.gain.value = (volumenSliderSintetizador.value/100)*2;
})

// CONFIGURANDO EL COMPRESSOR
nodoCompresorSintetizador.attack.value = 0;
nodoCompresorSintetizador.knee.value = 20;
nodoCompresorSintetizador.ratio.value = 12;
nodoCompresorSintetizador.threshold.value = -21;


// CONFIGURANDO EL VOLUMEN DEL MASTER
let volumenSliderMaster = document.getElementById('volumenMaster');

volumenSliderMaster.addEventListener('mousemove',()=>{
    nodoMaster.gain.value = (volumenSliderMaster.value/100)*2;
})
volumenSliderMaster.addEventListener('keyup',()=>{
    nodoMaster.gain.value = (volumenSliderMaster.value/100)*2;
})

// // CONFIGURANDO EL PANEO
// console.log(panSintetizador.value[0])
// nodoPaneo.pan.value = panSintetizador.value[0];

// REALIZANDO CONEXIONES ENTRE NODOS
nodoSalidaSintetizador.connect(nodoCompresorSintetizador);
nodoCompresorSintetizador.connect(nodoMaster)
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
    var nodoAnalizador = ENTORNO_AUDIO.createAnalyser();

    nodoMaster.connect(nodoAnalizador);

    nodoAnalizador.fftSize = 2048;
    var bufferLength = nodoAnalizador.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var analizadorHTML = document.getElementById('analizador');
    var contextoAnalizador = analizadorHTML.getContext('2d');
    contextoAnalizador.clearRect(0,0,analizadorHTML.width,analizadorHTML.height);

    function dibujarSonido(){
        requestAnimationFrame(dibujarSonido);

        nodoAnalizador.getByteTimeDomainData(dataArray);
        contextoAnalizador.fillStyle = 'rgb(226,225,223)';
        contextoAnalizador.fillRect(0,0,analizadorHTML.width,analizadorHTML.height);
        contextoAnalizador.lineWidth = 2;
        contextoAnalizador.strokeStyle = 'rgb(165, 161, 161)';
        contextoAnalizador.beginPath();
        var sliceWidth = analizadorHTML.width * 1.0 /bufferLength;
        var x = 0;
        for(var i =0; i < bufferLength; i++){
            var v = dataArray[i]/128.0;
            var y = v * analizadorHTML.height/2;

            if(i ===0){
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
