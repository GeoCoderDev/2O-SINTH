
let nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();

// .
// .
// .

let nodoMaster = ENTORNO_AUDIO.createGain();



class NotaSintetizador{

    constructor(elementoHTML,elementoHTMLPianoRoll,frecuencia){
        this.elementoHTML = elementoHTML;
        this.frecuencia = frecuencia;
        this.teclaPianoRoll = elementoHTMLPianoRoll;
        this.elementoHTML.addEventListener('mousedown',()=>{

            let Osciladores1 = [];
            let Osciladores2 = [];
    
            for(let i=0; i<datosOscilador1[1].value;i++){
                Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores1[i].frequency.value = this.frecuencia;
                console.log(datosOscilador1[0]);
                Osciladores1[i].type = datosOscilador1[0].obtenerValor();
                Osciladores1[i].start();
                Osciladores1[i].connect(nodoSalidaSintetizador);
                
            }
    
            for(let i=0; i<datosOscilador2[1].value;i++){
                Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
                Osciladores2[i].frequency.value = this.frecuencia;
                Osciladores2[i].type = datosOscilador2[0];
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

        for(let i=0; i<datosOscilador1[1];i++){
            Osciladores1[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores1[i].frequency.value = this.frecuencia;
            console.log(datosOscilador1[0]);
            Osciladores1[i].type = datosOscilador1[0].obtenerValor();
            Osciladores1[i].start();
            Osciladores1[i].stop(ENTORNO_AUDIO.currentTime + duracion);
            Osciladores1[i].connect(nodoSalidaSintetizador);

        }

        for(let i=0; i<datosOscilador2[1];i++){
            Osciladores2[i] = ENTORNO_AUDIO.createOscillator();
            Osciladores2[i].frequency.value = this.frecuencia;
            Osciladores2[i].type = datosOscilador2[0];
            Osciladores2[i].start();
            Osciladores2[i].stop(ENTORNO_AUDIO.currentTime + duracion);
            Osciladores2[i].connect(nodoSalidaSintetizador);

        }
        
    }

}


nodoSalidaSintetizador.connect(nodoMaster);
nodoMaster.connect(ENTORNO_AUDIO.destination);


window.onload = function(){
    
    /*===================================================================================================================
    ASIGNANDO TECLAS a NOTAS DEL SINTETIZADOR
    =====================================================================================================================*/

    let C4 = new NotaSintetizador(document.getElementById('C4'),document.getElementById('C4Roll'),261.626);
    let Csos4 = new NotaSintetizador(document.getElementById('Csos4'),document.getElementById('Csos4Roll'),277.183);
    let D4 = new NotaSintetizador(document.getElementById('D4'),document.getElementById('D4Roll'),293.665);
    let Dsos4 = new NotaSintetizador(document.getElementById('Dsos4'),document.getElementById('Dsos4Roll'),311.127);
    let E4 = new NotaSintetizador(document.getElementById('E4'),document.getElementById('E4Roll'),329.628);
    let F4 = new NotaSintetizador(document.getElementById('F4'),document.getElementById('F4Roll'),349.228);
    let Fsos4 = new NotaSintetizador(document.getElementById('Fsos4'),document.getElementById('Fsos4Roll'),369.994);
    let G4 = new NotaSintetizador(document.getElementById('G4'),document.getElementById('G4Roll'),391.995);
    let Gsos4 = new NotaSintetizador(document.getElementById('Gsos4'),document.getElementById('Gsos4Roll'),415.305);
    let A4 = new NotaSintetizador(document.getElementById('A4'),document.getElementById('A4Roll'),440);
    let Asos4 = new NotaSintetizador(document.getElementById('Asos4'),document.getElementById('Asos4Roll'),466.164);
    let B4 = new NotaSintetizador(document.getElementById('B4'),document.getElementById('B4Roll'),493.883);
    let C5 = new NotaSintetizador(document.getElementById('C5'),document.getElementById('C5Roll'),523.251);
    let Csos5 = new NotaSintetizador(document.getElementById('Csos5'),document.getElementById('Csos5Roll'),554.365);
    let D5 = new NotaSintetizador(document.getElementById('D5'),document.getElementById('D5Roll'),587.330);
    let Dsos5 = new NotaSintetizador(document.getElementById('Dsos5'),document.getElementById('Dsos5Roll'),622.254);
    let E5 = new NotaSintetizador(document.getElementById('E5'),document.getElementById('E5Roll'),659.255);
    let F5 = new NotaSintetizador(document.getElementById('F5'),document.getElementById('F5Roll'),698.456);
    let Fsos5 = new NotaSintetizador(document.getElementById('Fsos5'),document.getElementById('Fsos5Roll'),739.989);
    let G5 = new NotaSintetizador(document.getElementById('G5'),document.getElementById('G5Roll'),783.991);
    let Gsos5 = new NotaSintetizador(document.getElementById('Gsos5'),document.getElementById('Gsos5Roll'),830.609);
    let A5 = new NotaSintetizador(document.getElementById('A5'),document.getElementById('A5Roll'),880);
    let Asos5 = new NotaSintetizador(document.getElementById('Asos5'),document.getElementById('Asos5Roll'),932.328);
    let B5 = new NotaSintetizador(document.getElementById('B5'),document.getElementById('B5Roll'),987.767);
    let C6 = new NotaSintetizador(document.getElementById('C6'),document.getElementById('C6Roll'),1046.5);
    let Csos6 = new NotaSintetizador(document.getElementById('Csos6'),document.getElementById('Csos6Roll'),1108.73);
    let D6 = new NotaSintetizador(document.getElementById('D6'),document.getElementById('D6Roll'),1174.66);
    let Dsos6 = new NotaSintetizador(document.getElementById('Dsos6'),document.getElementById('Dsos6Roll'),1244.51);
    let E6 = new NotaSintetizador(document.getElementById('E6'),document.getElementById('E6Roll'),1318.51);
    let F6 = new NotaSintetizador(document.getElementById('F6'),document.getElementById('F6Roll'),1396.91);
    let Fsos6 = new NotaSintetizador(document.getElementById('Fsos6'),document.getElementById('Fsos6Roll'),1479.98);
    let G6 = new NotaSintetizador(document.getElementById('G6'),document.getElementById('G6Roll'),1567.98);
    let Gsos6 = new NotaSintetizador(document.getElementById('Gsos6'),document.getElementById('Gsos6Roll'),1661.22);
    let A6 = new NotaSintetizador(document.getElementById('A6'),document.getElementById('A6Roll'),1760);
    let Asos6 = new NotaSintetizador(document.getElementById('Asos6'),document.getElementById('Asos6Roll'),1864.66);
    let B6 = new NotaSintetizador(document.getElementById('B6'),document.getElementById('B6Roll'),1975.53);
    let C7 = new NotaSintetizador(document.getElementById('C7'),document.getElementById('C7Roll'),2093);

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


}
