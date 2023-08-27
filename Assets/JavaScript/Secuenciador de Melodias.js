//===================================================================
// SECUENCIADOR DE MELODIAS
//==================================================================

const CONTENEDOR_SECUENCIADOR_DE_MELODIAS = document.getElementById('secuenciador-melodias-marco');
const CONTENEDOR_PIANO_ROLL = document.getElementById('Ocultador-Espacio-Blanco');
const PIANO_ROLL = document.getElementById('Piano-Roll');
const TEMPO = document.getElementById('Tempo');
const CABECERA_DE_COMPASES = document.getElementById('NUMEROS-COMPASS');
const CANTIDAD_COMPASES_HTML = document.getElementById('Cantidad-Compases');
const TEMPO_AL_CARGAR_LA_PAGINA = TEMPO.value;
const duracionSemicorcheaINICIAL = 60/(TEMPO_AL_CARGAR_LA_PAGINA*4);
const CANTIDAD_DE_COMPASES_MINIMA = 2;
let CANTIDAD_DE_COMPASES = CANTIDAD_DE_COMPASES_MINIMA;
let duracionSemicorcheas = 60/(TEMPO.value*4)



var Todos_los_cuadros_semicorchea;


let primeraFilaCuadrosSemicorchea;
let primeraColumnaCuadrosSemicorchea;

let todosLosOffsetLeft;
let todosLosOffsetTop;

let todasLasPosicionesRelativasAlMarco;



// Este evento servira para que cuando estemos usando el rodillo 
// en el secuenciador de melodias, no podamos hacer uso de las
// barras de desplazamiento del navegador
CONTENEDOR_SECUENCIADOR_DE_MELODIAS.addEventListener('wheel', (event) => {
    event.preventDefault(); // Evita el scroll predeterminado del navegador
    const scrollStep = 250; // Ajusta la cantidad de desplazamiento por rueda
    CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollTop += event.deltaY > 0 ? scrollStep : -scrollStep;
  });


var NOTAS_SECUENCIADOR_DE_MELODIAS = [];
var acumuladorParaNotasIDs = 0;

// Evento de mousedown en PIANO_ROLL, para que cuando se haga click se cree una nueva Nota

PIANO_ROLL.addEventListener('mousedown',(e)=>{
    if(e.button==0){
        let nuevaNotaSecuenciadorMelodias = new NotaSecuenciadorDeMelodias(e)
        if (nuevaNotaSecuenciadorMelodias.elementoHTML)  
            NOTAS_SECUENCIADOR_DE_MELODIAS.push(nuevaNotaSecuenciadorMelodias)
    }
})


// Variables que seran de uso compartido entre instancias de la clase NotaSecuenciadorDeMelodias
var Cantidad_Semicorcheas_Foco = 1; //Cantidad de semicorcheas en la que nos quedamos
const Nombre_Clase_para_las_notas = 'Secuenciador-Melodias-NOTA';
let isDraggingNote = false;
let offsetX, offsetY;
let currentDraggingNote;
let ultimoCuadroSemicorchea;
let isResizing = false;
let lastX;
let originalWidth = 0;


const PIXELES_DE_SENSIBILIDAD = 5;

// Configurando estilos del area para redimensionar
insertarReglasCSSAdicionales(`

    .${Nombre_Clase_para_las_notas}{
        cursor: grab;
    }

    .${Nombre_Clase_para_las_notas}::after {
        content: "";
        position: absolute;
        top: 0;
        right: -${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD,'vw')}vw;
        bottom: 0;
        width: ${pixelsToVWVH(PIXELES_DE_SENSIBILIDAD,'vw')}vw; 
        cursor: ew-resize;
    }

`)

class NotaSecuenciadorDeMelodias{

