//===================================================================
// SECUENCIADOR DE MELODIAS
//==================================================================
const SECUENCIADOR_DE_MELODIAS_MARCO = document.getElementById('secuenciador-melodias-marco')
const PIANO_ROLL = document.getElementById('Piano-Roll');
var CANTIDAD_DE_COMPASES = 4

//Transformando la lista de nodos en un Array para poder usar todos los
// metodos del prototipo array como slice
var Todos_los_cuadros_semicorchea = [...document.querySelectorAll('.Cuadro-Semicorchea')];

//Obteniendo la primera fila y la primera columna de la tabla PIANO_ROLL
var primeraFilaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.slice(0,64);
var primeraColumnaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.filter((elemento,indice)=>indice%64==0);


var todosLosOffsetLeft = primeraFilaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetLeft);
var todosLosOffsetTop = primeraColumnaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetTop);

function actualizarCuadrosSemicorchea(){
    Todos_los_cuadros_semicorchea = [...document.querySelectorAll('.Cuadro-Semicorchea')];
    primeraFilaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.slice(0,64);
    primeraColumnaCuadrosSemicorchea = Todos_los_cuadros_semicorchea.filter((elemento,indice)=>indice%64==0)
    todosLosOffsetLeft = primeraFilaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetLeft);
    todosLosOffsetTop = primeraColumnaCuadrosSemicorchea.map((cuadroSemicorchea)=>cuadroSemicorchea.offsetTop);
}


