// EVENTO CLICK

var mapaDeEventosClick = new Map();
var eventosClickID = 0;

function agregarEventoClick(querySelector,callback){
   mapaDeEventosClick.set(eventosClickID,{selector:querySelector,callback:callback})    
   return eventosClickID++;;
}

document.addEventListener('click',(e)=>{

    mapaDeEventosClick.forEach((Evento)=>{
        if(e.target.matches(Evento.selector)){
            Evento.callback();
        }
    })

});

// EVENTO MOUSEMOVE

var mapaDeEventosMouseMove = new Map();
var eventosMouseMoveID = 0;

function agregarEventoMouseMove(querySelector,callback){
    mapaDeEventosMouseMove.set(eventosMouseMoveID,{selector:querySelector,callback:callback})     
    return eventosMouseMoveID++;;
}

document.addEventListener('mousemove',(e)=>{

    mapaDeEventosMouseMove.forEach((Evento)=>{
        if(e.target.matches(Evento.selector)){
            Evento.callback();
        }
    })

});


// EVENTO MOUSEOUT

var mapaDeEventosMouseOut = new Map();
var eventosMouseOutID = 0;

function agregarEventoMouseOut(querySelector,callback){
    mapaDeEventosMouseOut.set(eventosMouseOutID,{selector:querySelector,callback:callback});    
    return eventosMouseOutID++;
}

document.addEventListener('mouseout',(e)=>{

    mapaDeEventosMouseOut.forEach((Evento)=>{
        if(e.target.matches(Evento.selector)){
            Evento.callback();
        }
    })

});


// EVENTO MOUSEDOWN

var mapaDeEventosMouseDown = new Map();
var eventosMouseDownID = 0;

function agregarEventoMouseDown(querySelector,callback){
    mapaDeEventosMouseDown.set(eventosMouseDownID,{selector:querySelector,callback:callback});    
    return eventosMouseDownID++;
}

document.addEventListener('mousedown',(e)=>{

    mapaDeEventosMouseDown.forEach((Evento)=>{
        if(e.target.matches(Evento.selector)){
            Evento.callback();
        }
    })

});


// EVENTO MOUSEUP

var mapaDeEventosMouseUp = new Map();
var eventosMouseUpID = 0;

function agregarEventoMouseUp(querySelector,callback){
    mapaDeEventosMouseUp.set(eventosMouseUpID,{selector:querySelector,callback:callback});    
    return eventosMouseUpID++;
}

document.addEventListener('mouseup',(e)=>{

    mapaDeEventosMouseUp.forEach((Evento)=>{
        if(e.target.matches(Evento.selector)){
            Evento.callback();
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
function delegarEvento(typeEvent,querySelector,callback){
    switch (typeEvent) {
        case "click":
            return agregarEventoClick(querySelector,callback);

        case "mousemove":
            return agregarEventoMouseMove(querySelector,callback);
            
        case "mouseout":
            return agregarEventoMouseOut(querySelector,callback);

        case "mousedown":
            return agregarEventoMouseDown(querySelector,callback);
        
        case "mouseup":
            return agregarEventoMouseUp(querySelector,callback);

        default:
            console.log("Error 124, delegacionDeEvento.js")
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
            console.log("Error 152, delegacionDeEvento.js")
        break;
    }
};