    constructor(evento){        
        // Evitar crear nuevo div si se hace clic en uno existente o si no esta haciendo clic en un elemento de la cuadricula
        if (!(evento.target.classList.contains("Cuadro-Semicorchea"))||evento.target.classList.contains(Nombre_Clase_para_las_notas)) return;
        
        let newDiv = document.createElement('div');
        this.elementoHTML = newDiv;
        this.longitudSemicorcheas = Cantidad_Semicorcheas_Foco;
        this.elementoHTML.className = Nombre_Clase_para_las_notas;
        this.elementoHTML.style.width = `${1.98*this.longitudSemicorcheas}vw`;
        this.elementoHTML.style.height = '3.2vh';
        this.elementoHTML.style.backgroundColor = 'rgb(205, 104, 255)';
        this.elementoHTML.style.position = 'absolute';
        this.elementoHTML.style.cursor = 'grab';
        this.elementoHTML.style.borderRadius = '0.3vw';
        this.elementoHTML.style.boxShadow = '0px 0px 0.9vw 0.4vw rgba(0, 0, 0, .5) inset';
        this.elementoHTML.style.border = '0.1vw solid rgb(185, 84, 235)';
        this.elementoHTML.style.opacity = '0.9'
        
        // Se estan usando arrowFunctions para poder usar la palabra clave this dentro de funciones que estan 
        // dentro de metodos de una clase como en este caso la funcion onMouseDown que se encuentra dentro del metodo
        // constructor
        let onMouseDown = (e,forzado=false)=>{    
                    
            if(e.button==0){
                // Solo se podra arrastrar si esta fuera del area sensible a redimensionamiento o si 
                // el evento esta siendo forzado
                currentDraggingNote = this.elementoHTML;
                if ((!(e.offsetX >= this.elementoHTML.offsetWidth - PIXELES_DE_SENSIBILIDAD))||forzado) { // Solo en el borde derecho
                    isDraggingNote = true;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    this.elementoHTML.style.cursor = 'grabbing';
                    PIANO_ROLL.style.cursor = 'grabbing';                    
                    moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e,this.elementoHTML)
                }else{
                    isResizing = true;
                    lastX = e.clientX;
                    originalWidth = this.elementoHTML.offsetWidth;     
                }  
                                
                document.addEventListener('mousemove', onMouseMove);

            }else{
                if(e.target.className==Nombre_Clase_para_las_notas){    
                    // Eliminando de la matriz la notaSecuenciadorDeMelodias donde se hizo click izquierdo
                    NOTAS_SECUENCIADOR_DE_MELODIAS.splice(
                        // Obteniendo el index de la notaSecuenciadorDeMelodias que tenga el mismo elementoHTML que e.target
                        NOTAS_SECUENCIADOR_DE_MELODIAS.findIndex((notaSecuenciadorDeMelodias) => notaSecuenciadorDeMelodias.elementoHTML==e.target),1)                    
                    e.target.remove();
                }
            }            
        }

        let onMouseUp = ()=>{
            isDraggingNote = false;
            PIANO_ROLL.style.cursor = 'default';
            this.elementoHTML.style.cursor = 'grab';
            if(this.elementoHTML==currentDraggingNote){
                currentDraggingNote = null;
            }                
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            this.#actualizarIndices();
            //Asignando la nota segun el indiceY de la tabla en el que se encuentra ahora la nota en base al array de todas las notas
            //del sintetizador, que estan en un orden invertido, por eso hacemos una copia con slice y luego lo revertimos
            this.notaSintetizador = NotaSintetizador.todasLasNotasSintetizador.slice().reverse()[this.indiceTablaY];
        }
        
        let onMouseMove = (e)=>{
            if (!isDraggingNote && !isResizing) return;
            moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e,this.elementoHTML,this);            
            this.#actualizarIndices();
            //Asignando la nota segun el indiceY de la tabla en el que se encuentra ahora la nota en base al array de todas las notas
            //del sintetizador, que estan en un orden invertido, por eso hacemos una copia con slice y luego lo revertimos
            this.notaSintetizador = NotaSintetizador.todasLasNotasSintetizador.slice().reverse()[this.indiceTablaY];
        }
        
        this.elementoHTML.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        
        
        PIANO_ROLL.appendChild(this.elementoHTML);


        // Iniciar arrastre automáticamente
        onMouseDown(evento,true);
    }


    #actualizarIndices(){
        // OBTENIENDO LOS NUEVOS INDICES Y EL CUADRO SEMICORCHEA POR DEBAJO
        this.indiceTablaX = todosLosOffsetLeft.indexOf(this.elementoHTML.offsetLeft);
        this.indiceTablaY = todosLosOffsetTop.indexOf(distanciaRelativaEntreElementos(PIANO_ROLL,this.elementoHTML).distanciaVerticalPX);                
    }    

    ajustarNotaAGrilla(){
        this.CuadroSemicorcheaDebajo = Todos_los_cuadros_semicorchea[(16*CANTIDAD_DE_COMPASES*this.indiceTablaY)+this.indiceTablaX]
        this.elementoHTML.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,this.CuadroSemicorcheaDebajo).distanciaHorizontalPX,'vw')+'vw';
        this.elementoHTML.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,this.CuadroSemicorcheaDebajo).distanciaVerticalPX,'vw')+'vw';
    }   

    static acomodarTodasLasNotas(){
        NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorMelodias)=>{
            notaSecuenciadorMelodias.ajustarNotaAGrilla();
        })
    }

}

