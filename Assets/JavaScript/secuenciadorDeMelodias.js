//===================================================================
// SECUENCIADOR DE MELODIAS
//==================================================================

const SECUENCIADOR_DE_MELODIAS_MARCO = document.getElementById('secuenciador-melodias-marco')

// Este evento servira para que cuando estemos usando el rodillo 
// en el secuenciador de melodias, no podamos hacer uso de las
// barras de desplazamiento del navegador
SECUENCIADOR_DE_MELODIAS_MARCO.addEventListener('wheel', (event) => {
    event.preventDefault(); // Evita el scroll predeterminado del navegador
    const scrollStep = 250; // Ajusta la cantidad de desplazamiento por rueda
    scrollableDiv.scrollTop += event.deltaY > 0 ? scrollStep : -scrollStep;
  });




const PIANO_ROLL = document.getElementById('Piano-Roll');
const NOTAS_SECUENCIADOR_DE_MELODIAS = [];
var acumuladorParaNotasIDs = 0;

// Evento de mousedown en PIANO_ROLL, para que cuando se haga click se cree una nueva Nota
PIANO_ROLL.addEventListener('mousedown',(e)=>{
    NOTAS_SECUENCIADOR_DE_MELODIAS[acumuladorParaNotasIDs++] = new NotaSecuenciadorDeMelodias(e);    
})


// Variables que seran de uso compartido entre instancias de la clase NotaSecuenciadorDeMelodias
var CANTIDAD_DE_COMPASES = 8
const Nombre_Clase_para_las_notas = 'Secuenciador-Melodias-NOTA';
let isDraggingNote = false;
let offsetX, offsetY;
let currentDraggingNote;
let ultimoCuadroSemicorchea;
let isResizing = false;
let lastX;
let originalWidth = 0;

const PIXELES_DE_SENSIBILIDAD = 20;

class NotaSecuenciadorDeMelodias{

    constructor(evento){        

        if (evento.target.classList.contains(Nombre_Clase_para_las_notas)) return; // Evitar crear nuevo div si se hace clic en uno existente
        
        let newDiv = document.createElement('div');
        newDiv.className = Nombre_Clase_para_las_notas;
        newDiv.style.width = `${1.975*CANTIDAD_DE_COMPASES}vw`;
        newDiv.style.height = '1.5vw';
        newDiv.style.backgroundColor = 'rgb(205, 104, 255)';
        newDiv.style.position = 'absolute';
        newDiv.style.cursor = 'grab';
        newDiv.style.borderRadius = '0.3vw';
        newDiv.style.boxShadow = '0px 0px 0.9vw 0.4vw rgba(0, 0, 0, .5) inset';
        newDiv.style.border = '0.1vw solid rgb(185, 84, 235)';
        newDiv.style.opacity = '0.9'

        function onMouseDown(e) {            
            if(e.button==0){

                if (e.offsetX >= newDiv.offsetWidth - PIXELES_DE_SENSIBILIDAD) { // Solo en el borde derecho
                    isResizing = true;
                    lastX = e.clientX;
                    originalWidth = newDiv.offsetWidth;
                }else{
                    isDraggingNote = true;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    newDiv.style.cursor = 'grabbing';
                    currentDraggingNote = newDiv;
                    moverPosicionDelElementoAPosicionDelCursor(e,newDiv)
                }                
                document.addEventListener('mousemove', onMouseMove);

            }else{
                if(e.target.className==Nombre_Clase_para_las_notas){
                    e.target.remove();

                }
            }            
        }

        function onMouseUp() {
            isDraggingNote = false;
            newDiv.style.cursor = 'grab';
            currentDraggingNote = null;
            document.removeEventListener('mousemove', onMouseMove);
            isResizing = false;
        }
        
        function onMouseMove(e) {
            if (!isDraggingNote && !isResizing) return;
            moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e,newDiv);            
        }
        
        newDiv.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        
        
        PIANO_ROLL.appendChild(newDiv);


        // Iniciar arrastre automáticamente
        onMouseDown(evento);
    }

}


