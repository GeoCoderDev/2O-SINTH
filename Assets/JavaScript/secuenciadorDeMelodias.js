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
    newDiv.style.width = '7.9vw';
    newDiv.style.height = '1.4vw';
    newDiv.style.backgroundColor = 'rgb(205, 104, 255)';
    newDiv.style.position = 'absolute';
    newDiv.style.cursor = 'grab';
    newDiv.style.borderRadius = '0.2vw';
    newDiv.style.boxShadow = '0px 0px 0.9vw 0.4vw rgba(0, 0, 0, .5) inset';

    function onMouseDown(e) {

        if(e.button!=2){
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            newDiv.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
        }else{
            e.target.remove();
        }

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