// ------------------------------------------------
// |  FUNCION DE POSICIONAMIENTO PARA LA CLASE    |      
// ------------------------------------------------
// Funcion para mousemove y mousedown de las Notas
function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e, divArrastrado, notaAsociada){

    if(isResizing){
        
        divArrastrado.style.cursor = 'ew-resize';
        PIANO_ROLL.style.cursor = 'ew-resize';

        const deltaX = e.clientX - lastX;
        const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
        divArrastrado.style.width = `${pixelsToVWVH(Math.max(newWidth, 0),'vw')}vw`;
        
        let coordernadaDraggingNoteX = divArrastrado.getBoundingClientRect().right;
        let coordernadaDraggingNoteY = divArrastrado.getBoundingClientRect().top;
        // Obteniendo el elemento 'Cuadro-Semicorchea' que se encuentra debajo del elemento arrastrado
        let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
        let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0];

        if(elementUnderCursorGrilla){
            let anchoObedienteAGrilla = elementUnderCursorGrilla.getBoundingClientRect().right - divArrastrado.getBoundingClientRect().left;
            divArrastrado.style.width = `${pixelsToVWVH(anchoObedienteAGrilla,'vw')}vw`;
            ultimoCuadroSemicorchea = elementUnderCursorGrilla;
        }else{
            let anchoObedienteAGrilla = ultimoCuadroSemicorchea.getBoundingClientRect().right - divArrastrado.getBoundingClientRect().left;
            divArrastrado.style.width = `${pixelsToVWVH(anchoObedienteAGrilla,'vw')}vw`;
        }
        
        //OBTENIENDO LA NUEVA LONGITUD A CAUSA DEL RESIZE

        let lefClient = notaAsociada.elementoHTML.getBoundingClientRect().left;
        // Para obtener las coordenadas derechas quitaremos 5 pixeles para asegurar que tomaremos
        // el elemento Cuadro-Semicorchea correcto y no el siguiente adyacente
        let rightClient = notaAsociada.elementoHTML.getBoundingClientRect().right - 5;
        let topClient = notaAsociada.elementoHTML.getBoundingClientRect().top;

        let elementosDebajoDelLadoIzquierdo = document.elementsFromPoint(lefClient,topClient);
        let elementosDebajoDelLadoDerecho = document.elementsFromPoint(rightClient,topClient);
        let semicorcheaDebajoDelLadoIzquierdo = elementosDebajoDelLadoIzquierdo.filter((elemento)=>elemento.classList.contains('Cuadro-Semicorchea'))[0];
        let semicorcheaDebajoDelLadoIDerecho = elementosDebajoDelLadoDerecho.filter((elemento)=>elemento.classList.contains('Cuadro-Semicorchea'))[0];
        let ancho_de_una_semicorchea_actual = semicorcheaDebajoDelLadoIDerecho.offsetWidth;
        if(semicorcheaDebajoDelLadoIzquierdo&&semicorcheaDebajoDelLadoIDerecho){
            let longitud = (semicorcheaDebajoDelLadoIDerecho.getBoundingClientRect().right - 
            semicorcheaDebajoDelLadoIzquierdo.getBoundingClientRect().left)/ancho_de_una_semicorchea_actual;
            
            notaAsociada.longitudSemicorcheas = Math.round(longitud);
            //Seteando la ultima longitud para las nuevas notas
            Cantidad_Semicorcheas_Foco = notaAsociada.longitudSemicorcheas;
        }            

    }else{            
        let x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
        let y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;
        
        // Verificar que el nuevo div no se salga del contenedor
        let maxX = PIANO_ROLL.clientWidth - divArrastrado.clientWidth;
        let maxY = PIANO_ROLL.clientHeight - divArrastrado.clientHeight;
        divArrastrado.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
        divArrastrado.style.top = `${pixelsToVWVH(Math.max(0, Math.min(y, maxY)),'vh')[0]}vh`;
        
        let coordernadaDraggingNoteX = divArrastrado.getBoundingClientRect().left;
        let coordernadaDraggingNoteY = divArrastrado.getBoundingClientRect().top;
        // Obteniendo el elemento 'Cuadro-Semicorchea' que se encuentra debajo del elemento arrastrado
        let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
        let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0];

        //Obligando a obedecer la grilla formada por los elementos 'Cuadro-Semicorchea'
        if(elementUnderCursorGrilla){
            divArrastrado.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,elementUnderCursorGrilla).distanciaHorizontalPX,'vw')[0] + "vw"
            divArrastrado.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,elementUnderCursorGrilla).distanciaVerticalPX,'vw')[0] + "vw"
            ultimoCuadroSemicorchea = elementUnderCursorGrilla;
        }else{
            divArrastrado.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,ultimoCuadroSemicorchea).distanciaHorizontalPX,'vw')[0] + "vw"
            divArrastrado.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,ultimoCuadroSemicorchea).distanciaVerticalPX,'vw')[0] + "vw"
        }       

    }  
}


function actualizarCuadrosSemicorcheaYacomodarNotas(){
    //Transformando la lista de nodos en un Array para poder usar todos los
    // metodos del prototipo array como slice
    Todos_los_cuadros_semicorchea = [...document.querySelectorAll('.Cuadro-Semicorchea')];
    //Obteniendo la primera fila y la primera columna de la tabla PIANO_ROLL
    primeraFilaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.slice(0,16*CANTIDAD_DE_COMPASES);
    primeraColumnaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.filter((elemento,indice)=>indice%(16*CANTIDAD_DE_COMPASES)==0);
    
    todosLosOffsetLeft = primeraFilaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetLeft);
    todosLosOffsetTop = primeraColumnaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetTop);
    todasLasPosicionesRelativasAlMarco = primeraFilaCuadrosSemicorchea.map((cuadroSemicorchea)=>{
        return (cuadroSemicorchea.getBoundingClientRect().left-CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect().left + CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft);
    });
    todasLasPosicionesRelativasAlMarco.push(primeraFilaCuadrosSemicorchea[primeraFilaCuadrosSemicorchea.length-1].getBoundingClientRect().right-CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect().left + CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft);
    todasLasPosicionesRelativasAlMarco.push(Infinity);
    NotaSecuenciadorDeMelodias.acomodarTodasLasNotas();
}

// INICIALIZANDO LOS ARRAYS
actualizarCuadrosSemicorcheaYacomodarNotas();

window.addEventListener('resize',actualizarCuadrosSemicorcheaYacomodarNotas);

/**
 * 
 * @returns Esta funcion devuelve el compass en el que se encuentra la nota con maximo indice X de tabla final
 */
let establecerElMinimoDeCorcheas = ()=>{

    if(NOTAS_SECUENCIADOR_DE_MELODIAS.length==0){
        CANTIDAD_COMPASES_HTML.min = CANTIDAD_DE_COMPASES_MINIMA
        return;
    } 

    let notaConMayorIndiceXFinal = NOTAS_SECUENCIADOR_DE_MELODIAS.reduce((maxNota,nextNota)=>{
        if((nextNota.indiceTablaX + nextNota.longitudSemicorcheas)>=(maxNota.indiceTablaX + maxNota.longitudSemicorcheas)){
            return nextNota;
        }else{
            return maxNota;
        }
    });

    let mayorIndiceXFinalDeLaMelodiaActual = notaConMayorIndiceXFinal.indiceTablaX + notaConMayorIndiceXFinal.longitudSemicorcheas;

    let minimaCantidadDeSemicorcheas = (mayorIndiceXFinalDeLaMelodiaActual/16 > Math.floor(mayorIndiceXFinalDeLaMelodiaActual/16))
                                       ?((Math.floor(mayorIndiceXFinalDeLaMelodiaActual/16)%2==0)
                                            ?Math.floor(mayorIndiceXFinalDeLaMelodiaActual/16)+2
                                            :Math.floor(mayorIndiceXFinalDeLaMelodiaActual/16)+1)
                                       :mayorIndiceXFinalDeLaMelodiaActual/16;

    
    CANTIDAD_COMPASES_HTML.min = minimaCantidadDeSemicorcheas;

    return (mayorIndiceXFinalDeLaMelodiaActual/16 > Math.floor(mayorIndiceXFinalDeLaMelodiaActual/16))?(mayorIndiceXFinalDeLaMelodiaActual/16)+1:mayorIndiceXFinalDeLaMelodiaActual/16;
}


let establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas = ()=>{

    establecerElMinimoDeCorcheas();

    if(CANTIDAD_COMPASES_HTML.value==CANTIDAD_DE_COMPASES) return;

    let todasLasFilasDeNotas = document.querySelectorAll('.fila-nota-secuenciador-de-melodias');

    // OBTENIENDO LA CANTIDAD DE SEMICORCHEAS DE UNA DE LAS FILAS
    let longitudActualDeCadaFilaSemicorcheas = todasLasFilasDeNotas[0].childElementCount;
    let longitudNuevaEnSemicorcheasDeCadaFila = CANTIDAD_COMPASES_HTML.value*16;
    CANTIDAD_DE_COMPASES = CANTIDAD_COMPASES_HTML.value;

    CABECERA_DE_COMPASES.style.width = `${32*CANTIDAD_DE_COMPASES}vw`;
    PIANO_ROLL.style.minWidth = `${32*CANTIDAD_DE_COMPASES}vw`;
    CONTENEDOR_PIANO_ROLL.style.minWidth = `${(32*CANTIDAD_DE_COMPASES)+6}vw`

    // AGREGANDO LAS CABECERAS
    if(longitudActualDeCadaFilaSemicorcheas<longitudNuevaEnSemicorcheasDeCadaFila){

        for(let i=longitudActualDeCadaFilaSemicorcheas;i<=longitudNuevaEnSemicorcheasDeCadaFila;i++){
            
            if((i-1)%16==0){
                let nuevaCabeceraCompas = document.createElement('td');
                nuevaCabeceraCompas.classList.add('numeros_compas_cabecera');
                nuevaCabeceraCompas.innerText = ((i-1)/16)+1;
                CABECERA_DE_COMPASES.appendChild(nuevaCabeceraCompas);
            }
        }

    }else if(longitudActualDeCadaFilaSemicorcheas>longitudNuevaEnSemicorcheasDeCadaFila){

        for(let i=longitudActualDeCadaFilaSemicorcheas;i>=longitudNuevaEnSemicorcheasDeCadaFila;i--){

            if((i+1)%16==0){
                let ultimaCabeceraCompas = CABECERA_DE_COMPASES.lastChild;
                CABECERA_DE_COMPASES.removeChild(ultimaCabeceraCompas);
            }

        }

    }

    // AGREGANDO LOS CUADROS SEMICORCHEA PARA CADA FILA
    todasLasFilasDeNotas.forEach((filaNotaSecuenciador)=>{
        
        if(longitudActualDeCadaFilaSemicorcheas<longitudNuevaEnSemicorcheasDeCadaFila){

            for(let i=longitudActualDeCadaFilaSemicorcheas;i<longitudNuevaEnSemicorcheasDeCadaFila;i++){
                
                let nuevoTD = document.createElement('td');
                nuevoTD.classList.add('Cuadro-Semicorchea');
                filaNotaSecuenciador.appendChild(nuevoTD);
                
            }

        }else if(longitudActualDeCadaFilaSemicorcheas>longitudNuevaEnSemicorcheasDeCadaFila){

            for(let i=longitudActualDeCadaFilaSemicorcheas;i>longitudNuevaEnSemicorcheasDeCadaFila;i--){
                let ultimoTD = filaNotaSecuenciador.lastChild;                
                filaNotaSecuenciador.removeChild(ultimoTD);

            }

        }
        
    })

    actualizarCuadrosSemicorcheaYacomodarNotas();

}

