//===================================================================
// SECUENCIADOR DE MELODIAS
//===================================================================

var CANTIDAD_DE_COMPASES = 4


// function crearElementoNotaConCiertaLongitud(e){
//     e.preventDefault()
    


// }

// delegarEvento('click','.Cuadro-Semicorchea',crearElementoNotaConCiertaLongitud)


// document.getElementById('secuenciador-melodias-marco').addEventListener('mousemove',()=>{
//     console.log("HOla")
// })


let parentElement = document.getElementById('Piano-Roll');
let isDragging = false;
let offsetX, offsetY;

parentElement.addEventListener('mousedown', createDraggableDiv);

function createDraggableDiv(event) {
    if (event.target.classList.contains('draggable')) return; // Evitar crear nuevo div si se hace clic en uno existente

    let newDiv = document.createElement('div');
    newDiv.className = 'draggable';
    newDiv.style.width = '50px';
    newDiv.style.height = '50px';
    newDiv.style.backgroundColor = 'red';
    newDiv.style.position = 'absolute';
    newDiv.style.cursor = 'grab';

    function onMouseDown(e) {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        newDiv.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
    }

    function onMouseUp() {
        isDragging = false;
        newDiv.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        const x = e.clientX - parentElement.getBoundingClientRect().left - offsetX;
        const y = e.clientY - parentElement.getBoundingClientRect().top - offsetY;

        // Verificar que el nuevo div no se salga del contenedor
        const maxX = parentElement.clientWidth - newDiv.clientWidth;
        const maxY = parentElement.clientHeight - newDiv.clientHeight;
        newDiv.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        newDiv.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }

    newDiv.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    parentElement.appendChild(newDiv);

    // Iniciar arrastre automáticamente
    onMouseDown(event);
}