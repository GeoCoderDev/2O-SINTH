

async function waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedadOcondicion,value){

    return new Promise((resolve,reject)=>{

        let requestAnimationID;

        function comprobarConstantemente(){

            requestAnimationID = requestAnimationFrame(comprobarConstantemente);

            let scope = localScope;

            let variableOpropiedadEsDiferenteAvalue = eval(`${nombreVariableOpropiedadOcondicion}!==${value}`);

            if(variableOpropiedadEsDiferenteAvalue){
                resolve({nombreVariable:nombreVariableOpropiedadOcondicion,valorNuevo:eval(`${nombreVariableOpropiedadOcondicion}`),valorAntiguo:value});
                cancelAnimationFrame(requestAnimationID)
            }
        }

        comprobarConstantemente();

    })

}

async function waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedadOcondicion,value){

    return new Promise((resolve,reject)=>{

        let requestAnimationID;

        function comprobarConstantemente(){

            requestAnimationID = requestAnimationFrame(comprobarConstantemente);

            let scope = localScope;

            let variableOpropiedadEsIgualAvalue = eval(`${nombreVariableOpropiedadOcondicion}==${value}`);

            if(variableOpropiedadEsIgualAvalue){
                cancelAnimationFrame(requestAnimationID);
                resolve({nombreVariable:nombreVariableOpropiedadOcondicion,valorNuevo:eval(`${nombreVariableOpropiedadOcondicion}`),valorAntiguo:value});
            }
        }

        comprobarConstantemente();

    })

}


function eventoDeVariableEsDiferenteDe(localScope,nombreVariableOpropiedadOcondicion,value,constantemente,callbackEventoIniciado,callbackEventoTerminado){

    waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedadOcondicion,value)
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
            
            waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedadOcondicion,value)
                .then((resolve)=>{
                    if(constantemente==true) cancelAnimationFrame(requestAnimationFrameEvento);
                    if(callbackEventoTerminado!==undefined) callbackEventoTerminado(resolve);
                    eventoDeVariableEsDiferenteDe(localScope,nombreVariableOpropiedadOcondicion,value,constantemente,callbackEventoIniciado,callbackEventoTerminado);
                })
            return resolve;
        })

}

function eventoDeVariableEsIgualA(localScope,nombreVariableOpropiedadOcondicion,value,constantemente,callbackEventoIniciado,callbackEventoTerminado){
    waitVariablePropertyValueEqualsTo(localScope,nombreVariableOpropiedadOcondicion,value)
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

            waitVariablePropertyValueDifferentTo(localScope,nombreVariableOpropiedadOcondicion,value)
                .then((resolve)=>{

                    if(constantemente==true) cancelAnimationFrame(requestAnimationFrameEvento);
                    if(callbackEventoTerminado!==undefined) callbackEventoTerminado(resolve);
                    eventoDeVariableEsIgualA(localScope,nombreVariableOpropiedadOcondicion,value,constantemente,callbackEventoIniciado,callbackEventoTerminado);

                })
        })
    
}