window.addEventListener('resize',()=>{
    actualizarCuadrosSemicorchea();
    NotaSecuenciadorDeMelodias.acomodarTodasLasNotas();
})
// Este evento servira para que cuando estemos usando el rodillo 
// en el secuenciador de melodias, no podamos hacer uso de las
// barras de desplazamiento del navegador
SECUENCIADOR_DE_MELODIAS_MARCO.addEventListener('wheel', (event) => {
    event.preventDefault(); // Evita el scroll predeterminado del navegador
    const scrollStep = 250; // Ajusta la cantidad de desplazamiento por rueda
    SECUENCIADOR_DE_MELODIAS_MARCO.scrollTop += event.deltaY > 0 ? scrollStep : -scrollStep;
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
        this.elementoHTML.style.width = `${1.975*this.longitudSemicorcheas}vw`;
        this.elementoHTML.style.height = '1.5vw';
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
                this.#actualizarLongitudNota()
                currentDraggingNote = null;
            }                
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
        }
        
        let onMouseMove = (e)=>{
            if (!isDraggingNote && !isResizing) return;
            moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e,this.elementoHTML);            
        }
        
        this.elementoHTML.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        
        
        PIANO_ROLL.appendChild(this.elementoHTML);


        // Iniciar arrastre automáticamente
        onMouseDown(evento,true);
    }


    #actualizarLongitudNota(){
        let lefClient = this.elementoHTML.getBoundingClientRect().left;
        // Para obtener las coordenadas derechas quitaremos 5 pixeles para asegurar que tomaremos
        // el elemento Cuadro-Semicorchea correcto y no el siguiente adyacente
        let rightClient = this.elementoHTML.getBoundingClientRect().right - 5;
        let topClient = this.elementoHTML.getBoundingClientRect().top;

        let elementosDebajoDelLadoIzquierdo = document.elementsFromPoint(lefClient,topClient);
        let elementosDebajoDelLadoDerecho = document.elementsFromPoint(rightClient,topClient);
        let semicorcheaDebajoDelLadoIzquierdo = elementosDebajoDelLadoIzquierdo.filter((elemento)=>elemento.classList.contains('Cuadro-Semicorchea'))[0];
        let semicorcheaDebajoDelLadoIDerecho = elementosDebajoDelLadoDerecho.filter((elemento)=>elemento.classList.contains('Cuadro-Semicorchea'))[0];
        let ancho_de_una_semicorchea_actual = semicorcheaDebajoDelLadoIDerecho.offsetWidth;
        let alto_de_una_semicorchea_actual = semicorcheaDebajoDelLadoIDerecho.offsetHeight;
        if(semicorcheaDebajoDelLadoIzquierdo&&semicorcheaDebajoDelLadoIDerecho){
            let longitud = (semicorcheaDebajoDelLadoIDerecho.getBoundingClientRect().right - 
            semicorcheaDebajoDelLadoIzquierdo.getBoundingClientRect().left)/ancho_de_una_semicorchea_actual;
            
            this.longitudSemicorcheas = Math.round(longitud);
            //Seteando la ultima longitud para las nuevas notas
            Cantidad_Semicorcheas_Foco = this.longitudSemicorcheas;
        }

        this.indiceTablaX = todosLosOffsetLeft.indexOf(this.elementoHTML.offsetLeft);
        this.indiceTablaY = todosLosOffsetTop.indexOf(distanciaRelativaEntreElementos(PIANO_ROLL,this.elementoHTML).distanciaVerticalPX);
        // Se suman 2 pixeles para asegurar que se tomen las coordenadas del elemento Cuadro-Semicorchea correcto
        // y no otro adyacente no deseado
        let coordenadaXSemicorcheaDebajo = todosLosOffsetLeft[0] + (ancho_de_una_semicorchea_actual * this.indiceTablaX) + 2 + PIANO_ROLL.getBoundingClientRect().left; 
        let coordenadaYSemicorcheaDebajo = todosLosOffsetTop[0] + (alto_de_una_semicorchea_actual * this.indiceTablaY) + 2 + PIANO_ROLL.getBoundingClientRect().top;

        console.log(coordenadaXSemicorcheaDebajo,coordenadaYSemicorcheaDebajo)

        let elementosEnCoordenada = document.elementsFromPoint(coordenadaXSemicorcheaDebajo,coordenadaYSemicorcheaDebajo);
        this.CuadroSemicorcheaDebajo = elementosEnCoordenada.filter((elemento)=>elemento.classList.contains('Cuadro-Semicorchea'))[0];
        console.log(this.CuadroSemicorcheaDebajo)
    }

    ajustarNotaAGrilla(){
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
    function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e, divArrastrado){

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
        }else{            
            let x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
            let y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;
            
            // Verificar que el nuevo div no se salga del contenedor
            let maxX = PIANO_ROLL.clientWidth - divArrastrado.clientWidth;
            let maxY = PIANO_ROLL.clientHeight - divArrastrado.clientHeight;
            divArrastrado.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
            divArrastrado.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;
            
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


// ----------------------------
// | REPRODUCCIÓN DE MELODIAS |      
// ---------------------------- 
const CONTENEDOR_SECUENCIADOR_DE_MELODIAS = document.getElementById('secuenciador-melodias-marco');
const TRANSPORT_BAR = document.getElementById('Transport-Bar');

function reproducirMelodias(){

    TRANSPORT_BAR.animate([
        {transform:"translateX(0)"},
        {transform:"translateX(40vw)"}
    ],{
        iterations:1,
        easing: "linear",
        fill:"forwards",
        duration:10000
    })
    

}   

// Obtiene la posición X del elemento relativa al contenedor a cada segundo
const startTime = performance.now();
const duration = 10000;
const interval = 1000; // Intervalo de tiempo en milisegundos (1 segundo)

function obtenerPosicionX() {
  const currentTime = performance.now() - startTime;
  if (currentTime <= duration) {
    const contenedorRect = CONTENEDOR_SECUENCIADOR_DE_MELODIAS.getBoundingClientRect();
    const transportBarRect = TRANSPORT_BAR.getBoundingClientRect();

    // Calcula la posición X relativa al contenedor
    const posicionXRelativa = transportBarRect.left - contenedorRect.left;

    console.log("Posición X relativa:", posicionXRelativa);

    // Solicita la siguiente actualización
    requestAnimationFrame(obtenerPosicionX);
  }
}

obtenerPosicionX();




reproducirMelodias()