CANTIDAD_COMPASES_HTML.addEventListener('change',establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas);
CANTIDAD_COMPASES_HTML.addEventListener('mouseover',establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas);
CANTIDAD_COMPASES_HTML.addEventListener('wheel',(e)=>{
    e.preventDefault();
    if (e.deltaY > 0) {
        CANTIDAD_COMPASES_HTML.stepDown();
    } else {
        CANTIDAD_COMPASES_HTML.stepUp();
    }
    establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas();
});

CANTIDAD_COMPASES_HTML.addEventListener('mousedown',(e)=>{
    if(e.button==1){

        CANTIDAD_COMPASES_HTML.value = CANTIDAD_COMPASES_HTML.min;
        establecerLimiteMinimoCompases_Columnas_Y_Acomodar_Notas();
    }
})

// ----------------------------
// | REPRODUCCIÓN DE MELODIAS |      
// ---------------------------- 

const BTN_PLAY_PAUSA = document.getElementById('boton-play-pausa');
    const TRIANGULO_PLAY = document.getElementById('triangulo-play');
    const RECTANGULOS_PAUSA = document.querySelectorAll('.rectangulo-pausa');
const BTN_STOP = document.getElementById('boton-stop');
const TRANSPORT_BAR = document.getElementById('Transport-Bar');
let estiloParaEliminarBordeDelTransportBar;

// Obtiene la posición X del elemento relativa al contenedor a cada segundo
const startTime = performance.now();
const interval = 1000; // Intervalo de tiempo en milisegundos (1 segundo)
let ultimoIndiceX;
let animacionActual;
let lastAnimationTime = 0;
let ultimoRequestAnimate;
let seEstaReproduciendo = false;
let estaPausado = true;
let ultimaPosicionXRelativaTransportBar=0;
let tempoDeLaAnimacion;

function reproducirNotas() {
    const contenedorRect = CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect();
    const transportBarRect = TRANSPORT_BAR.getBoundingClientRect();

    // Calcula la posición X relativa al contenedor incluyendo el scroll realizado
    const posicionXRelativa = transportBarRect.left - contenedorRect.left + CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft;
    ultimaPosicionXRelativaTransportBar = posicionXRelativa;
    let indiceCuadroSemicorchea;
    for (let i = 0; i < todasLasPosicionesRelativasAlMarco.length-2; i++) {
        if (
            posicionXRelativa > todasLasPosicionesRelativasAlMarco[i] &&
            posicionXRelativa <= todasLasPosicionesRelativasAlMarco[i + 1]
        ) {
            indiceCuadroSemicorchea = i;
            break;
        }
    }

    if(!estiloParaEliminarBordeDelTransportBar){
        if(posicionXRelativa>=(todasLasPosicionesRelativasAlMarco[todasLasPosicionesRelativasAlMarco.length-2]-(Todos_los_cuadros_semicorchea[0].offsetWidth/2))){
            estiloParaEliminarBordeDelTransportBar = insertarReglasCSSAdicionales(`
            #Transport-Bar::before{
                border-right-width:0;
            }`
            )   

            ultimoIndiceX = 0;
            animacionActual = reproducirMelodiaAnimacion();
            actualizarDurationSemicorcheas()
        }
    }else{
        if(ultimoIndiceX==0){
            eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar();
        }
    }

    if(ultimoIndiceX!=indiceCuadroSemicorchea){        
        NOTAS_SECUENCIADOR_DE_MELODIAS.forEach((notaSecuenciadorDeMelodias)=>{
            if(notaSecuenciadorDeMelodias.indiceTablaX==indiceCuadroSemicorchea){
                notaSecuenciadorDeMelodias.notaSintetizador.hacerSonarNota(notaSecuenciadorDeMelodias.longitudSemicorcheas*duracionSemicorcheas);
            }
        })
        ultimoIndiceX = indiceCuadroSemicorchea;
    }

    ultimoRequestAnimate = requestAnimationFrame(reproducirNotas);

}

//Esta funcion es para evitar que siga sonando la melodia al momento de pausar o parar la animacion
let desconectarYcrearNuevaSalidaDeAudio = ()=>{
    nodoSalidaSintetizador.disconnect();
    nodoSalidaSintetizador = undefined;
    nodoSalidaSintetizador = ENTORNO_AUDIO.createGain();
    nodoSalidaSintetizador.connect(nodoCompresorSintetizador);
}

let eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar = ()=>{
    if(estiloParaEliminarBordeDelTransportBar){
        eliminarReglasCSSAdicionales(estiloParaEliminarBordeDelTransportBar);
        estiloParaEliminarBordeDelTransportBar = undefined;
    }    
}


RECTANGULOS_PAUSA.forEach((rectanguloPausa)=>{
    rectanguloPausa.classList.toggle('no-desplegado');
});

let cambiarBotonAPlayOPausa = ()=>{
    TRIANGULO_PLAY.classList.toggle('no-desplegado');
    RECTANGULOS_PAUSA.forEach((rectanguloPausa)=>{
        rectanguloPausa.classList.toggle('no-desplegado');
    });
    BTN_PLAY_PAUSA.classList.toggle('boton-reproduccion-pulsado');
}

function reproducirMelodiaAnimacion(){

    let indiceInicialDeLaAnimacion = ((ultimoIndiceX)&&ultimoIndiceX!=0)?ultimoIndiceX+1:0;
    
    let posicionDeInicio = todasLasPosicionesRelativasAlMarco[indiceInicialDeLaAnimacion]-todasLasPosicionesRelativasAlMarco[0];

    return TRANSPORT_BAR.animate(
        [
            {transform: `translateX(${pixelsToVWVH(posicionDeInicio,'vw')}vw)`},
            {transform: `translateX(${pixelsToVWVH(PIANO_ROLL.clientWidth,'vw')-0.1}vw)`}
        ],
        {
            iterations: 1,
            easing: "linear",
            fill: "forwards",
            duration: duracionSemicorcheaINICIAL*((16*CANTIDAD_DE_COMPASES)-indiceInicialDeLaAnimacion)*1000
        }
    );  
    
    

}

function volverTransportBarAPosicion(posicionPX){
    TRANSPORT_BAR.animate(
        [
            {transform: `translateX(${posicionPX}px)`}
        ],
        {
            iterations:1,
            easing:"linear",
            fill: "forwards",
            duration:0
        }
    )
}

function pausarMelodia(moviendoTransportBar=false){

    if(seEstaReproduciendo){

        if(animacionActual){
            animacionActual.pause();
            desconectarYcrearNuevaSalidaDeAudio();
        }
    
        if(ultimoRequestAnimate){
            cancelAnimationFrame(ultimoRequestAnimate);
        }

        if(!moviendoTransportBar){
            cambiarBotonAPlayOPausa();  
        }

        seEstaReproduciendo = false;
        estaPausado = true
    }

}

/**
 * 
 * @returns devuelve true si cuando se paro no estaba pausado, y false si esta pausado.
 */
function pararMelodia(){
    
    if(seEstaReproduciendo||estaPausado){

        if(ultimoRequestAnimate){
            cancelAnimationFrame(ultimoRequestAnimate);
        }
    
        if(animacionActual){
            animacionActual.cancel();
            animacionActual = undefined;
        }
        
        ultimoIndiceX = 0;                              
        volverTransportBarAPosicion(0);
        desconectarYcrearNuevaSalidaDeAudio();  

        seEstaReproduciendo = false;

        if(!estaPausado){
            cambiarBotonAPlayOPausa();  
            return true;          
        }else{
            return false; 
        }
        
    }
}

function reproducirMelodia(){
    seEstaReproduciendo = true;
    animacionActual = reproducirMelodiaAnimacion();
    reproducirNotas();
    actualizarDurationSemicorcheas();
    estaPausado = false;
    cambiarBotonAPlayOPausa();  
}

delegarEvento('click','#boton-play-pausa, #boton-play-pausa *',()=>{
    if(!seEstaReproduciendo){
        reproducirMelodia();
    }else{
        // PAUSAR
        pausarMelodia();    
    }   
    eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar()   
})


delegarEvento('click','#boton-stop, #boton-stop *',()=>{
    
    eliminarEstilosDeEliminacionDelBordeDerechoDelTranportBar()
    pararMelodia();

})

