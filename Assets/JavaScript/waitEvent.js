// CREATED BY JUAN CHAVEZ ;)

function waitEvent(HTMLElement,typeEvent){
    
    return new Promise((resolve,reject)=>{
        let ocurrioElEvento = false;

        HTMLElement.addEventListener(typeEvent,()=>{
            ocurrioElEvento = true;
        })
    
        let esperandoEvento;

        function probando(){
            
            esperandoEvento = requestAnimationFrame(probando);

            if(ocurrioElEvento){
                resolve();  
                cancelAnimationFrame(esperandoEvento);
            }           
        }
        
        probando();

    })

}


function hacerAlgoLuegoQueOcurraUnEvento(Callback,HTMLElement,typeEvent){
    
    let ocurrioElEvento = waitEvent(HTMLElement,typeEvent)
    
    ocurrioElEvento
        .then(()=>{
            Callback();
        })
}

hacerAlgoLuegoQueOcurraUnEvento(()=>console.log("Hola juan"),document.getElementById('analizador'),"click");







