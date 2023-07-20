//===================================================================
// SECUENCIADOR DE MELODIAS
//===================================================================

var CANTIDAD_DE_COMPASES = 4



function obtenerDistanciaRelativa(ancestro, descendiente) {
    let elementoActual = descendiente;
    let distanciaHorizontal = 0;
    let distanciaVertical = 0;

    while (elementoActual && elementoActual !== ancestro) {
        distanciaHorizontal += elementoActual.offsetLeft;
        distanciaVertical += elementoActual.offsetTop;
        elementoActual = elementoActual.offsetParent;
    }

    return { distanciaHorizontal, distanciaVertical };
}




let parentElement = document.getElementById('Piano-Roll');
let isDraggingNote = false;
let offsetX, offsetY;
let currentDraggingNote

parentElement.addEventListener('mousedown', createDraggableDiv);

function createDraggableDiv(event) {
    if (event.target.classList.contains('draggable')) return; // Evitar crear nuevo div si se hace clic en uno existente

    let newDiv = document.createElement('div');
    newDiv.className = 'draggable';
    newDiv.style.width = '7.9vw';
    newDiv.style.height = '1.45vw';
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
        newDiv.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        newDiv.style.top = `${Math.max(20, Math.min(y, maxY))}px`;
    }

    function moverPosicionDelElementoAPosicionDelCursorRespetandoGrilla(e){
        let x = e.clientX - parentElement.getBoundingClientRect().left - offsetX;
        let y = e.clientY - parentElement.getBoundingClientRect().top - offsetY;

        // Verificar que el nuevo div no se salga del contenedor
        let maxX = parentElement.clientWidth - newDiv.clientWidth;
        let maxY = parentElement.clientHeight - newDiv.clientHeight;
        newDiv.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        newDiv.style.top = `${Math.max(20, Math.min(y, maxY))}px`;

        let coordernadaDraggingNoteX = newDiv.getBoundingClientRect().left;
        let coordernadaDraggingNoteY = newDiv.getBoundingClientRect().top;
      
        let elementsUnderCursor = document.elementsFromPoint(coordernadaDraggingNoteX, coordernadaDraggingNoteY);
        let elementUnderCursorGrilla = elementsUnderCursor.filter((element) => element.className=='Cuadro-Semicorchea')[0]
        console.log(elementUnderCursorGrilla,elementUnderCursorGrilla.style.left)
        newDiv.style.left = obtenerDistanciaRelativa(parentElement,elementUnderCursorGrilla).distanciaHorizontal + "px"
        newDiv.style.top = obtenerDistanciaRelativa(parentElement,elementUnderCursorGrilla).distanciaVertical + "px"


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
}