function arrastrarTransportBar(eventoMouseDown){


    if(eventoMouseDown.target==TRANSPORT_BAR){
        if(!(eventoMouseDown.offsetY<=VWVHTopixels("vh",3.3)[0])){
            return false;
        }
    }
    
    let cambioDeCursor = cambiarCursorParaTodaLaPagina('grabbing');

    let stopExitosamente;

    let empezarArrastrarTransportBar = (e)=>{        
        if(!stopExitosamente) stopExitosamente = pararMelodia(); 
    
        let posicionNueva = e.clientX - PIANO_ROLL.getBoundingClientRect().left;

        posicionNueva = Math.max(0,Math.min(posicionNueva,PIANO_ROLL.getBoundingClientRect().right+CONTENEDOR_SECUENCIADOR_DE_MELODIAS.scrollLeft))

        for(let i=0;i<todasLasPosicionesRelativasAlMarco.length;i++){
            if((posicionNueva>=(todasLasPosicionesRelativasAlMarco[i] - todasLasPosicionesRelativasAlMarco[0]))&&
                (posicionNueva<=(todasLasPosicionesRelativasAlMarco[i+1] - todasLasPosicionesRelativasAlMarco[0]))){
                
                    posicionNueva = todasLasPosicionesRelativasAlMarco[i] - todasLasPosicionesRelativasAlMarco[0];
                    if(i==64) {
                        if(!estiloParaEliminarBordeDelTransportBar){
                            estiloParaEliminarBordeDelTransportBar = insertarReglasCSSAdicionales(`
                            #Transport-Bar::before{
                                border-right-width:0;
                            }`
                        )   
                        }
            
                    }else{
                        if(estiloParaEliminarBordeDelTransportBar){
                            eliminarReglasCSSAdicionales(estiloParaEliminarBordeDelTransportBar);
                            estiloParaEliminarBordeDelTransportBar = undefined;
                        }
                    }
                    ultimoIndiceX = i-1;
                    break;
            }
        }

        volverTransportBarAPosicion(posicionNueva);        

    }

    //FORZANDO ARRASTRE CON UN SOLO MOUSEDOWN SIN NECESIDAD DE DISPARAR EL EVENTO MOUSEMOVE, 
    // PORQUE LAMENTABLEMENTE AVECES EL USUARIO NO LA DISPARARA CON SOLO HACER CLICK
    empezarArrastrarTransportBar(eventoMouseDown);

    let eventoMouseMove = delegarEvento('mousemove',`*`,empezarArrastrarTransportBar)
    
    let eventoMouseUp = delegarEvento('mouseup',`*`,()=>{
        if(stopExitosamente) reproducirMelodia();
        eliminarEventoDelegado('mousemove',eventoMouseMove);
        eliminarEventoDelegado('mouseup',eventoMouseUp);
        cambioDeCursor.volverAlCursorOriginal();   
          
    })

}

delegarEvento('mousedown',TRANSPORT_BAR,arrastrarTransportBar);
delegarEvento('mousedown',`#NUMEROS-COMPASS, #NUMEROS-COMPASS *`,arrastrarTransportBar);

// EVENTO DE CURSOR GRAB SOLO EN TRIANGULO DEL TRANSPORT BAR
delegarEvento('mousemove',TRANSPORT_BAR,(e)=>{
    if(e.offsetY<=VWVHTopixels("vh",3.3)[0]){
        TRANSPORT_BAR.style.cursor = "grab";
    }else{        
        TRANSPORT_BAR.style.cursor = "initial";
    };
})


function actualizarDurationSemicorcheas(){ 

    if(seEstaReproduciendo){
        animacionActual.playbackRate = TEMPO.value/TEMPO_AL_CARGAR_LA_PAGINA;
    }

    duracionSemicorcheas = 60/(TEMPO.value*4);
    

}

delegarEvento('mousemove',TEMPO,actualizarDurationSemicorcheas);
TEMPO.addEventListener('change',actualizarDurationSemicorcheas);
TEMPO.addEventListener('wheel',(e)=>{
    e.preventDefault();
    if (e.deltaY > 0) {
        TEMPO.stepDown();
    } else {
        TEMPO.stepUp();
    }
    actualizarDurationSemicorcheas();
});

TEMPO.addEventListener('mousedown',(e)=>{
    if(e.button==1){
        TEMPO.value = TEMPO.defaultValue;
        actualizarDurationSemicorcheas();
    }
});


