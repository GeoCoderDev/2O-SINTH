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
    SECUENCIADOR_DE_MELODIAS_MARCO.scrollTop += event.deltaY > 0 ? scrollStep : -scrollStep;
  });




const PIANO_ROLL = document.getElementById('Piano-Roll');
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
var CANTIDAD_DE_COMPASES = 4
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

        if (evento.target.classList.contains(Nombre_Clase_para_las_notas)) return; // Evitar crear nuevo div si se hace clic en uno existente
        
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
                if ((!(e.offsetX >= this.elementoHTML.offsetWidth - PIXELES_DE_SENSIBILIDAD))||forzado) { // Solo en el borde derecho
                    isDraggingNote = true;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    this.elementoHTML.style.cursor = 'grabbing';
                    PIANO_ROLL.style.cursor = 'grabbing';
                    currentDraggingNote = this.elementoHTML;
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
            currentDraggingNote = null;
            document.removeEventListener('mousemove', onMouseMove);
            isResizing = false;
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


// FUNCION PARA ACOMODAR TODAS LAS NOTAS

const Todos_los_cuadros_semicorchea = document.querySelectorAll('.Cuadro-Semicorchea');



function acomodarNotaVerticalmente(notaHTML){

}


function acomodarNotas(e){
    
    
}

window.addEventListener('resize',acomodarNotas)

    