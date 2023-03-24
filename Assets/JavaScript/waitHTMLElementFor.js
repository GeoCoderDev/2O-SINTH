// CREATED BY JUAN CHAVEZ ;)

async function waitHTMLElementFor(id){
    
    return new Promise((resolve,reject)=>{

        
        function comprobandoExistenciaEnDocumento(){
            
            let esperandoElemento = requestAnimationFrame(comprobandoExistenciaEnDocumento)
            
            if(document.getElementById(id)) {
                resolve();
                cancelAnimationFrame(esperandoElemento);

            }
        }

        comprobandoExistenciaEnDocumento();


    });

}


function agregarEventoLuegoQueSeCreeUnElementoHTML(id,typeEvent,callBack,elementoDesaparece=false,promesas){

    let esperandoElemento = waitHTMLElementFor(id);
    
    esperandoElemento
        .then(()=>{
            if(elementoDesaparece==true){                

                let anadirElementoConstantemente;
                let yaSeAnadioEvento = false;

                function anadiendo(){

                    anadirElementoConstantemente= requestAnimationFrame(anadiendo);

                    if(document.getElementById(id)){

                        if(!yaSeAnadioEvento){
                            document.getElementById(id).addEventListener(typeEvent,callBack);
                            yaSeAnadioEvento = true;
                        }

                    }else{

                        yaSeAnadioEvento = false;

                    }

                }

                anadiendo();
                
                // CARRERA DE PROMESAS
                if(promesas!==undefined){
                    Promise.race(promesas)
                        .then(()=>{
                            cancelAnimationFrame(anadirElementoConstantemente);
                        })
                }

            }else{
                document.getElementById(id).addEventListener(typeEvent,callBack);
            }
        })

}

// No necesario con la delegacion de eventos SORRY//