//FUNCIONES DE POSICIONAMIENTO PARA LA CLASE  
    // Funcion para mousemove de las Notas
    function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e, divArrastrado){
        if(isResizing){
            const deltaX = e.clientX - lastX;
            const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
            divArrastrado.style.width = `${Math.max(newWidth, 0)}px`;          
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
            
            let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
            let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0]
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
    // Funcion para mouseDown de las notas
    function moverPosicionDelElementoAPosicionDelCursor(e, divArrastrado){
        const x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
        const y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;        
        // Verificar que el nuevo div no se salga del contenedor
        const maxX = PIANO_ROLL.clientWidth - divArrastrado.clientWidth;
        const maxY = PIANO_ROLL.clientHeight - divArrastrado.clientHeight;
        divArrastrado.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
        divArrastrado.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;
    }

// FUNCION PARA ACOMODAR TODAS LAS NOTAS
function acomodarNotas(e){

}

window.addEventListener('resize',acomodarNotas)

    
    //------------------------------------------------------------------
    // CREACION DE NOTAS                                               |     
    //------------------------------------------------------------------
    // const Nombre_Clase_para_las_notas = 'Secuenciador-Melodias-NOTA'
    // let PIANO_ROLL = document.getElementById('Piano-Roll');
    // let isDraggingNote = false;
    // let offsetX, offsetY;
    // let currentDraggingNote;
    // let ultimoCuadroSemicorchea;
  
    // PIANO_ROLL.addEventListener('mousedown', createDraggableDiv);

    // function createDraggableDiv(event) {
    //     if (event.target.classList.contains('draggable')) return; // Evitar crear nuevo div si se hace clic en uno existente

    //     let newDiv = document.createElement('div');
    //     newDiv.className = Nombre_Clase_para_las_notas;
    //     newDiv.style.width = `${1.975*CANTIDAD_DE_COMPASES}vw`;
    //     newDiv.style.height = '1.5vw';
    //     newDiv.style.backgroundColor = 'rgb(205, 104, 255)';
    //     newDiv.style.position = 'absolute';
    //     newDiv.style.cursor = 'grab';
    //     newDiv.style.borderRadius = '0.3vw';
    //     newDiv.style.boxShadow = '0px 0px 0.9vw 0.4vw rgba(0, 0, 0, .5) inset';
    //     newDiv.style.border = '0.1vw solid rgb(185, 84, 235)';
    //     newDiv.style.opacity = '0.9'
    //     function onMouseDown(e) {

    //         if(e.button==0){
    //             isDraggingNote = true;
    //             offsetX = e.offsetX;
    //             offsetY = e.offsetY;
    //             newDiv.style.cursor = 'grabbing';
    //             currentDraggingNote = newDiv;
    //             document.addEventListener('mousemove', onMouseMove);
    //             moverPosicionDelElementoAPosicionDelCursor(e)
    //         }else{
    //             if(e.target.className=="draggable"){
    //                 e.target.remove();
    //             }
    //         }

    //     }

    //     function moverPosicionDelElementoAPosicionDelCursor(e){
    //         const x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
    //         const y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;

    //         // Verificar que el nuevo div no se salga del contenedor
    //         const maxX = PIANO_ROLL.clientWidth - newDiv.clientWidth;
    //         const maxY = PIANO_ROLL.clientHeight - newDiv.clientHeight;
    //         newDiv.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
    //         newDiv.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;
    //     }

    //     function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e){
    //         let x = e.clientX - PIANO_ROLL.getBoundingClientRect().left - offsetX;
    //         let y = e.clientY - PIANO_ROLL.getBoundingClientRect().top - offsetY;

    //         // Verificar que el nuevo div no se salga del contenedor
    //         let maxX = PIANO_ROLL.clientWidth - newDiv.clientWidth;
    //         let maxY = PIANO_ROLL.clientHeight - newDiv.clientHeight;
    //         newDiv.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
    //         newDiv.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;

    //         let coordernadaDraggingNoteX = newDiv.getBoundingClientRect().left;
    //         let coordernadaDraggingNoteY = newDiv.getBoundingClientRect().top;
            
    //         let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
    //         let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0]
    //         if(elementUnderCursorGrilla){
    //             newDiv.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,elementUnderCursorGrilla).distanciaHorizontalPX,'vw')[0] + "vw"
    //             newDiv.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,elementUnderCursorGrilla).distanciaVerticalPX,'vw')[0] + "vw"
    //             ultimoCuadroSemicorchea = elementUnderCursorGrilla;
    //         }else{
    //             newDiv.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,ultimoCuadroSemicorchea).distanciaHorizontalPX,'vw')[0] + "vw"
    //             newDiv.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(PIANO_ROLL,ultimoCuadroSemicorchea).distanciaVerticalPX,'vw')[0] + "vw"
    //         }

    //     }
        
    //     function onMouseUp() {
    //         isDraggingNote = false;
    //         newDiv.style.cursor = 'grab';
    //         currentDraggingNote = null;
    //         document.removeEventListener('mousemove', onMouseMove);
    //     }

    //     function onMouseMove(e) {
    //         if (!isDraggingNote) return;
    //         moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e);
            
    //     }

    //     newDiv.addEventListener('mousedown', onMouseDown);
    //     document.addEventListener('mouseup', onMouseUp);


    //     PIANO_ROLL.appendChild(newDiv);


    //     // Iniciar arrastre automáticamente
    //     onMouseDown(event);
    //     makeResizableByRight(newDiv)
    // }



