// EVENTO CLICK

var mapaDeEventosClick = new Map();
var eventosClickID = 0;

function agregarEventoClick(querySelectorOElementoHTML,callback){
   mapaDeEventosClick.set(eventosClickID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback})    
   return eventosClickID++;;
}

document.addEventListener('click',(e)=>{

    mapaDeEventosClick.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});

// EVENTO MOUSEMOVE

var mapaDeEventosMouseMove = new Map();
var eventosMouseMoveID = 0;

function agregarEventoMouseMove(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseMove.set(eventosMouseMoveID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback})     
    return eventosMouseMoveID++;;
}

document.addEventListener('mousemove',(e)=>{

    mapaDeEventosMouseMove.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEOUT

var mapaDeEventosMouseOut = new Map();
var eventosMouseOutID = 0;

function agregarEventoMouseOut(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseOut.set(eventosMouseOutID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseOutID++;
}

document.addEventListener('mouseout',(e)=>{

    mapaDeEventosMouseOut.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
        ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEDOWN

var mapaDeEventosMouseDown = new Map();
var eventosMouseDownID = 0;

function agregarEventoMouseDown(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseDown.set(eventosMouseDownID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseDownID++;
}

document.addEventListener('mousedown',(e)=>{

    mapaDeEventosMouseDown.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEUP

var mapaDeEventosMouseUp = new Map();
var eventosMouseUpID = 0;

function agregarEventoMouseUp(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseUp.set(eventosMouseUpID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseUpID++;
}

document.addEventListener('mouseup',(e)=>{

    mapaDeEventosMouseUp.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


/**
 * 
 * @param {*} typeEvent aqui escoges que tipo de evento quieres agregar, ejemplo: click,mousemove,etc
 * @param {*} querySelector este parametro solicita un selector css para el/los elemento(s) que quieres que se aplique el evento
 * @param {*} callback funcion que se ejecutara cada vez que se dispare el evento
 * @returns devuelve un Id del evento que añadiste, con el cual podras eliminar el evento mediante la funcion eliminarEventoDelegado
 */
function delegarEvento(typeEvent,querySelectorOrElement,callback){
    switch (typeEvent) {
        case "click":
            return agregarEventoClick(querySelectorOrElement,callback);

        case "mousemove":
            return agregarEventoMouseMove(querySelectorOrElement,callback);
            
        case "mouseout":
            return agregarEventoMouseOut(querySelectorOrElement,callback);

        case "mousedown":
            return agregarEventoMouseDown(querySelectorOrElement,callback);
        
        case "mouseup":
            return agregarEventoMouseUp(querySelectorOrElement,callback);

        case "mouseover":

        default:
            console.log("Error 132, delegacionDeEvento.js")
        break;
    }
};



function eliminarEventoDelegado(typeEvent,idEvento){
    switch (typeEvent) {
        case "click":
            mapaDeEventosClick.delete(idEvento);
        break;

        case "mousemove":
            mapaDeEventosMouseMove.delete(idEvento);
        break;

        case "mouseout":
            mapaDeEventosMouseOut.delete(idEvento);
        break;

        case "mousedown":
            mapaDeEventosMouseDown.delete(idEvento);
        break;

        case "mouseup":
            mapaDeEventosMouseUp.delete(idEvento);
        break;

        default:
            console.log("Error 162, delegacionDeEvento.js")
        break;
    }
};

