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





var CANTIDAD_DE_COMPASES = 8
const NOTAS_SECUENCIADOR_DE_MELODIAS = [];
var acumuladorParaNotasIDs = 0;



document.addEventListener('mousedown',(e)=>{
    NOTAS_SECUENCIADOR_DE_MELODIAS[acumuladorParaNotasIDs++] = new NotaSecuenciadorDeMelodias(e);
})

class NotaSecuenciadorDeMelodias{

    constructor(evento){
        this.EventoMouseDown = evento;
    }

}
    
    //------------------------------------------------------------------
    // CREACION DE NOTAS                                               |     
    //------------------------------------------------------------------
    const Nombre_Clase_para_las_notas = 'Secuenciador-Melodias-NOTA'
    let parentElement = document.getElementById('Piano-Roll');
    let isDraggingNote = false;
    let offsetX, offsetY;
    let currentDraggingNote;
    let ultimoCuadroSemicorchea;
  
    parentElement.addEventListener('mousedown', createDraggableDiv);

    function createDraggableDiv(event) {
        if (event.target.classList.contains('draggable')) return; // Evitar crear nuevo div si se hace clic en uno existente

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
                isDraggingNote = true;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
                newDiv.style.cursor = 'grabbing';
                currentDraggingNote = newDiv;
                document.addEventListener('mousemove', onMouseMove);
                moverPosicionDelElementoAPosicionDelCursor(e)
            }else{
                if(e.target.className=="draggable"){
                    e.target.remove();
                }
            }

        }

        function moverPosicionDelElementoAPosicionDelCursor(e){
            const x = e.clientX - parentElement.getBoundingClientRect().left - offsetX;
            const y = e.clientY - parentElement.getBoundingClientRect().top - offsetY;

            // Verificar que el nuevo div no se salga del contenedor
            const maxX = parentElement.clientWidth - newDiv.clientWidth;
            const maxY = parentElement.clientHeight - newDiv.clientHeight;
            newDiv.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
            newDiv.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;
        }

        function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e){
            let x = e.clientX - parentElement.getBoundingClientRect().left - offsetX;
            let y = e.clientY - parentElement.getBoundingClientRect().top - offsetY;

            // Verificar que el nuevo div no se salga del contenedor
            let maxX = parentElement.clientWidth - newDiv.clientWidth;
            let maxY = parentElement.clientHeight - newDiv.clientHeight;
            newDiv.style.left = `${pixelsToVWVH(Math.max(0, Math.min(x, maxX)),'vw')[0]}vw`;
            newDiv.style.top = `${pixelsToVWVH(Math.max(20, Math.min(y, maxY)),'vw')[0]}vw`;

            let coordernadaDraggingNoteX = newDiv.getBoundingClientRect().left;
            let coordernadaDraggingNoteY = newDiv.getBoundingClientRect().top;
            
            let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
            let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0]
            if(elementUnderCursorGrilla){
                newDiv.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(parentElement,elementUnderCursorGrilla).distanciaHorizontalPX,'vw')[0] + "vw"
                newDiv.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(parentElement,elementUnderCursorGrilla).distanciaVerticalPX,'vw')[0] + "vw"
                ultimoCuadroSemicorchea = elementUnderCursorGrilla;
            }else{
                newDiv.style.left = pixelsToVWVH(distanciaRelativaEntreElementos(parentElement,ultimoCuadroSemicorchea).distanciaHorizontalPX,'vw')[0] + "vw"
                newDiv.style.top = pixelsToVWVH(distanciaRelativaEntreElementos(parentElement,ultimoCuadroSemicorchea).distanciaVerticalPX,'vw')[0] + "vw"
            }

        }
        
        function onMouseUp() {
            isDraggingNote = false;
            newDiv.style.cursor = 'grab';
            currentDraggingNote = null;
            document.removeEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(e) {
            if (!isDraggingNote) return;
            moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e);
            
        }

        newDiv.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);


        parentElement.appendChild(newDiv);


        // Iniciar arrastre automáticamente
        onMouseDown(event);
        makeResizableByRight(newDiv)
    }





    function makeResizableByRight(elementoHTML) {
        const resizableDiv = elementoHTML;
    
        let isResizing = false;
        let lastX = 0;
        let originalWidth = 0;
    
        resizableDiv.style.position = 'absolute'; // Asegurarse de que el elemento tenga posición relativa o absoluta
    
        resizableDiv.addEventListener('mousedown', (e) => {
            if (e.offsetX >= resizableDiv.offsetWidth - 20) { // Solo en el borde derecho
                isResizing = true;
                lastX = e.clientX;
                originalWidth = resizableDiv.offsetWidth;
            }
        });
    
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
    
            const deltaX = e.clientX - lastX;
            const newWidth = originalWidth + deltaX; // Cambiamos aquí para que el elemento se redimensione hacia la derecha
            resizableDiv.style.width = `${Math.max(newWidth, 0)}px`;
        });
    
        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }