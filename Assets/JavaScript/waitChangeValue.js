

async function waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedad,value){

    return new Promise((resolve,reject)=>{

        let requestAnimationID;

        function comprobarConstantemente(){

            requestAnimationID = requestAnimationFrame(comprobarConstantemente);

            let scope = localScope;

            let variableOpropiedadEsDiferenteAvalue = eval(`scope.${nombreVariableOpropiedad}!==${value}`);

            if(variableOpropiedadEsDiferenteAvalue){
                resolve({nombreVariable:nombreVariableOpropiedad,valorNuevo:eval(`${nombreVariableOpropiedad}`),valorAntiguo:value});
                cancelAnimationFrame(requestAnimationID)
            }
        }

        comprobarConstantemente();

    })

}

async function waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedad,value){

    return new Promise((resolve,reject)=>{

        let requestAnimationID;

        function comprobarConstantemente(){

            requestAnimationID = requestAnimationFrame(comprobarConstantemente);

            let scope = localScope;

            let variableOpropiedadEsIgualAvalue = eval(`scope.${nombreVariableOpropiedad}==${value}`);

            if(variableOpropiedadEsIgualAvalue){
                resolve({nombreVariable:nombreVariableOpropiedad,valorNuevo:eval(`${nombreVariableOpropiedad}`),valorAntiguo:value});
                cancelAnimationFrame(requestAnimationID)
            }
        }

        comprobarConstantemente();

    })

}


function eventoDeVariableEsDiferenteDe(localScope,nombreVariableOpropiedad,value,constantemente,callbackEventoIniciado,callbackEventoTerminado){

    waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedad,value)
        .then((resolve)=>{

            let requestAnimationFrameEvento;

            if(constantemente==true){

                function ejecutandoCallbackConstantemente(){

                    requestAnimationFrameEvento = requestAnimationFrame(ejecutandoCallbackConstantemente);
                    callbackEventoIniciado(resolve);

                }

                ejecutandoCallbackConstantemente();

            }else{
                callbackEventoIniciado(resolve);
            }
            
            waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedad,value)
                .then((resolve)=>{
                    if(constantemente==true) cancelAnimationFrame(requestAnimationFrameEvento);
                    if(callbackEventoTerminado!==undefined) callbackEventoTerminado(resolve);
                    eventoDeVariableEsDiferenteDe(localScope,nombreVariableOpropiedad,value,callbackEventoIniciado,callbackEventoTerminado);
                })
            return resolve;
        })

}

function eventoDeVariableEsIgualA(localScope,nombreVariableOpropiedad,value,constantemente,callbackEventoIniciado,callbackEventoTerminado){
    waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedad,value)
        .then((resolve)=>{
            
            let requestAnimationFrameEvento;

            if(constantemente==true){

                function ejecutandoCallbackConstantemente(){

                    requestAnimationFrameEvento = requestAnimationFrame(ejecutandoCallbackConstantemente);
                    callbackEventoIniciado(resolve);

                }

                ejecutandoCallbackConstantemente();

            }else{
                callbackEventoIniciado(resolve);
            }

            waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedad,value)
                .then((resolve)=>{

                    if(constantemente==true) cancelAnimationFrame(requestAnimationFrameEvento);
                    if(callbackEventoTerminado!==undefined) callbackEventoTerminado(resolve);
                    eventoDeVariableEsIgualA(localScope,nombreVariableOpropiedad,value,constantemente,callbackEventoIniciado,callbackEventoTerminado);

                })
        })
    
}




